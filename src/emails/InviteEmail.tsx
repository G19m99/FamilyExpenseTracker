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
  Row,
  Column,
} from "@react-email/components";

interface InviteEmailProps {
  recipientName?: string;
  senderName?: string;
  familyName?: string;
  inviteCode?: string;
  inviteUrl?: string;
  expiryDays?: number;
}

export const InviteEmail = ({
  recipientName,
  senderName,
  familyName,
  inviteCode,
  inviteUrl,
  expiryDays = 7,
}: InviteEmailProps) => {
  const previewText = `${senderName} invited you to join ${familyName} on FamilyTracker`;

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://family-expense-tracker.netlify.app"
      : "/static";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body
        style={{
          backgroundColor: "#000000",
          fontFamily: "sans-serif",
          margin: "0",
          padding: "0",
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            maxWidth: "672px",
            backgroundColor: "#000000",
          }}
        >
          {/* Light Header Section - App Branding Only */}
          <Section
            style={{
              backgroundColor: "#f9fafb",
              padding: "32px",
              width: "100%",
            }}
          >
            <Row>
              <Column align="center">
                <table
                  align="center"
                  style={{
                    margin: "0 auto 16px auto",
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#000000",
                    borderRadius: "50%",
                  }}
                >
                  <tr>
                    <td
                      align="center"
                      valign="middle"
                      style={{ height: "64px" }}
                    >
                      <Img
                        src={`${baseUrl}/wallet.png`}
                        alt="FamilyTracker"
                        width="32"
                        height="32"
                      />
                    </td>
                  </tr>
                </table>
                <Heading
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#000000",
                    margin: "0 0 8px 0",
                    textAlign: "center",
                  }}
                >
                  FamilyTracker
                </Heading>
                <Text
                  style={{ color: "#4b5563", margin: "0", textAlign: "center" }}
                >
                  Track expenses together, plan better
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Dark Section with Personal Greeting and Invitation Card */}
          <Section style={{ backgroundColor: "#000000", padding: "32px" }}>
            {/* Personal Greeting */}
            <Row style={{ marginBottom: "32px" }}>
              <Column>
                <Text
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#ffffff",
                    margin: "0 0 16px 0",
                  }}
                >
                  Hi {recipientName},
                </Text>
                <Text
                  style={{ color: "#d1d5db", margin: "0", lineHeight: "1.6" }}
                >
                  <strong style={{ color: "#ffffff" }}>{senderName}</strong> has
                  invited you to join{" "}
                  <strong style={{ color: "#ffffff" }}>{familyName}</strong> on
                  FamilyTracker, a shared expense tracking app for families.
                </Text>
              </Column>
            </Row>

            {/* Dark Invitation Card */}
            <Section
              style={{
                backgroundColor: "#374151",
                borderRadius: "16px",
                padding: "32px",
                marginBottom: "32px",
              }}
            >
              {/* Users Icon */}
              <Row>
                <Column align="center">
                  <table
                    align="center"
                    style={{
                      margin: "0 auto 24px auto",
                      width: "48px",
                      height: "48px",
                      backgroundColor: "#4b5563",
                      borderRadius: "50%",
                    }}
                  >
                    <tr>
                      <td
                        align="center"
                        valign="middle"
                        style={{ height: "48px" }}
                      >
                        <Img
                          src={`${baseUrl}/persons.png`}
                          alt="FamilyTracker"
                          width="32"
                          height="32"
                        />
                      </td>
                    </tr>
                  </table>
                  <Text
                    style={{
                      color: "#d1d5db",
                      fontSize: "16px",
                      margin: "0 0 8px 0",
                      textAlign: "center",
                    }}
                  >
                    You've been invited to join
                  </Text>
                  <Heading
                    style={{
                      color: "#ffffff",
                      fontSize: "24px",
                      fontWeight: "bold",
                      margin: "0 0 16px 0",
                      textAlign: "center",
                    }}
                  >
                    {familyName}
                  </Heading>
                  <Text
                    style={{
                      color: "#9ca3af",
                      fontSize: "14px",
                      margin: "0",
                      lineHeight: "1.6",
                      textAlign: "center",
                    }}
                  >
                    Track and manage expenses together with your family members
                    in one place.
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Features List */}
            <Row style={{ marginBottom: "32px" }}>
              <Column>
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: "18px",
                    fontWeight: "500",
                    margin: "0 0 24px 0",
                  }}
                >
                  With FamilyTracker, you can:
                </Text>
                <table width="100%" style={{ marginBottom: "12px" }}>
                  <tr>
                    <td
                      width="20"
                      style={{ verticalAlign: "top", paddingTop: "2px" }}
                    >
                      <Text
                        style={{
                          color: "#ffffff",
                          margin: "0",
                          fontSize: "16px",
                        }}
                      >
                        •
                      </Text>
                    </td>
                    <td>
                      <Text
                        style={{
                          color: "#d1d5db",
                          margin: "0",
                          lineHeight: "1.5",
                        }}
                      >
                        Log and track all family expenses in one place
                      </Text>
                    </td>
                  </tr>
                </table>
                <table width="100%" style={{ marginBottom: "12px" }}>
                  <tr>
                    <td
                      width="20"
                      style={{ verticalAlign: "top", paddingTop: "2px" }}
                    >
                      <Text
                        style={{
                          color: "#ffffff",
                          margin: "0",
                          fontSize: "16px",
                        }}
                      >
                        •
                      </Text>
                    </td>
                    <td>
                      <Text
                        style={{
                          color: "#d1d5db",
                          margin: "0",
                          lineHeight: "1.5",
                        }}
                      >
                        See who spent what and when
                      </Text>
                    </td>
                  </tr>
                </table>
                <table width="100%" style={{ marginBottom: "12px" }}>
                  <tr>
                    <td
                      width="20"
                      style={{ verticalAlign: "top", paddingTop: "2px" }}
                    >
                      <Text
                        style={{
                          color: "#ffffff",
                          margin: "0",
                          fontSize: "16px",
                        }}
                      >
                        •
                      </Text>
                    </td>
                    <td>
                      <Text
                        style={{
                          color: "#d1d5db",
                          margin: "0",
                          lineHeight: "1.5",
                        }}
                      >
                        Categorize expenses for better budget management
                      </Text>
                    </td>
                  </tr>
                </table>
                <table width="100%" style={{ marginBottom: "12px" }}>
                  <tr>
                    <td
                      width="20"
                      style={{ verticalAlign: "top", paddingTop: "2px" }}
                    >
                      <Text
                        style={{
                          color: "#ffffff",
                          margin: "0",
                          fontSize: "16px",
                        }}
                      >
                        •
                      </Text>
                    </td>
                    <td>
                      <Text
                        style={{
                          color: "#d1d5db",
                          margin: "0",
                          lineHeight: "1.5",
                        }}
                      >
                        Generate reports and export data to Excel
                      </Text>
                    </td>
                  </tr>
                </table>
                <table width="100%">
                  <tr>
                    <td
                      width="20"
                      style={{ verticalAlign: "top", paddingTop: "2px" }}
                    >
                      <Text
                        style={{
                          color: "#ffffff",
                          margin: "0",
                          fontSize: "16px",
                        }}
                      >
                        •
                      </Text>
                    </td>
                    <td>
                      <Text
                        style={{
                          color: "#d1d5db",
                          margin: "0",
                          lineHeight: "1.5",
                        }}
                      >
                        Plan your family budget together
                      </Text>
                    </td>
                  </tr>
                </table>
              </Column>
            </Row>

            {/* Call to Action */}
            <Row>
              <Column align="center">
                <Button
                  href={inviteUrl}
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    padding: "16px 32px",
                    borderRadius: "9999px",
                    fontWeight: "500",
                    fontSize: "16px",
                    display: "inline-block",
                    textDecoration: "none",
                    border: "none",
                  }}
                >
                  Accept Invitation →
                </Button>
                <Text
                  style={{
                    color: "#9ca3af",
                    fontSize: "14px",
                    margin: "16px 0 0 0",
                    textAlign: "center",
                  }}
                >
                  Or use this invite code:{" "}
                  <span
                    style={{
                      color: "#ffffff",
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                  >
                    {inviteCode}
                  </span>
                </Text>
                <Text
                  style={{
                    color: "#6b7280",
                    fontSize: "12px",
                    margin: "8px 0 0 0",
                    textAlign: "center",
                  }}
                >
                  This invitation expires in {expiryDays} days.
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: "#374151",
              padding: "24px 32px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                color: "#9ca3af",
                fontSize: "14px",
                margin: "0 0 16px 0",
              }}
            >
              If you have any questions, please contact{" "}
              <Link
                href="mailto:gershymenzer@gmail.com"
                style={{ color: "#ffffff", textDecoration: "underline" }}
              >
                gershymenzer@gmail.com
              </Link>
            </Text>
            <Row style={{ marginBottom: "16px" }}>
              <Column align="center">
                <table align="center">
                  <tr>
                    <td
                      style={{ verticalAlign: "middle", paddingRight: "4px" }}
                    >
                      <Img
                        src={`${baseUrl}/mail.png`}
                        alt="FamilyTracker"
                        width="12"
                        height="12"
                      />
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      <Text
                        style={{
                          color: "#6b7280",
                          fontSize: "14px",
                          margin: "0",
                        }}
                      >
                        FamilyTracker, Inc. • 17 Shefa Chaim Ave • Lakewood, NJ
                        08701
                      </Text>
                    </td>
                  </tr>
                </table>
              </Column>
            </Row>
            <Text style={{ color: "#6b7280", fontSize: "12px", margin: "0" }}>
              <Link
                href="#"
                style={{ color: "#9ca3af", textDecoration: "underline" }}
              >
                Unsubscribe
              </Link>{" "}
              •{" "}
              <Link
                href="#"
                style={{ color: "#9ca3af", textDecoration: "underline" }}
              >
                Privacy Policy
              </Link>{" "}
              •{" "}
              <Link
                href="#"
                style={{ color: "#9ca3af", textDecoration: "underline" }}
              >
                Terms of Service
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default InviteEmail;
