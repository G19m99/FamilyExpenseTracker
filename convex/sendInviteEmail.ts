import { Resend } from "@convex-dev/resend";
import { render } from "@react-email/render";
import { v } from "convex/values";
import InviteEmail from "../src/emails/InviteEmail";
import { components } from "./_generated/api";
import { internalAction } from "./_generated/server";

export const resend: Resend = new Resend(components.resend, {});

export const fakeActions = internalAction({
  handler: (ctx) => console.log("Hello from actions"),
});

export const sendInviteEmail = internalAction({
  args: {
    recipientName: v.optional(v.string()),
    senderName: v.string(),
    familyName: v.string(),
    inviteCode: v.string(),
    inviteUrl: v.string(),
    expiryDays: v.number(),
  },
  handler: async (ctx, args) => {
    const emailHtml = await render(
      InviteEmail({
        recipientName: args.recipientName,
        senderName: args.senderName,
        familyName: args.familyName,
        inviteCode: args.inviteCode,
        inviteUrl: args.inviteUrl,
        expiryDays: args.expiryDays,
      })
    );
    await resend.sendEmail(ctx, {
      from: "Me <me@support.surplustonerinc.com>",
      to: "gershymenzer@gmail.com",
      subject: "Hi there",
      html: emailHtml,
    });
  },
});
