import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";
import { internalAction } from "./_generated/server";

export const resend: Resend = new Resend(components.resend, {});

export const sendInviteEmail = internalAction({
  handler: async (ctx) => {
    await resend.sendEmail(ctx, {
      from: "Me <me@support.surplustonerinc.com>",
      to: "gershymenzer@gmail.com",
      subject: "Hi there",
      html: "This is a test email",
    });
  },
});
