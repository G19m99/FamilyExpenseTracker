import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalAction, internalQuery } from "./_generated/server";

const crons = cronJobs();

// Monthly digest cron job - runs on the 1st of every month at 9 AM
crons.monthly(
  "send-monthly-digest-emails",
  { day: 1, hourUTC: 9, minuteUTC: 0 },
  "crons:sendMonthlyDigestEmails" as any,
  {}
);

//! For testing purposes, you can use crons.interval to run more frequently:
// crons.interval(
//   "test-digest-emails",
//   { minutes: 1 },
//   "crons:sendMonthlyDigestEmails" as any,
//   {}
// );

// Get all families that should receive monthly digest emails
export const getFamiliesForMonthlyDigest = internalQuery({
  args: {},
  // returns: v.array(
  //   v.object({
  //     familyId: v.id("families"),
  //     familyName: v.string(),
  //     memberEmails: v.array(v.string()),
  //   })
  // ),
  handler: async (ctx) => {
    const families = await ctx.db.query("families").collect();

    const familiesWithEmails = await Promise.all(
      families.map(async (family) => {

        const familyMembers = await ctx.db
          .query("familyMembers")
          .withIndex("by_family", (q) => q.eq("familyId", family._id))
          .filter((q) => q.eq(q.field("status"), "active"))
          .collect();

        const memberEmails = await Promise.all(
          familyMembers.map(async (member) => {
            const user = await ctx.db.get(member.userId);
            return user?.email || "";
          })
        );

        return {
          familyId: family._id,
          familyName: family.name,
          memberEmails: memberEmails.filter((email) => email !== ""),
        };
      })
    );

    // Only return families that have at least one member with an email
    return familiesWithEmails.filter(
      (family) => family.memberEmails.length > 0
    );
  },
});

// Main cron action to send monthly digest emails
export const sendMonthlyDigestEmails = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log("Starting monthly digest email cron job...");

    // Get the previous month's data
    const now = new Date();
    const previousMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const previousYear =
      now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    console.log(
      `Processing monthly digest for ${previousMonth}/${previousYear}`
    );

    // Get all families that should receive emails
    const families = await ctx.runQuery(
      "crons:getFamiliesForMonthlyDigest" as any,
      {}
    );

    const results = [];
    let totalSuccessfulEmails = 0;
    let totalFailedEmails = 0;

    for (const family of families) {
      try {
        console.log(
          `Processing family: ${family.familyName} (${family.familyId})`
        );

        // Get monthly digest data for this family
        const digestData = await ctx.runQuery(
          "monthlyDigest:getMonthlyDigestData" as any,
          {
            familyId: family.familyId,
            year: previousYear,
            month: previousMonth,
          }
        );

        // Skip if no expenses for the month
        if (digestData.totalSpent === 0) {
          console.log(
            `No expenses found for ${family.familyName} in ${previousMonth}/${previousYear}`
          );
          results.push({
            familyId: family.familyId,
            familyName: family.familyName,
            success: true,
            emailsSent: 0,
          });
          continue;
        }

        // Generate month name
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const monthName = monthNames[previousMonth - 1];

        // Send email to each family member
        const emailResults = await Promise.all(
          family.memberEmails.map(async (email: string) => {
            try {
              await ctx.runAction(internal.emails.sendMonthlyDigestEmail, {
                familyId: family.familyId,
                year: previousYear,
                month: previousMonth,
                recipientEmail: email,
                familyName: family.familyName,
                monthName,
                digestData,
              });
              return { email, success: true };
            } catch (error) {
              console.error(`Failed to send email to ${email}:`, error);
              return {
                email,
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
              };
            }
          })
        );

        const successfulEmails = emailResults.filter((r) => r.success).length;
        const failedEmails = emailResults.filter((r) => !r.success).length;

        totalSuccessfulEmails += successfulEmails;
        totalFailedEmails += failedEmails;

        results.push({
          familyId: family.familyId,
          familyName: family.familyName,
          success: successfulEmails > 0,
          emailsSent: successfulEmails,
        });

        console.log(
          `Completed ${family.familyName}: ${successfulEmails} sent, ${failedEmails} failed`
        );
      } catch (error) {
        console.error(`Failed to process family ${family.familyName}:`, error);
        results.push({
          familyId: family.familyId,
          familyName: family.familyName,
          success: false,
          emailsSent: 0,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        totalFailedEmails += family.memberEmails.length;
      }
    }

    console.log(
      `Monthly digest cron job completed: ${totalSuccessfulEmails} successful, ${totalFailedEmails} failed`
    );

    return {
      totalFamilies: families.length,
      successfulEmails: totalSuccessfulEmails,
      failedEmails: totalFailedEmails,
      results,
    };
  },
});

export default crons;
