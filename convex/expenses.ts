import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserFamilyId } from "./lib/family";

export const getExpenses = query({
  args: {
    search: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    minAmount: v.optional(v.number()),
    maxAmount: v.optional(v.number()),
    category: v.optional(v.string()),
    sortBy: v.optional(
      v.union(v.literal("date"), v.literal("amount"), v.literal("description"))
    ),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    const { familyId } = await getUserFamilyId(ctx);

    let query = ctx.db
      .query("expenses")
      .withIndex("by_family", (q) => q.eq("familyId", familyId));

    // Apply date filters
    if (args.startDate || args.endDate) {
      query = ctx.db
        .query("expenses")
        .withIndex("by_family_and_date", (q: any) => {
          let dateQuery = q.eq("familyId", familyId);
          if (args.startDate) {
            dateQuery = dateQuery.gte("date", args.startDate);
          }
          if (args.endDate) {
            dateQuery = dateQuery.lte("date", args.endDate);
          }
          return dateQuery;
        });
    }

    let expenses = await query.collect();

    // Apply filters
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      expenses = expenses.filter(
        (expense) =>
          expense.description.toLowerCase().includes(searchLower) ||
          (expense.notes && expense.notes.toLowerCase().includes(searchLower))
      );
    }

    if (args.minAmount !== undefined) {
      expenses = expenses.filter(
        (expense) => expense.amount >= args.minAmount!
      );
    }

    if (args.maxAmount !== undefined) {
      expenses = expenses.filter(
        (expense) => expense.amount <= args.maxAmount!
      );
    }

    if (args.category) {
      expenses = expenses.filter(
        (expense) => expense.category === args.category
      );
    }

    // Apply sorting
    const sortBy = args.sortBy || "date";
    const sortOrder = args.sortOrder || "desc";

    expenses.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortBy) {
        case "date":
          aVal = a.date;
          bVal = b.date;
          break;
        case "amount":
          aVal = a.amount;
          bVal = b.amount;
          break;
        case "description":
          aVal = a.description.toLowerCase();
          bVal = b.description.toLowerCase();
          break;
        default:
          aVal = a.date;
          bVal = b.date;
      }

      if (sortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    // Get user info for each expense
    const expensesWithUsers = await Promise.all(
      expenses.map(async (expense) => {
        const user = await ctx.db.get(expense.createdBy);
        return {
          ...expense,
          createdByUser: user,
        };
      })
    );

    return expensesWithUsers;
  },
});

export const createExpense = mutation({
  args: {
    date: v.string(),
    description: v.string(),
    amount: v.number(),
    notes: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, familyId } = await getUserFamilyId(ctx);

    if (!args.description.trim()) {
      throw new Error("Description is required");
    }

    if (args.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const expenseId = await ctx.db.insert("expenses", {
      familyId,
      createdBy: userId,
      date: args.date,
      description: args.description.trim(),
      amount: Math.round(args.amount * 100), // Convert to cents
      notes: args.notes?.trim(),
      category: args.category,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return expenseId;
  },
});

export const updateExpense = mutation({
  args: {
    expenseId: v.id("expenses"),
    date: v.string(),
    description: v.string(),
    amount: v.number(),
    notes: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { familyId } = await getUserFamilyId(ctx);

    const expense = await ctx.db.get(args.expenseId);
    if (!expense || expense.familyId !== familyId) {
      throw new Error("Expense not found");
    }

    if (!args.description.trim()) {
      throw new Error("Description is required");
    }

    if (args.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    await ctx.db.patch(args.expenseId, {
      date: args.date,
      description: args.description.trim(),
      amount: Math.round(args.amount * 100), // Convert to cents
      notes: args.notes?.trim(),
      category: args.category,
      updatedAt: Date.now(),
    });
  },
});

export const deleteExpense = mutation({
  args: {
    expenseId: v.id("expenses"),
  },
  handler: async (ctx, args) => {
    const { familyId } = await getUserFamilyId(ctx);

    const expense = await ctx.db.get(args.expenseId);
    if (!expense || expense.familyId !== familyId) {
      throw new Error("Expense not found");
    }

    await ctx.db.delete(args.expenseId);
  },
});

export const getExpenseCategories = query({
  args: {},
  handler: async (ctx) => {
    const { familyId } = await getUserFamilyId(ctx);

    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_family", (q) => q.eq("familyId", familyId))
      .collect();

    const categories = new Set<string>();
    expenses.forEach((expense) => {
      if (expense.category) {
        categories.add(expense.category);
      }
    });

    return Array.from(categories).sort();
  },
});
