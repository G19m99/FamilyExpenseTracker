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

interface Expense {
  _id: string;
  description: string;
  amount: number; // in cents
  date: string;
  category?: string;
  createdBy: string;
  notes?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface ContributorBreakdown {
  userId: string;
  userName: string;
  totalSpent: number;
  percentage: number;
}

interface MonthlyDigestProps {
  familyName: string;
  month: string; // e.g., "July 2025"
  year: number;
  totalSpent: number; // in cents
  previousMonthTotal?: number; // in cents
  expenses: Expense[];
  users: User[];
  categories: CategoryBreakdown[];
  contributors: ContributorBreakdown[];
  notableExpenses: Expense[];
  appUrl?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
};

const formatPercentage = (current: number, previous?: number): string => {
  if (!previous || previous === 0) return "0%";
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(0)}%`;
};

const getCategoryColor = (index: number): string => {
  const colors = [
    "#3b82f6", // blue-500
    "#10b981", // green-500
    "#eab308", // yellow-500
    "#ef4444", // red-500
    "#8b5cf6", // purple-500
    "#ec4899", // pink-500
    "#6366f1", // indigo-500
    "#f97316", // orange-500
  ];
  return colors[index % colors.length];
};

const MonthlyDigest = ({
  familyName,
  month,
  year,
  totalSpent,
  previousMonthTotal,
  expenses,
  users,
  categories,
  contributors,
  notableExpenses,
  appUrl = "https://your-app-url.com",
}: MonthlyDigestProps) => {
  const previewText = `Your ${month} ${year} family expense summary - ${formatCurrency(totalSpent)} total spent`;

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

          {/* Dark Section with Monthly Summary */}
          <Section style={{ backgroundColor: "#000000", padding: "32px" }}>
            {/* Monthly Summary Header */}
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
                  Your {month} {year} Family Expense Summary
                </Text>
                <Text
                  style={{ color: "#d1d5db", margin: "0", lineHeight: "1.6" }}
                >
                  Here's a comprehensive overview of your family's spending
                  patterns for {month} {year}.
                </Text>
              </Column>
            </Row>

            {/* Total Spending Overview Card */}
            <Section
              style={{
                backgroundColor: "#374151",
                borderRadius: "16px",
                padding: "32px",
                marginBottom: "32px",
              }}
            >
              <Row>
                <Column align="center">
                  <Text
                    style={{
                      color: "#d1d5db",
                      margin: "0 0 8px 0",
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    Total Spent This Month
                  </Text>
                  <Heading
                    style={{
                      fontSize: "36px",
                      fontWeight: "bold",
                      color: "#ffffff",
                      margin: "0 0 12px 0",
                      textAlign: "center",
                    }}
                  >
                    {formatCurrency(totalSpent)}
                  </Heading>
                  {previousMonthTotal && (
                    <Text
                      style={{
                        color: "#9ca3af",
                        margin: "0",
                        textAlign: "center",
                      }}
                    >
                      {formatPercentage(totalSpent, previousMonthTotal)} from{" "}
                      {month === "January"
                        ? "December"
                        : month === "February"
                          ? "January"
                          : "previous month"}
                    </Text>
                  )}
                </Column>
              </Row>
            </Section>

            {/* Category Breakdown */}
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
                  Spending by Category
                </Text>
                {categories.map((category, index) => (
                  <Section
                    key={category.category}
                    style={{
                      padding: "16px",
                      backgroundColor: "#374151",
                      borderRadius: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <Row>
                      <Column
                        width="20"
                        style={{
                          verticalAlign: "middle",
                          paddingRight: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: getCategoryColor(index),
                          }}
                        ></div>
                      </Column>
                      <Column style={{ verticalAlign: "middle" }}>
                        <Text
                          style={{
                            color: "#d1d5db",
                            margin: "0",
                            fontWeight: "500",
                          }}
                        >
                          {category.category || "Uncategorized"}
                        </Text>
                      </Column>
                      <Column align="right" style={{ verticalAlign: "middle" }}>
                        <Text
                          style={{
                            color: "#ffffff",
                            margin: "0 0 4px 0",
                            fontWeight: "600",
                          }}
                        >
                          {formatCurrency(category.amount)}
                        </Text>
                        <Text
                          style={{
                            color: "#9ca3af",
                            margin: "0",
                            fontSize: "14px",
                          }}
                        >
                          {category.percentage.toFixed(1)}%
                        </Text>
                      </Column>
                    </Row>
                  </Section>
                ))}
              </Column>
            </Row>

            {/* Top Contributors */}
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
                  Top Contributors
                </Text>
                {contributors.map((contributor, index) => (
                  <Section
                    key={contributor.userId}
                    style={{
                      padding: "16px",
                      backgroundColor: "#374151",
                      borderRadius: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <Row>
                      <Column
                        width="50"
                        style={{
                          verticalAlign: "middle",
                          paddingRight: "12px",
                        }}
                      >
                        <table
                          style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: "#4b5563",
                            borderRadius: "50%",
                          }}
                        >
                          <tr>
                            <td
                              align="center"
                              valign="middle"
                              style={{ height: "32px" }}
                            >
                              <Text
                                style={{
                                  color: "#d1d5db",
                                  margin: "0",
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  lineHeight: "1",
                                }}
                              >
                                {contributor.userName.charAt(0).toUpperCase()}
                              </Text>
                            </td>
                          </tr>
                        </table>
                      </Column>
                      <Column style={{ verticalAlign: "middle" }}>
                        <Text
                          style={{
                            color: "#d1d5db",
                            margin: "0",
                            fontWeight: "500",
                          }}
                        >
                          {contributor.userName}
                        </Text>
                      </Column>
                      <Column align="right" style={{ verticalAlign: "middle" }}>
                        <Text
                          style={{
                            color: "#ffffff",
                            margin: "0 0 4px 0",
                            fontWeight: "600",
                          }}
                        >
                          {formatCurrency(contributor.totalSpent)}
                        </Text>
                        <Text
                          style={{
                            color: "#9ca3af",
                            margin: "0",
                            fontSize: "14px",
                          }}
                        >
                          {contributor.percentage.toFixed(1)}%
                        </Text>
                      </Column>
                    </Row>
                  </Section>
                ))}
              </Column>
            </Row>

            {/* Notable Expenses */}
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
                  Notable Expenses
                </Text>
                {notableExpenses.map((expense) => {
                  const user = users.find((u) => u._id === expense.createdBy);
                  const date = new Date(expense.date);
                  const formattedDate = date.toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                  });

                  return (
                    <Section
                      key={expense._id}
                      style={{
                        padding: "16px",
                        backgroundColor: "#374151",
                        borderRadius: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <Row style={{ marginBottom: "8px" }}>
                        <Column style={{ verticalAlign: "middle" }}>
                          <Text
                            style={{
                              color: "#d1d5db",
                              margin: "0",
                              fontWeight: "600",
                            }}
                          >
                            {expense.description}
                          </Text>
                        </Column>
                        <Column
                          align="right"
                          style={{ verticalAlign: "middle" }}
                        >
                          <Text
                            style={{
                              color: "#ffffff",
                              margin: "0",
                              fontWeight: "bold",
                            }}
                          >
                            {formatCurrency(expense.amount)}
                          </Text>
                        </Column>
                      </Row>
                      <Row>
                        <Column style={{ verticalAlign: "middle" }}>
                          <Text
                            style={{
                              color: "#9ca3af",
                              margin: "0",
                              fontSize: "14px",
                            }}
                          >
                            {formattedDate} • {user?.name || "Unknown"}
                          </Text>
                        </Column>
                        <Column
                          align="right"
                          style={{ verticalAlign: "middle" }}
                        >
                          {expense.category && (
                            <Text
                              style={{
                                color: "#6b7280",
                                margin: "0",
                                fontSize: "14px",
                              }}
                            >
                              {expense.category}
                            </Text>
                          )}
                        </Column>
                      </Row>
                      {expense.notes && (
                        <Row>
                          <Column>
                            <Text
                              style={{
                                color: "#9ca3af",
                                margin: "8px 0 0 0",
                                fontSize: "14px",
                              }}
                            >
                              {expense.notes}
                            </Text>
                          </Column>
                        </Row>
                      )}
                    </Section>
                  );
                })}
              </Column>
            </Row>

            {/* Roadmap Section (Future Feature) */}
            <Section
              style={{
                backgroundColor: "#374151",
                border: "1px solid #4b5563",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "32px",
              }}
            >
              <Row style={{ marginBottom: "12px" }}>
                <Column>
                  <table>
                    <tr>
                      <td
                        style={{ verticalAlign: "middle", paddingRight: "8px" }}
                      >
                        <Img
                          src={`${baseUrl}/star.png`}
                          alt="FamilyTracker"
                          width="16"
                          height="16"
                        />
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <Text
                          style={{
                            color: "#fbbf24",
                            margin: "0",
                            fontWeight: "600",
                          }}
                        >
                          Coming Soon: Budget Tracking
                        </Text>
                      </td>
                    </tr>
                  </table>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text
                    style={{ color: "#9ca3af", margin: "0", fontSize: "14px" }}
                  >
                    We're working on budget features to help you stay on track
                    with your family's financial goals.
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Call to Action */}
            <Row>
              <Column align="center">
                <Button
                  href={appUrl}
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
                  View Full Report →
                </Button>
                <Text
                  style={{
                    color: "#9ca3af",
                    fontSize: "14px",
                    margin: "16px 0 0 0",
                    textAlign: "center",
                  }}
                >
                  Want to change your email preferences?{" "}
                  <Link
                    href={`${appUrl}/settings`}
                    style={{ color: "#ffffff", textDecoration: "underline" }}
                  >
                    Update settings
                  </Link>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6b7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                      </svg>
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

export default MonthlyDigest;
