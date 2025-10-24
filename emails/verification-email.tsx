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

interface EmailVerificationProps {
  verifyUrl: string;
}

const EmailVerificationOTP = ({ verifyUrl }: EmailVerificationProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>
          Verify your FuelDev email - Complete your account setup
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
                Verify Your Email Address
              </Heading>

              <Text className="text-[#252117] text-[16px] leading-[24px] mb-[24px]">
                Welcome to FuelDev!
              </Text>

              <Text className="text-[#252117] text-[16px] leading-[24px] mb-[24px]">
                Thank you for joining our creator support platform. To complete
                your account setup and start empowering your creative journey,
                please verify your email address.
              </Text>

              <Text className="text-[#252117] text-[16px] leading-[24px] mb-[32px]">
                Click the button below to verify your account:
              </Text>

              {/* Verify Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={verifyUrl}
                  className="bg-[#d9a440] text-white text-[16px] font-semibold py-[12px] px-[32px] rounded-[6px] no-underline box-border inline-block"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[16px]">
                If the button doesn't work, copy and paste this link into your
                browser:
              </Text>

              <Text className="text-[#d9a440] text-[14px] leading-[20px] mb-[24px] break-all">
                <Link href={verifyUrl} className="text-[#d9a440] no-underline">
                  {verifyUrl}
                </Link>
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[24px]">
                <strong>Security reminder:</strong> Never share this
                verification code with anyone. FuelDev will never ask for your
                verification code via phone or email.
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[16px]">
                <strong>Didn't sign up for FuelDev?</strong> If you didn't
                create an account with us, you can safely ignore this email. No
                account will be created without completing the verification
                process.
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px]">
                Once verified, you'll be able to start receiving support from
                your audience and connect with the vibrant Indian creator
                community on FuelDev.
              </Text>
            </Section>

            {/* Help Section */}
            <Section className="bg-white rounded-[8px] p-[24px] mb-[24px] border border-solid border-gray-200">
              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[12px] font-semibold">
                Need help with verification?
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[8px]">
                • Make sure you click the verification link
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[8px]">
                • Check that the link hasn't expired
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px]">
                • If you're still having trouble, visit{" "}
                <Link
                  href="https://fueldev.vercel.app"
                  className="text-[#d9a440] no-underline"
                >
                  fueldev.vercel.app
                </Link>{" "}
                for support
              </Text>
            </Section>

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[16px] font-medium">
                Empowering creators, developers, and dreamers.
              </Text>

              <Text className="text-[#252117] text-[12px] leading-[16px] mb-[8px]">
                Visit{" "}
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

EmailVerificationOTP.PreviewProps = {
  verifyUrl: "https://fueldev.vercel.app/verify?token=abc123xyz",
} as EmailVerificationProps;

export default EmailVerificationOTP;
