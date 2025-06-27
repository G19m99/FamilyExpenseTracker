import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getInvitationByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation || invitation.status !== "pending" || invitation.expiresAt < Date.now()) {
      return null;
    }

    const family = await ctx.db.get(invitation.familyId);
    const invitedBy = await ctx.db.get(invitation.invitedBy);

    return {
      ...invitation,
      family,
      invitedBy,
    };
  },
});

export const acceptInvitation = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation || invitation.status !== "pending" || invitation.expiresAt < Date.now()) {
      throw new Error("Invalid or expired invitation");
    }

    // Check if user email matches invitation
    if (user.email !== invitation.email) {
      throw new Error("This invitation is for a different email address");
    }

    // Check if user already belongs to a family
    const existingMembership = await ctx.db
      .query("familyMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (existingMembership) {
      throw new Error("You already belong to a family");
    }

    // Add user to family
    await ctx.db.insert("familyMembers", {
      familyId: invitation.familyId,
      userId,
      role: "member",
      status: "active",
      invitedBy: invitation.invitedBy,
      invitedAt: invitation.createdAt,
      joinedAt: Date.now(),
    });

    // Mark invitation as accepted
    await ctx.db.patch(invitation._id, {
      status: "accepted",
    });

    return invitation.familyId;
  },
});
