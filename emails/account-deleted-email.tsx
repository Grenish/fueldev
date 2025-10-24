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

interface AccountDeletedEmailProps {
  userName: string;
  userEmail: string;
  accountCreatedDate: string;
  totalSupport: string;
  projectsCreated: string;
}

const AccountDeletedEmail = ({
  userName,
  userEmail,
  accountCreatedDate,
  totalSupport,
  projectsCreated,
}: AccountDeletedEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>
          Your FuelDev journey ends here - Thank you for being part of our
          creator community
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
                Goodbye, {userName}
              </Heading>

              <Text className="text-gray-600 text-[14px] mb-[24px] text-center">
                Your FuelDev account has been successfully deleted
              </Text>

              <Text className="text-[#252117] text-[16px] leading-[24px] mb-[24px]">
                We're sad to see you go, but we respect your decision to delete
                your FuelDev account. Your journey with us has come to an end,
                and we want to take a moment to thank you for being part of our
                creator community.
              </Text>

              <Text className="text-[#252117] text-[16px] leading-[24px] mb-[32px]">
                Every creator who joins FuelDev contributes to building a
                stronger, more supportive ecosystem for Indian developers and
                artists. Your presence made a difference, and we're grateful for
                the time you spent with us.
              </Text>

              {/* Account Summary */}
              <Section className="bg-[#F4F2EA] rounded-[8px] p-[24px] mb-[32px]">
                <Text className="text-[#252117] text-[16px] font-bold mb-[20px] m-0">
                  Your FuelDev Journey
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[18px] mb-[10px] m-0">
                  <strong>Member since:</strong> {accountCreatedDate}
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[18px] mb-[10px] m-0">
                  <strong>Total support received:</strong> ₹{totalSupport}
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[18px] m-0">
                  <strong>Projects shared:</strong> {projectsCreated}
                </Text>
              </Section>

              {/* What Happens Next */}
              <Section className="mb-[32px]">
                <Text className="text-[#252117] text-[18px] leading-[24px] mb-[16px] font-bold">
                  What happens now?
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[20px] mb-[12px]">
                  • Your profile and all associated data have been permanently
                  removed
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[20px] mb-[12px]">
                  • Your supporters will no longer be able to contribute to your
                  projects
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[20px] mb-[12px]">
                  • All payment methods and financial information have been
                  securely deleted
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[20px] mb-[20px]">
                  • This action is irreversible and cannot be undone
                </Text>
              </Section>

              {/* Future Possibilities */}
              <Section>
                <Text className="text-[#252117] text-[18px] leading-[24px] mb-[16px] font-bold">
                  The door is always open
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[20px] mb-[20px]">
                  While your current account is gone, you're always welcome back
                  to the FuelDev community. If you ever decide to return, you
                  can create a new account and start fresh with all the tools
                  and support we offer to creators.
                </Text>

                <Text className="text-[#252117] text-[14px] leading-[20px] mb-[24px]">
                  The Indian creator ecosystem continues to grow, and there's
                  always room for passionate developers, artists, and dreamers
                  like you.
                </Text>

                <Section className="text-center">
                  <Button
                    href="https://fueldev.vercel.app"
                    className="bg-[#d9a440] text-white text-[16px] font-semibold py-[12px] px-[32px] rounded-[6px] no-underline box-border inline-block"
                  >
                    Visit FuelDev
                  </Button>
                </Section>
              </Section>
            </Section>

            {/* Final Message */}
            <Section className="bg-white rounded-[8px] p-[24px] mb-[24px]">
              <Text className="text-[#252117] text-[16px] leading-[24px] mb-[16px] text-center font-medium">
                Thank you for being part of our journey. We wish you all the
                best in your creative endeavors, wherever they may take you.
              </Text>

              <Text className="text-[#252117] text-[14px] leading-[20px] text-center">
                Keep creating, keep dreaming, and remember - the best is yet to
                come.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-[#252117] text-[14px] leading-[20px] mb-[16px] font-medium">
                Empowering creators, developers, and dreamers.
              </Text>

              <Text className="text-[#252117] text-[12px] leading-[16px] mb-[8px]">
                Questions or feedback? Visit{" "}
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

AccountDeletedEmail.PreviewProps = {
  userName: "Arjun",
  userEmail: "arjun@example.com",
  accountCreatedDate: "March 15, 2024",
  totalSupport: "2,450",
  projectsCreated: "3",
} as AccountDeletedEmailProps;

export default AccountDeletedEmail;
