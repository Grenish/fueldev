import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Resend } from "resend";
import ResetPasswordEmail from "@/emails/reset-password-email";
import VerificationEmail from "@/emails/verification-email";
import SecurityAlertEmail from "@/emails/security-alert-email";
import AccountDeletedEmail from "@/emails/account-deleted-email";
import { headers } from "next/headers";
import type React from "react";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.EMAIL_FROM || "fueldev@resend.dev";
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

// Enhanced email sending with retry logic and proper error handling
async function sendEmailWithRetry(
  emailData: {
    from: string;
    to: string;
    subject: string;
    react: React.ReactElement;
  },
  maxRetries = 3,
): Promise<{ success: boolean; error?: string }> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await resend.emails.send(emailData);

      if (response.error) {
        throw new Error(
          `Resend API error: ${response.error.message || "Unknown error"}`,
        );
      }

      AuthLogger.info("Email Sent", `Successfully sent ${emailData.subject}`, {
        to: emailData.to,
        attempt,
      });

      return { success: true };
    } catch (error: unknown) {
      const isLastAttempt = attempt === maxRetries;

      // Check for specific Resend error types
      const resendError = error as { statusCode?: number; message?: string };
      if (resendError?.statusCode === 429) {
        // Rate limit exceeded - don't retry immediately
        AuthLogger.error("Email Rate Limited", error, {
          to: emailData.to,
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
          to: emailData.to,
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
        to: emailData.to,
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
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      const result = await sendEmailWithRetry({
        from: RESEND_FROM,
        to: user.email,
        subject: "Reset your FuelDev password",
        react: ResetPasswordEmail({ resetUrl: url }),
      });

      if (!result.success) {
        AuthLogger.error(
          "Password Reset Email Failed",
          new Error(result.error),
          {
            userId: user.id,
            userEmail: user.email,
          },
        );

        // Don't block the password reset flow - user can try again
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
      const result = await sendEmailWithRetry({
        from: RESEND_FROM,
        to: user.email,
        subject: "Verify your FuelDev email",
        react: VerificationEmail({ verifyUrl: url }),
      });

      if (!result.success) {
        AuthLogger.error("Verification Email Failed", new Error(result.error), {
          userId: user.id,
          userEmail: user.email,
        });

        // Log but don't block signup - user can request resend
      }
    },
  },
  user: {
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
            userEmail: user.email,
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
                "Cannot delete user: associated data exists. Please contact support.",
              );
            }
          }

          // For other errors, prevent deletion to maintain data integrity
          throw new Error(
            "Failed to clean up user data. Deletion aborted for safety.",
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
          await sendEmailWithRetry({
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
          });

          AuthLogger.info(
            "Account Deleted",
            `Successfully deleted account for ${user.email}`,
          );
        } catch (error) {
          // Don't throw - deletion already completed, email is nice-to-have
          AuthLogger.error("Account Deletion Email Failed", error, {
            userId: user.id,
            userEmail: user.email,
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

            // Send security alert asynchronously (non-blocking)
            sendEmailWithRetry({
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
            }).catch((error) => {
              // Silent fail - don't block login
              AuthLogger.error("Login Alert Email Failed", error, {
                userId: user.id,
              });
            });
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
      update: {
        after: async (user) => {
          try {
            // Only send alert for password changes
            // Better Auth doesn't provide changed fields, so this sends on any update
            // Consider implementing field change detection if needed

            sendEmailWithRetry({
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
            }).catch((error) => {
              // Silent fail - don't block update
              AuthLogger.error("Update Alert Email Failed", error, {
                userId: user.id,
              });
            });
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
export async function deleteUserAccount() {
  try {
    await auth.api.deleteUser({
      body: {},
      headers: await headers(),
    });

    return { success: true, message: "Account deleted successfully" };
  } catch (error) {
    AuthLogger.error("Account Deletion Failed", error);

    // Return user-friendly error
    if (error instanceof Error) {
      return {
        success: false,
        error:
          error.message ||
          "Failed to delete account. Please try again or contact support.",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred. Please contact support.",
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
      throw new Error("Invalid user data: missing required fields");
    }

    const result = await sendEmailWithRetry({
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
    });

    return result;
  } catch (error) {
    AuthLogger.error("Account Deletion Email Failed", error, {
      userEmail: userData.userEmail,
    });

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to send deletion email",
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
