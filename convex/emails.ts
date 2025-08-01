"use node";

import { Resend } from "@convex-dev/resend";
import { render } from "@react-email/render";
import { v } from "convex/values";
import InviteEmail from "../src/emails/InviteEmail";
import MonthlyDigest from "../src/emails/MonthlyDigest";
import { components } from "./_generated/api";
import { internalAction } from "./_generated/server";

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
});

export const sendInviteEmail = internalAction({
  args: {
    //recipientName: v.optional(v.string()),
    recipientEmail: v.string(),
    senderName: v.string(),
    familyName: v.string(),
    inviteCode: v.string(),
    inviteUrl: v.string(),
    expiryDays: v.number(),
  },
  handler: async (ctx, args) => {
    console.log("Sending invite email to:", args.recipientEmail);
    const emailHtml = await render(
      InviteEmail({
        recipientName: args.recipientEmail,
        senderName: args.senderName,
        familyName: args.familyName,
        inviteCode: args.inviteCode,
        inviteUrl: args.inviteUrl,
        expiryDays: args.expiryDays,
      })
    );

    const id = await resend.sendEmail(ctx, {
      from: "Family Tracker <noreply@support.surplustonerinc.com>",
      to: args.recipientEmail,
      subject: `${args.senderName} invited you to join ${args.familyName} on FamilyTracker`,
      html: emailHtml,
    });
    console.log("Email sent with ID:", id);
  },
});

export const sendMonthlyDigestEmail = internalAction({
  args: {
    familyId: v.id("families"),
    year: v.number(),
    month: v.number(),
    recipientEmail: v.string(),
    familyName: v.string(),
    monthName: v.string(),
    digestData: v.object({
      familyName: v.string(),
      totalSpent: v.number(),
      previousMonthTotal: v.optional(v.number()),
      categories: v.array(
        v.object({
          category: v.string(),
          amount: v.number(),
          percentage: v.number(),
        })
      ),
      contributors: v.array(
        v.object({
          userId: v.string(),
          userName: v.string(),
          totalSpent: v.number(),
          percentage: v.number(),
        })
      ),
      notableExpenses: v.array(
        v.object({
          _id: v.string(),
          _creationTime: v.number(),
          description: v.string(),
          amount: v.number(),
          date: v.string(),
          category: v.optional(v.string()),
          createdBy: v.string(),
          notes: v.optional(v.string()),
          createdAt: v.optional(v.number()),
          familyId: v.optional(v.string()),
          updatedAt: v.optional(v.number()),
        })
      ),
      users: v.array(
        v.object({
          _id: v.string(),
          name: v.string(),
          email: v.string(),
        })
      ),
    }),
    appUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log(
      `Sending monthly digest to ${args.recipientEmail} for ${args.familyName}`
    );

    // Format currency for subject line
    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount / 100);
    };

    // Add color property to categories for the email component
    const categoriesWithColors = args.digestData.categories.map(
      (category, index) => ({
        ...category,
        color: `bg-${["blue", "green", "yellow", "red", "purple", "pink", "indigo", "orange"][index % 8]}-500`,
      })
    );

    // Render the email
    const emailHtml = await render(
      MonthlyDigest({
        familyName: args.digestData.familyName,
        month: args.monthName,
        year: args.year,
        totalSpent: args.digestData.totalSpent,
        previousMonthTotal: args.digestData.previousMonthTotal,
        expenses: args.digestData.notableExpenses,
        users: args.digestData.users,
        categories: categoriesWithColors,
        contributors: args.digestData.contributors,
        notableExpenses: args.digestData.notableExpenses,
        appUrl: args.appUrl || "https://familytracker.app",
      })
    );

    // Send the email
    const id = await resend.sendEmail(ctx, {
      from: "FamilyTracker <noreply@support.surplustonerinc.com>",
      to: args.recipientEmail,
      subject: `Your ${args.monthName} ${args.year} Family Expense Summary - ${formatCurrency(args.digestData.totalSpent)}`,
      html: emailHtml,
    });

    console.log(`Monthly digest sent to ${args.recipientEmail} with ID: ${id}`);
    return { success: true, id };
  },
});
