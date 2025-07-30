import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";

export const _sendInviteInternal = internalMutation({
  args: {
    familyId: v.id("families"),
    email: v.string(),
    invitedBy: v.id("users"),
    familyName: v.optional(v.string()),
    senderName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    const existingInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .filter((q) =>
        q.and(
          q.eq(q.field("familyId"), args.familyId),
          q.eq(q.field("status"), "pending")
        )
      )
      .first();

    const token = crypto.randomUUID();
    if (!existingInvitation) {
      await ctx.db.insert("invitations", {
        familyId: args.familyId,
        email,
        invitedBy: args.invitedBy,
        token,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        status: "pending",
        createdAt: Date.now(),
      });
    }

    // Schedule the invite email to be sent
    await ctx.scheduler.runAfter(0, internal.emails.sendInviteEmail, {
      recipientEmail: email,
      senderName: args.senderName || "",
      familyName: args.familyName || "Family",
      inviteCode: token,
      inviteUrl: `https://family-expense-tracker.netlify.app?invite-token=${token}`,
      expiryDays: 7,
    });

    return token;
  },
});

export const getCurrentUserFamily = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const membership = await ctx.db
      .query("familyMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (!membership) return null;

    const family = await ctx.db.get(membership.familyId);
    if (!family) return null;

    return {
      family,
      membership,
    };
  },
});

export const createFamily = mutation({
  args: {
    name: v.string(),
    inviteEmails: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user already belongs to a family
    const existingMembership = await ctx.db
      .query("familyMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (existingMembership) {
      throw new Error("You already belong to a family");
    }

    // Create family
    const familyId = await ctx.db.insert("families", {
      name: args.name,
      createdBy: userId,
      createdAt: Date.now(),
    });

    // Add creator as admin
    await ctx.db.insert("familyMembers", {
      familyId,
      userId,
      role: "admin",
      status: "active",
      joinedAt: Date.now(),
    });

    // Get creator's info for invite emails
    const creator = await ctx.db.get(userId);
    if (!creator) throw new Error("Creator user not found");

    // Create invitations for provided emails
    const validEmails = args.inviteEmails.filter((email) => email.trim());

    // Send invites in parallel for better performance
    await Promise.all(
      validEmails.map(async (email) => {
        try {
          await ctx.runMutation(internal.families._sendInviteInternal, {
            familyId,
            email,
            invitedBy: userId,
            familyName: args.name,
            senderName: creator.name || creator.email || "",
          });
        } catch (error) {
          // Log the error but continue with other invites
          console.error(`Failed to send invite to ${email}:`, error);
        }
      })
    );

    await ctx.runMutation(
      api.expenseCategories.createInitialExpenseCategories,
      {
        familyId,
      }
    );
    return familyId;
  },
});

export const getFamilyMembers = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const userMembership = await ctx.db
      .query("familyMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (!userMembership) throw new Error("Not a family member");

    const members = await ctx.db
      .query("familyMembers")
      .withIndex("by_family", (q) => q.eq("familyId", userMembership.familyId))
      .collect();

    const membersWithUsers = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          user,
        };
      })
    );

    return membersWithUsers;
  },
});

export const inviteUser = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const userMembership = await ctx.db
      .query("familyMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (!userMembership || userMembership.role !== "admin") {
      throw new Error("Only family admins can invite users");
    }

    const family = await ctx.db.get(userMembership.familyId);
    const invitingMember = await ctx.db.get(userMembership.userId);

    if (!family || !invitingMember) {
      throw new Error("Family or inviting member not found");
    }

    return await ctx.runMutation(internal.families._sendInviteInternal, {
      familyId: userMembership.familyId,
      email: args.email,
      invitedBy: userId,
      familyName: family.name,
      senderName: invitingMember.name || invitingMember.email || "",
    });
  },
});

export const removeMember = mutation({
  args: {
    memberId: v.id("familyMembers"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const userMembership = await ctx.db
      .query("familyMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (!userMembership || userMembership.role !== "admin") {
      throw new Error("Only family admins can remove members");
    }

    const memberToRemove = await ctx.db.get(args.memberId);
    if (
      !memberToRemove ||
      memberToRemove.familyId !== userMembership.familyId
    ) {
      throw new Error("Member not found");
    }

    if (memberToRemove.userId === userId) {
      throw new Error("Cannot remove yourself");
    }

    await ctx.db.patch(args.memberId, {
      status: "removed",
    });
  },
});
