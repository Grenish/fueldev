import * as React from 'react';
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
  Column,
  Row,
  Hr,
} from '@react-email/components';

const WelcomeEmail = (props: { firstName?: string }) => {
  const { firstName = "Creator" } = props;

  // Brand color constant
  const brandColor = '#d9a440';
  const textColor = '#252117';

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Welcome to FuelDev! Your journey as a creator starts now.</Preview>
        <Body style={{ backgroundColor: '#F4F2EA' }} className="font-sans py-6">
          <Container className="mx-auto max-w-[500px]">
            
            {/* Header: Logo Only */}
            <Section className="text-center mb-6">
              <Img
                src="https://di867tnz6fwga.cloudfront.net/brand-kits/386bae33-3d3a-4e0a-a39d-50ee056e80ca/primary/b285f4d1-8b47-4955-af87-6a3b094310e7.png"
                alt="FuelDev"
                className="h-10 object-contain mx-auto"
              />
            </Section>

            {/* Main Content Card */}
            <Section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="w-full h-1.5" style={{ backgroundColor: brandColor }}></div>
              
              <div className="px-8 py-8">
                {/* Heading */}
                <Heading className="text-[24px] font-bold mb-4 text-center leading-tight" style={{ color: textColor }}>
                  Welcome to FuelDev, <span style={{ color: brandColor }}>{firstName}</span>.
                </Heading>

                <Text className="text-[15px] leading-[24px] text-center text-gray-600 mb-6 mt-0">
                  Your account has been verified. The platform for Indian creators, developers, and dreamers is now yours to explore.
                </Text>

                <Hr className="border-gray-100 my-6" />

                {/* Personal Note */}
                <Text className="text-[15px] leading-[24px] mb-4" style={{ color: textColor }}>
                  Hi there,
                </Text>
                <Text className="text-[15px] leading-[24px] mb-6" style={{ color: textColor }}>
                  I'm <strong>Grenish Rai</strong>, creator of FuelDev. I built this platform because I believe every maker deserves a simple way to earn from their passion.
                </Text>

                {/* Compact Action List */}
                <Section className="bg-gray-50 rounded-md p-5 mb-8 border border-gray-100">
                  <Text className="text-[14px] font-bold mb-3 uppercase tracking-wider text-gray-500">
                    Your Next Steps
                  </Text>
                  
                  <Row className="mb-3">
                    <Column className="w-[24px] align-top pt-0.5">
                      <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: brandColor }} />
                    </Column>
                    <Column>
                      <Text className="text-[15px] font-semibold m-0" style={{ color: textColor }}>Set up your profile</Text>
                      <Text className="text-[13px] text-gray-500 m-0">Tell your story and showcase your best work.</Text>
                    </Column>
                  </Row>

                  <Row className="mb-3">
                    <Column className="w-[24px] align-top pt-0.5">
                      <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: brandColor }} />
                    </Column>
                    <Column>
                      <Text className="text-[15px] font-semibold m-0" style={{ color: textColor }}>Share your link</Text>
                      <Text className="text-[13px] text-gray-500 m-0">Start receiving support from your audience.</Text>
                    </Column>
                  </Row>

                  <Row>
                    <Column className="w-[24px] align-top pt-0.5">
                      <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: brandColor }} />
                    </Column>
                    <Column>
                      <Text className="text-[15px] font-semibold m-0" style={{ color: textColor }}>Join the community</Text>
                      <Text className="text-[13px] text-gray-500 m-0">Connect with fellow creators across India.</Text>
                    </Column>
                  </Row>
                </Section>

                {/* CTA Button */}
                <Section className="text-center mb-6">
                  <Button
                    href="https://fueldev.vercel.app"
                    className="px-8 py-3 rounded-md text-[14px] font-bold text-white no-underline text-center inline-block"
                    style={{ backgroundColor: brandColor, color: '#ffffff' }}
                  >
                    Complete Your Profile →
                  </Button>
                </Section>

                {/* Signature */}
                <Text className="text-[14px] leading-relaxed text-gray-500 m-0 text-center">
                  Happy creating,<br />
                  <span className="font-semibold" style={{ color: textColor }}>Grenish Rai</span>
                </Text>
              </div>
            </Section>

            {/* Footer with Icons */}
            <Section className="text-center mt-6">
              <div className="mb-4">
                 {/* GitHub Icon */}
                 <Link href="https://github.com/Grenish/fueldev" className="inline-block mx-2">
                    <Img 
                      src="https://img.icons8.com/ios-glyphs/30/9ca3af/github.png" 
                      alt="GitHub" 
                      width="24" 
                      height="24" 
                      className="opacity-80 hover:opacity-100"
                    />
                 </Link>
                 
                 {/* Website/Globe Icon */}
                 <Link href="https://fueldev.vercel.app" className="inline-block mx-2">
                    <Img 
                      src="https://img.icons8.com/ios-glyphs/30/9ca3af/globe--v1.png" 
                      alt="Website" 
                      width="24" 
                      height="24" 
                      className="opacity-80 hover:opacity-100"
                    />
                 </Link>
              </div>
              <Text className="text-[11px] text-gray-400 leading-tight mb-2">
                © 2025 FuelDev. All rights reserved.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

WelcomeEmail.PreviewProps = {
  firstName: "Rahul",
};

export default WelcomeEmail;