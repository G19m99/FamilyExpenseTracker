import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  families: defineTable({
    name: v.string(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  }),

  familyMembers: defineTable({
    familyId: v.id("families"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
    status: v.union(v.literal("active"), v.literal("invited"), v.literal("removed")),
    invitedBy: v.optional(v.id("users")),
    invitedAt: v.optional(v.number()),
    joinedAt: v.optional(v.number()),
  })
    .index("by_family", ["familyId"])
    .index("by_user", ["userId"])
    .index("by_family_and_user", ["familyId", "userId"]),

  expenses: defineTable({
    familyId: v.id("families"),
    createdBy: v.id("users"),
    date: v.string(), // YYYY-MM-DD format
    description: v.string(),
    amount: v.number(), // in cents
    notes: v.optional(v.string()),
    category: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_family", ["familyId"])
    .index("by_family_and_date", ["familyId", "date"])
    .index("by_family_and_created_by", ["familyId", "createdBy"]),

  invitations: defineTable({
    familyId: v.id("families"),
    email: v.string(),
    invitedBy: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("expired")),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_email", ["email"])
    .index("by_family", ["familyId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
