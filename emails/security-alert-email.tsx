import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface SecurityAlertEmailProps {
  userEmail: string;
  alertType:
    | "login"
    | "password_change"
    | "email_change"
    | "suspicious_activity";
  deviceInfo: string;
  location: string;
  timestamp: string;
  ipAddress: string;
}

const SecurityAlertEmail = ({
  userEmail,
  alertType,
  deviceInfo,
  location,
  timestamp,
  ipAddress,
}: SecurityAlertEmailProps) => {
  const getAlertTitle = () => {
    switch (alertType) {
      case "login":
        return "New Login Detected";
      case "password_change":
        return "Password Changed Successfully";
      case "email_change":
        return "Email Address Changed";
      case "suspicious_activity":
        return "Suspicious Activity Detected";
      default:
        return "Security Alert";
    }
  };

  const getAlertMessage = () => {
    switch (alertType) {
      case "login":
        return `We detected a new login to your FuelDev account from a device or location we haven't seen before.`;
      case "password_change":
        return `Your FuelDev account password was successfully changed.`;
      case "email_change":
        return `Your FuelDev account email address was changed from your previous email to ${userEmail}.`;
      case "suspicious_activity":
        return `We detected unusual activity on your FuelDev account that may indicate unauthorized access attempts.`;
      default:
        return `We're alerting you about recent activity on your FuelDev account.`;
    }
  };

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>
          FuelDev Security Alert: {getAlertTitle()} - Protect your creator
          account
        </Preview>
        <Body className="bg-[#F4F2EA] font-sans py-[40px]">
          <Container className="bg-[#F4F2EA] max-w-[600px] mx-auto px-[20px]">
            {/* Logo Section */}
            <Section className="text-center mb-[32px]">
              <Img
                src="https://di867tnz6fwga.cloudfront.net/brand-kits/386bae33-3d3a-4e0a-a39d-50ee056e80ca/primary/b285f4d1-8b47-4955-af87-6a3b094310e7.png"
                alt="FuelDev"
                className="w-full h-auto max-w-[200px] mx-auto"
              />
            </Section>

            {/* Main Content */}
            <Section className="bg-white rounded-[8px] p-[32px] mb-[24px]">
              <Heading className="text-[#252117] text-[28px] font-bold mb-[8px] text-center">
                {getAlertTitle()}
              </Heading>

              <Text className="text-gray-600 text-[14px] mb-[24px] text-center">
                Account: {userEmail}
              </Text>

              <Text className="text-[#252117] text-[16px] leading-[24px] mb-[32px]">
                {getAlertMessage()}
              </Text>

              {/* Activity Details - Fixed spacing */}
              <Section className="bg-[#F4F2EA] rounded-[8px] p-[24px] mb-[32px]">
                <Text className="text-[#252117] text-[16px] font-bold mb-[20px] m-0">
                  Activity Details
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[18px] mb-[10px] m-0">
                  <strong>Time:</strong> {timestamp}
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[18px] mb-[10px] m-0">
                  <strong>Device:</strong> {deviceInfo}
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[18px] mb-[10px] m-0">
                  <strong>Location:</strong> {location}
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[18px] m-0">
                  <strong>IP Address:</strong> {ipAddress}
                </Text>
              </Section>

              {/* Action Required */}
              {alertType === "suspicious_activity" && (
                <Section className="mb-[32px]">
                  <Text className="text-[#252117] text-[18px] leading-[24px] mb-[16px] font-bold">
                    Immediate Action Required
                  </Text>

                  <Text className="text-[#252117] text-[14px] leading-[20px] mb-[20px]">
                    We recommend securing your account immediately to prevent
                    unauthorized access.
                  </Text>

                  <Section className="text-center mb-[20px]">
                    <Button
                      href="https://fueldev.vercel.app/security"
                      className="bg-[#d9a440] text-white text-[16px] font-semibold py-[12px] px-[32px] rounded-[6px] no-underline box-border inline-block"
                    >
                      Secure My Account
                    </Button>
                  </Section>
                </Section>
              )}

              {/* Was This You? */}
              <Section>
                <Text className="text-[#252117] text-[18px] leading-[24px] mb-[16px] font-bold">
                  Was this you?
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[20px] mb-[16px]">
                  <strong>If this was you:</strong> No further action is needed.
                  Your account remains secure and you can continue using FuelDev
                  normally.
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[20px] mb-[24px]">
                  <strong>If this wasn't you:</strong> Your account may be
                  compromised. Please take immediate action to secure your
                  creator account and protect your supporters.
                </Text>

                <Section className="text-center">
                  <Button
                    href="https://fueldev.vercel.app/reset-password"
                    className="bg-red-600 text-white text-[14px] font-semibold py-[12px] px-[24px] rounded-[6px] no-underline box-border inline-block mr-[12px] mb-[12px]"
                  >
                    Change Password
                  </Button>

                  <Button
                    href="https://fueldev.vercel.app/security"
                    className="bg-gray-600 text-white text-[14px] font-semibold py-[12px] px-[24px] rounded-[6px] no-underline box-border inline-block mb-[12px]"
                  >
                    Review Security Settings
                  </Button>
                </Section>
              </Section>
            </Section>

            {/* Security Best Practices */}
            <Section className="bg-white rounded-[8px] p-[24px] mb-[24px]">
              <Text className="text-[#252117] text-[18px] leading-[24px] mb-[16px] font-bold">
                Protect Your Creator Account
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[8px]">
                • Use a strong, unique password for your FuelDev account
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[8px]">
                • Enable two-factor authentication for enhanced security
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[8px]">
                • Always log out from shared or public devices
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[8px]">
                • Never share your login credentials with anyone
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px]">
                • Regularly monitor your account activity and supporter
                interactions
              </Text>
            </Section>

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[16px] font-medium">
                Empowering creators, developers, and dreamers.
              </Text>

              <Text className="text-[#252117] text-[12px] leading-[16px] mb-[8px]">
                Questions about this security alert? Visit{" "}
                <Link
                  href="https://fueldev.vercel.app"
                  className="text-[#d9a440] no-underline"
                >
                  fueldev.vercel.app
                </Link>{" "}
                or follow us on{" "}
                <Link
                  href="https://github.com/Grenish/fueldev"
                  className="text-[#d9a440] no-underline"
                >
                  GitHub
                </Link>
              </Text>

              <Text className="text-[#252117] text-[12px] leading-[16px] mb-[8px] m-0">
                © 2025 FuelDev. All rights reserved.
              </Text>

              <Text className="text-gray-600 text-[11px] leading-[14px] m-0">
                FuelDev helps creators receive support from their audience. We
                do not guarantee earnings or provide financial advice. Users are
                responsible for their own transactions and legal obligations.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

SecurityAlertEmail.PreviewProps = {
  userEmail: "creator@example.com",
  alertType: "login",
  deviceInfo: "Chrome on Windows 10",
  location: "Mumbai, Maharashtra, India",
  timestamp: "January 24, 2025 at 3:05 PM IST",
  ipAddress: "203.192.xxx.xxx",
} as SecurityAlertEmailProps;

export default SecurityAlertEmail;
