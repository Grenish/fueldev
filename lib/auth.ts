import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Resend } from "resend";
import ResetPasswordEmail from "@/emails/reset-password-email";
import VerificationEmail from "@/emails/verification-email";
import SecurityAlertEmail from "@/emails/security-alert-email";
import AccountDeletedEmail from "@/emails/account-deleted-email";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.EMAIL_FROM || "fueldev@resend.dev";
const resend = new Resend(RESEND_API_KEY);

// Helper function to get device info from user agent
function getDeviceInfo(userAgent?: string): string {
  if (!userAgent) return "Unknown device";

  // Simple device detection
  if (userAgent.includes("Mobile")) return "Mobile device";
  if (userAgent.includes("Tablet")) return "Tablet";
  return "Desktop";
}

// Helper function to format timestamp
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
      await resend.emails.send({
        from: RESEND_FROM,
        to: user.email,
        subject: "Reset your password",
        react: ResetPasswordEmail({ resetUrl: url }),
      });
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  socialProviders: {
    // Add social providers here if needed
  },
  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      await resend.emails.send({
        from: RESEND_FROM,
        to: user.email,
        subject: "Verify your email",
        react: VerificationEmail({ verifyUrl: url }),
      });
    },
  },
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        // Perform cascading deletion of all user-related data
        try {
          // Delete all sessions first
          await prisma.session.deleteMany({
            where: { userId: user.id },
          });

          // Delete all accounts
          await prisma.account.deleteMany({
            where: { userId: user.id },
          });

          // Delete all verification records for this user
          await prisma.verification.deleteMany({
            where: {
              identifier: user.email,
            },
          });

          console.log(`Cleaned up data for user ${user.id} before deletion`);
        } catch (error) {
          console.error("Error during user data cleanup:", error);
          throw error;
        }
      },
      afterDelete: async (user) => {
        // Send account deletion confirmation email
        try {
          await sendAccountDeletionEmail({
            userName: user.name,
            userEmail: user.email,
            accountCreatedDate: new Date(user.createdAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            ),
            totalSupport: "0",
            projectsCreated: "0",
          });
          console.log(`Sent deletion confirmation email to ${user.email}`);
        } catch (error) {
          console.error("Error sending deletion email:", error);
          // Don't throw - email failure shouldn't stop deletion
        }
      },
    },
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          // Send security alert for new login
          try {
            const user = await prisma.user.findUnique({
              where: { id: session.userId },
            });

            if (user) {
              await resend.emails.send({
                from: RESEND_FROM,
                to: user.email,
                subject: "New login detected",
                react: SecurityAlertEmail({
                  userEmail: user.email,
                  alertType: "login",
                  deviceInfo: getDeviceInfo(session.userAgent || undefined),
                  location: "Unknown location",
                  timestamp: formatTimestamp(new Date(session.createdAt)),
                  ipAddress: session.ipAddress || "Unknown",
                }),
              });
            }
          } catch (error) {
            console.error("Failed to send security alert email:", error);
          }
        },
      },
    },
    user: {
      update: {
        after: async (user) => {
          // Send security alert for password change
          // Note: This is a simplified check - you may want to add a flag to track password changes
          try {
            await resend.emails.send({
              from: RESEND_FROM,
              to: user.email,
              subject: "Password changed",
              react: SecurityAlertEmail({
                userEmail: user.email,
                alertType: "password_change",
                deviceInfo: "Unknown device",
                location: "Unknown location",
                timestamp: formatTimestamp(new Date()),
                ipAddress: "Unknown",
              }),
            });
          } catch (error) {
            console.error("Failed to send password change alert:", error);
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

// Helper function to delete user account with all related data
export async function deleteUserAccount(userId: string) {
  try {
    // Get user data before deletion for email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete all related data in proper order (respecting foreign key constraints)
    await prisma.$transaction(async (tx) => {
      // 1. Delete all sessions
      await tx.session.deleteMany({
        where: { userId: user.id },
      });

      // 2. Delete all accounts
      await tx.account.deleteMany({
        where: { userId: user.id },
      });

      // 3. Delete verification records
      await tx.verification.deleteMany({
        where: {
          identifier: user.email,
        },
      });

      // 4. Finally, delete the user
      await tx.user.delete({
        where: { id: user.id },
      });
    });

    // Send deletion confirmation email
    await sendAccountDeletionEmail({
      userName: user.name,
      userEmail: user.email,
      accountCreatedDate: new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      totalSupport: "0",
      projectsCreated: "0",
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete user account:", error);
    throw error;
  }
}

// Helper function to send account deletion email (call this from your delete account API)
export async function sendAccountDeletionEmail(userData: {
  userName: string;
  userEmail: string;
  accountCreatedDate: string;
  totalSupport?: string;
  projectsCreated?: string;
}) {
  try {
    await resend.emails.send({
      from: RESEND_FROM,
      to: userData.userEmail,
      subject: "Your account has been deleted",
      react: AccountDeletedEmail({
        userName: userData.userName,
        userEmail: userData.userEmail,
        accountCreatedDate: userData.accountCreatedDate,
        totalSupport: userData.totalSupport || "0",
        projectsCreated: userData.projectsCreated || "0",
      }),
    });
  } catch (error) {
    console.error("Failed to send account deletion email:", error);
  }
}
