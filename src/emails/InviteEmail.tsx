import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Mail, Users, Wallet } from "lucide-react";

interface InviteEmailProps {
  recipientName?: string;
  senderName?: string;
  familyName?: string;
  inviteCode?: string;
  inviteUrl?: string;
  expiryDays?: number;
}

export const InviteEmail = ({
  recipientName = "Jane Smith",
  senderName = "John Smith",
  familyName = "The Smith Family",
  inviteCode = "SMITH-123456",
  inviteUrl = "https://familytracker.com/invite/accept?code=SMITH-123456",
  expiryDays = 7,
}: InviteEmailProps) => {
  const previewText = `${senderName} invited you to join ${familyName} on FamilyTracker`;

  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-black font-sans">
          <Container className="mx-auto max-w-2xl bg-black">
            {/* Light Header Section - App Branding Only */}
            <Section className="bg-gray-50 px-8 py-8 rounded-t-2xl w-full">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                  <Text className="text-2xl m-0">
                    <Wallet className="h-8 w-8 text-white" />
                  </Text>
                </div>
                <Heading className="text-2xl font-bold text-black m-0 mb-2">
                  FamilyTracker
                </Heading>
                <Text className="text-gray-600 m-0">
                  Track expenses together, plan better
                </Text>
              </div>
            </Section>

            {/* Dark Section with Personal Greeting and Invitation Card */}
            <Section className="bg-black px-8 py-8">
              {/* Personal Greeting */}
              <div className="text-left mb-8">
                <Text className="text-lg font-medium text-white m-0 mb-4">
                  Hi {recipientName},
                </Text>
                <Text className="text-gray-300 m-0 leading-relaxed">
                  <strong className="text-white">{senderName}</strong> has
                  invited you to join{" "}
                  <strong className="text-white">{familyName}</strong> on
                  FamilyTracker, a shared expense tracking app for families.
                </Text>
              </div>

              {/* Dark Invitation Card */}
              <div className="bg-gray-800 rounded-2xl p-8 text-center mb-8">
                {/* Users Icon */}
                <div className="mx-auto w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-6">
                  <Text className="text-xl m-0">
                    <Users className="h-8 w-8" />
                  </Text>
                </div>

                <Text className="text-gray-300 text-base m-0 mb-2">
                  You've been invited to join
                </Text>
                <Heading className="text-white text-2xl font-bold m-0 mb-4">
                  {familyName}
                </Heading>
                <Text className="text-gray-400 text-sm m-0 leading-relaxed">
                  Track and manage expenses together with your family members in
                  one place.
                </Text>
              </div>

              {/* Features List */}
              <div className="mb-8">
                <Text className="text-white text-lg font-medium m-0 mb-6">
                  With FamilyTracker, you can:
                </Text>
                <div className="space-y-3">
                  <Text className="text-gray-300 m-0 flex items-start">
                    <span className="text-white mr-3">•</span>
                    Log and track all family expenses in one place
                  </Text>
                  <Text className="text-gray-300 m-0 flex items-start">
                    <span className="text-white mr-3">•</span>
                    See who spent what and when
                  </Text>
                  <Text className="text-gray-300 m-0 flex items-start">
                    <span className="text-white mr-3">•</span>
                    Categorize expenses for better budget management
                  </Text>
                  <Text className="text-gray-300 m-0 flex items-start">
                    <span className="text-white mr-3">•</span>
                    Generate reports and export data to Excel
                  </Text>
                  <Text className="text-gray-300 m-0 flex items-start">
                    <span className="text-white mr-3">•</span>
                    Plan your family budget together
                  </Text>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <Button
                  href={inviteUrl}
                  className="bg-white text-black px-8 py-4 rounded-full font-medium text-base inline-block no-underline hover:bg-gray-100"
                >
                  Accept Invitation →
                </Button>
                <Text className="text-gray-400 text-sm m-0 mt-4">
                  Or use this invite code:{" "}
                  <span className="text-white font-mono font-bold">
                    {inviteCode}
                  </span>
                </Text>
                <Text className="text-gray-500 text-xs m-0 mt-2">
                  This invitation expires in {expiryDays} days.
                </Text>
              </div>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-800 px-8 py-6 rounded-b-2xl text-center">
              <Text className="text-gray-400 text-sm m-0 mb-4">
                If you have any questions, please contact{" "}
                <Link
                  href="mailto:support@familytracker.com"
                  className="text-white underline"
                >
                  support@familytracker.com
                </Link>
              </Text>
              <Text className="text-gray-500 text-sm m-0 mb-4">
                <Mail className="h-3 w-3" /> FamilyTracker, Inc. • 17 Shefa
                Chaim Ave • Lakewood, NJ 08701
              </Text>
              <Text className="text-gray-500 text-xs m-0">
                <Link
                  href="#"
                  className="text-gray-400 underline hover:text-white"
                >
                  Unsubscribe
                </Link>{" "}
                •{" "}
                <Link
                  href="#"
                  className="text-gray-400 underline hover:text-white"
                >
                  Privacy Policy
                </Link>{" "}
                •{" "}
                <Link
                  href="#"
                  className="text-gray-400 underline hover:text-white"
                >
                  Terms of Service
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default InviteEmail;
