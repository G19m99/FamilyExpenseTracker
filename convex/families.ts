import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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

    // Create invitations for provided emails
    for (const email of args.inviteEmails) {
      if (email.trim()) {
        const token = crypto.randomUUID();
        await ctx.db.insert("invitations", {
          familyId,
          email: email.trim().toLowerCase(),
          invitedBy: userId,
          token,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
          status: "pending",
          createdAt: Date.now(),
        });
      }
    }

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
  handler: async (ctx, args) => {
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

    const email = args.email.trim().toLowerCase();

    // Check if user is already invited or member
    const existingInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .filter((q) => 
        q.and(
          q.eq(q.field("familyId"), userMembership.familyId),
          q.eq(q.field("status"), "pending")
        )
      )
      .first();

    if (existingInvitation) {
      throw new Error("User already invited");
    }

    const token = crypto.randomUUID();
    await ctx.db.insert("invitations", {
      familyId: userMembership.familyId,
      email,
      invitedBy: userId,
      token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      status: "pending",
      createdAt: Date.now(),
    });

    return token;
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
    if (!memberToRemove || memberToRemove.familyId !== userMembership.familyId) {
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
