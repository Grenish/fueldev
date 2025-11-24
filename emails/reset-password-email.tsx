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

interface PasswordResetEmailProps {
  resetUrl: string;
}

const PasswordResetEmail = ({ resetUrl }: PasswordResetEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>
          Reset your FuelDev password - secure your creator account
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
            <Section className="bg-white rounded-[8px] p-[32px] mb-[24px] border border-solid border-gray-200">
              <Heading className="text-[#252117] text-[24px] font-bold mb-[16px] text-center">
                Reset Your Password
              </Heading>

              <Text className="text-[#252117] text-[16px] leading-[24px] mb-[24px]">
                Hello,
              </Text>

              <Text className="text-[#252117] text-[16px] leading-[24px] mb-[24px]">
                We received a request to reset the password for your FuelDev
                account.
              </Text>

              <Text className="text-[#252117] text-[16px] leading-[24px] mb-[32px]">
                Click the button below to create a new password. This link will
                expire in 24 hours for your security.
              </Text>

              {/* Reset Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={resetUrl}
                  className="bg-[#d9a440] text-white text-[16px] font-semibold py-[12px] px-[32px] rounded-[6px] no-underline box-border inline-block"
                >
                  Reset My Password
                </Button>
              </Section>

              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[16px]">
                If the button doesn&apos;t work, copy and paste this link into
                your browser:
              </Text>

              <Text className="text-[#d9a440] text-[14px] leading-[20px] mb-[24px] break-all">
                <Link href={resetUrl} className="text-[#d9a440] no-underline">
                  {resetUrl}
                </Link>
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[16px]">
                <strong>Didn&apos;t request this?</strong> If you didn&apos;t
                ask to reset your password, you can safely ignore this email.
                Your password will remain unchanged.
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px]">
                For your security, never share your password or account details
                with anyone. FuelDev will never ask for your password via email.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[16px] font-medium">
                Empowering creators, developers, and dreamers.
              </Text>

              <Text className="text-[#252117] text-[12px] leading-[16px] mb-[8px]">
                Need help? Visit{" "}
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

PasswordResetEmail.PreviewProps = {
  resetUrl: "https://fueldev.vercel.app/reset-password?token=abc123xyz",
} as PasswordResetEmailProps;

export default PasswordResetEmail;
