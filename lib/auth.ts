import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Resend } from "resend";
import ResetPasswordEmail from "@/emails/reset-password-email";
import VerificationEmail from "@/emails/verification-email";
import SecurityAlertEmail from "@/emails/security-alert-email";
import AccountDeletedEmail from "@/emails/account-deleted-email";
import WelcomeEmail from "@/emails/welcome-email";
import { defaultAvatars, pickRandom } from "@/util/default";
import type React from "react";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.EMAIL_FROM || "FuelDev <fueldev@resend.dev>";
const resend = new Resend(RESEND_API_KEY);

// Enhanced error logging utility
class AuthLogger {
  static error(
    context: string,
    error: unknown,
    metadata?: Record<string, unknown>,
  ) {
    const errorDetails = {
      context,
      timestamp: new Date().toISOString(),
      error:
        error instanceof Error
          ? {
              message: error.message,
              name: error.name,
              stack:
                process.env.NODE_ENV === "development"
                  ? error.stack
                  : undefined,
            }
          : error,
      ...metadata,
    };

    console.error(
      `[FuelDev Auth Error - ${context}]`,
      JSON.stringify(errorDetails, null, 2),
    );

    // In production, send to monitoring service (e.g., Sentry)
    if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
      // Sentry.captureException(error, { contexts: { auth: errorDetails } });
    }
  }

  static info(
    context: string,
    message: string,
    metadata?: Record<string, unknown>,
  ) {
    console.log(`[FuelDev Auth - ${context}]`, message, metadata || "");
  }
}

// Check if device is trusted (has been used in last 30 days)
async function isDeviceTrusted(
  userId: string,
  ipAddress?: string | null,
  userAgent?: string | null,
): Promise<boolean> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Check if there's a recent session from the same device
    const recentSession = await prisma.session.findFirst({
      where: {
        userId,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return !!recentSession;
  } catch (error) {
    // If we can't check, err on the side of caution and don't send alert
    AuthLogger.error("Trusted Device Check Failed", error, {
      userId,
    });
    return true; // Assume trusted to avoid spam
  }
}

// Enhanced email sending with retry logic and proper error handling
async function sendEmailWithRetry(
  emailData: {
    from: string;
    to: string;
    subject: string;
    react: React.ReactElement;
  },
  userId?: string,
  maxRetries = 3,
): Promise<{ success: boolean; error?: string }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await resend.emails.send(emailData);

      if (response.error) {
        // Preserve statusCode by attaching it to the Error object
        const err = new Error(
          `Resend API error: ${response.error.message || "Unknown error"}`,
        ) as Error & { statusCode?: number };
        err.statusCode = response.error.statusCode ?? undefined;
        throw err;
      }

      AuthLogger.info("Email Sent", `Successfully sent ${emailData.subject}`, {
        userId,
        attempt,
      });

      return { success: true };
    } catch (error: unknown) {
      const isLastAttempt = attempt === maxRetries;

      // Check for specific Resend error types - statusCode now preserved
      const resendError = error as { statusCode?: number; message?: string };
      if (resendError?.statusCode === 429) {
        // Rate limit exceeded - don't retry immediately
        AuthLogger.error("Email Rate Limited", error, {
          userId,
          subject: emailData.subject,
        });

        if (!isLastAttempt) {
          await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
          continue;
        }
      }

      if (resendError?.statusCode === 422) {
        // Validation error - don't retry
        AuthLogger.error("Email Validation Error", error, {
          userId,
          subject: emailData.subject,
        });
        return { success: false, error: "Invalid email configuration" };
      }

      if (
        resendError?.statusCode &&
        resendError.statusCode >= 500 &&
        !isLastAttempt
      ) {
        // Server error - retry with exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt)),
        );
        continue;
      }

      AuthLogger.error("Email Send Failed", error, {
        userId,
        subject: emailData.subject,
        attempt,
        isLastAttempt,
      });

      if (isLastAttempt) {
        return { success: false, error: "Failed to send email after retries" };
      }
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

// Device info helpers
function getDeviceInfo(userAgent?: string): string {
  if (!userAgent) return "Unknown device";
  if (userAgent.includes("Mobile")) return "Mobile device";
  if (userAgent.includes("Tablet")) return "Tablet";
  return "Desktop";
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: false,
  }),
  experimental: {
    joins: true,
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      const result = await sendEmailWithRetry(
        {
          from: RESEND_FROM,
          to: user.email,
          subject: "Reset your FuelDev password",
          react: ResetPasswordEmail({ resetUrl: url }),
        },
        user.id,
      );

      if (!result.success) {
        AuthLogger.error(
          "Password Reset Email Failed",
          new Error(result.error),
          {
            userId: user.id,
          },
        );

        // Don't block the password reset flow - user can try again
        // Don't expose detailed error to client
        throw new Error(
          "Unable to send password reset email. Please try again later.",
        );
      }
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  socialProviders: {},
  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      const result = await sendEmailWithRetry(
        {
          from: RESEND_FROM,
          to: user.email,
          subject: "Verify your FuelDev email",
          react: VerificationEmail({ verifyUrl: url }),
        },
        user.id,
      );

      if (!result.success) {
        AuthLogger.error("Verification Email Failed", new Error(result.error), {
          userId: user.id,
        });

        // Log but don't block signup - user can request resend
      }
    },
  },
  user: {
    additionalFields: {
      image: {
        type: "string",
        required: false,
        input: false,
      },
    },
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        try {
          AuthLogger.info(
            "User Deletion Started",
            `Cleaning up data for user ${user.id}`,
          );

          // Use transaction for atomic cleanup
          await prisma.$transaction(
            async (tx) => {
              // Delete in correct order to respect foreign key constraints
              const [sessionsDeleted, accountsDeleted, verificationsDeleted] =
                await Promise.all([
                  tx.session.deleteMany({ where: { userId: user.id } }),
                  tx.account.deleteMany({ where: { userId: user.id } }),
                  tx.verification.deleteMany({
                    where: { identifier: user.email },
                  }),
                ]);

              AuthLogger.info("User Data Cleanup", `Deleted user data`, {
                userId: user.id,
                sessionsDeleted: sessionsDeleted.count,
                accountsDeleted: accountsDeleted.count,
                verificationsDeleted: verificationsDeleted.count,
              });
            },
            {
              timeout: 10000, // 10 second timeout
              maxWait: 5000, // Wait max 5 seconds for transaction to start
            },
          );
        } catch (error) {
          AuthLogger.error("User Deletion Cleanup Failed", error, {
            userId: user.id,
          });

          // Check for specific Prisma errors
          if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            "message" in error
          ) {
            const prismaError = error as { code: string; message: string };
            if (prismaError.code === "P2025") {
              // Record not found - data might already be deleted
              AuthLogger.info("Cleanup Skipped", "Related records not found", {
                userId: user.id,
              });
              return; // Continue with deletion
            }

            if (prismaError.code === "P2003") {
              // Foreign key constraint failed
              throw new Error(
                "Unable to delete account at this time. Please contact support.",
              );
            }
          }

          // For other errors, prevent deletion to maintain data integrity
          throw new Error(
            "Unable to delete account at this time. Please try again later.",
          );
        }
      },
      afterDelete: async (user) => {
        try {
          // Calculate actual user stats before deletion (if available)
          const accountCreatedDate = new Date(
            user.createdAt,
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          // Send deletion confirmation email (best effort)
          await sendEmailWithRetry(
            {
              from: RESEND_FROM,
              to: user.email,
              subject: "Your FuelDev account has been deleted",
              react: AccountDeletedEmail({
                userName: user.name || "User",
                userEmail: user.email,
                accountCreatedDate,
                totalSupport: "0", // TODO: Calculate from database before deletion
                projectsCreated: "0", // TODO: Calculate from database before deletion
              }),
            },
            user.id,
          );

          AuthLogger.info("Account Deleted", `Successfully deleted account`, {
            userId: user.id,
          });
        } catch (error) {
          // Don't throw - deletion already completed, email is nice-to-have
          AuthLogger.error("Account Deletion Email Failed", error, {
            userId: user.id,
          });
        }
      },
    },
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          try {
            const user = await prisma.user.findUnique({
              where: { id: session.userId },
              select: { id: true, email: true, name: true },
            });

            if (!user) {
              AuthLogger.error(
                "Session Alert Failed",
                new Error("User not found"),
                {
                  sessionId: session.id,
                  userId: session.userId,
                },
              );
              return;
            }

            // Check if this is a trusted device before sending security alert
            const isTrusted = await isDeviceTrusted(
              session.userId,
              session.ipAddress,
              session.userAgent,
            );

            // Only send security alert for new/untrusted devices
            if (!isTrusted) {
              AuthLogger.info(
                "New Device Login Detected",
                "Sending security alert",
                {
                  userId: user.id,
                  deviceInfo: getDeviceInfo(session.userAgent || undefined),
                },
              );

              sendEmailWithRetry(
                {
                  from: RESEND_FROM,
                  to: user.email,
                  subject: "New login to your FuelDev account",
                  react: SecurityAlertEmail({
                    userEmail: user.email,
                    alertType: "login",
                    deviceInfo: getDeviceInfo(session.userAgent || undefined),
                    location: "Unknown location", // TODO: Add IP geolocation
                    timestamp: formatTimestamp(new Date(session.createdAt)),
                    ipAddress: session.ipAddress || "Unknown",
                  }),
                },
                user.id,
              ).catch((error) => {
                // Silent fail - don't block login
                AuthLogger.error("Login Alert Email Failed", error, {
                  userId: user.id,
                });
              });
            } else {
              AuthLogger.info(
                "Trusted Device Login",
                "Skipping security alert for trusted device",
                {
                  userId: user.id,
                },
              );
            }
          } catch (error) {
            // Log but don't block session creation
            AuthLogger.error("Session Hook Failed", error, {
              sessionId: session.id,
              userId: session.userId,
            });
          }
        },
      },
    },
    user: {
      create: {
        after: async (user) => {
          try {
            // Get the current maximum joinIndex and increment by 1
            const maxJoinIndex = await prisma.user.aggregate({
              _max: {
                joinIndex: true,
              },
            });

            const nextJoinIndex = (maxJoinIndex._max.joinIndex ?? 0) + 1;

            // Assign a random default avatar and joinIndex to the new user
            const randomAvatar = pickRandom(defaultAvatars);

            await prisma.user.update({
              where: { id: user.id },
              data: {
                image: randomAvatar.url,
                joinIndex: nextJoinIndex,
              },
            });

            AuthLogger.info(
              "User Created",
              "Assigned random default avatar and joinIndex",
              {
                userId: user.id,
                avatarId: randomAvatar.id,
                joinIndex: nextJoinIndex,
              },
            );
          } catch (error) {
            // Log but don't block user creation
            AuthLogger.error("User Create Hook Failed", error, {
              userId: user.id,
            });
          }
        },
      },
      update: {
        after: async (user) => {
          try {
            // Check if this is an email verification (emailVerified is now set)
            // and account was created recently (within 1 hour)
            const isRecentAccount =
              user.createdAt &&
              Date.now() - new Date(user.createdAt).getTime() < 60 * 60 * 1000;

            const isEmailVerification =
              user.emailVerified && isRecentAccount;

            if (isEmailVerification) {
              // Send welcome email for newly verified accounts
              const firstName = user.name?.split(" ")[0] || "Creator";

              sendEmailWithRetry(
                {
                  from: RESEND_FROM,
                  to: user.email,
                  subject: "Welcome to FuelDev! Your journey starts now.",
                  react: WelcomeEmail({ firstName }),
                },
                user.id,
              ).catch((error) => {
                AuthLogger.error("Welcome Email Failed", error, {
                  userId: user.id,
                });
              });

              AuthLogger.info(
                "Email Verified",
                "Sent welcome email to newly verified user",
                { userId: user.id },
              );
            } else if (!isRecentAccount) {
              // Only send security alert for updates on established accounts
              // Skip for recent accounts to avoid duplicate emails during signup flow
              sendEmailWithRetry(
                {
                  from: RESEND_FROM,
                  to: user.email,
                  subject: "Your FuelDev account was updated",
                  react: SecurityAlertEmail({
                    userEmail: user.email,
                    alertType: "password_change",
                    deviceInfo: "Unknown device",
                    location: "Unknown location",
                    timestamp: formatTimestamp(new Date()),
                    ipAddress: "Unknown",
                  }),
                },
                user.id,
              ).catch((error) => {
                AuthLogger.error("Update Alert Email Failed", error, {
                  userId: user.id,
                });
              });
            }
          } catch (error) {
            // Log but don't block user update
            AuthLogger.error("User Update Hook Failed", error, {
              userId: user.id,
            });
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

// Enhanced user account deletion with proper error handling
// Framework-agnostic: accepts userId instead of importing next/headers
export async function deleteUserAccount(userId: string) {
  try {
    // Fetch the user first to trigger Better Auth's beforeDelete and afterDelete hooks
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      AuthLogger.error("Account Deletion Failed", new Error("User not found"), {
        userId,
      });
      return {
        success: false,
        error:
          "Unable to delete account at this time. Please try again later or contact support.",
      };
    }

    // Trigger beforeDelete hook manually
    if (auth.options.user?.deleteUser?.beforeDelete) {
      await auth.options.user.deleteUser.beforeDelete(user);
    }

    // Delete the user from database
    await prisma.user.delete({
      where: { id: userId },
    });

    // Trigger afterDelete hook manually
    if (auth.options.user?.deleteUser?.afterDelete) {
      await auth.options.user.deleteUser.afterDelete(user);
    }

    return { success: true, message: "Account deleted successfully" };
  } catch (error) {
    AuthLogger.error("Account Deletion Failed", error, {
      userId,
    });

    // Return generic user-friendly error - never expose internal error messages
    return {
      success: false,
      error:
        "Unable to delete account at this time. Please try again later or contact support.",
    };
  }
}

// Enhanced account deletion email sender
export async function sendAccountDeletionEmail(userData: {
  userName: string;
  userEmail: string;
  accountCreatedDate: string;
  totalSupport?: string;
  projectsCreated?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate email data
    if (!userData.userEmail || !userData.userName) {
      AuthLogger.error(
        "Account Deletion Email Validation Failed",
        new Error("Invalid user data: missing required fields"),
      );
      throw new Error("Invalid user data");
    }

    const result = await sendEmailWithRetry(
      {
        from: RESEND_FROM,
        to: userData.userEmail,
        subject: "Your FuelDev account has been deleted",
        react: AccountDeletedEmail({
          userName: userData.userName,
          userEmail: userData.userEmail,
          accountCreatedDate: userData.accountCreatedDate,
          totalSupport: userData.totalSupport || "0",
          projectsCreated: userData.projectsCreated || "0",
        }),
      },
      undefined, // userId not available in this context
    );

    return result;
  } catch (error) {
    AuthLogger.error("Account Deletion Email Failed", error);

    // Return generic error message - don't expose internal details
    return {
      success: false,
      error: "Unable to send confirmation email",
    };
  }
}

// Optional: Health check for email service
export async function checkEmailServiceHealth(): Promise<boolean> {
  try {
    if (!RESEND_API_KEY) {
      AuthLogger.error(
        "Email Config",
        new Error("RESEND_API_KEY not configured"),
      );
      return false;
    }

    // Resend doesn't have a health check endpoint, so we validate config
    return true;
  } catch {
    return false;
  }
}
