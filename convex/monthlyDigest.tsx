import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

// Helper function to get monthly digest data
export const getMonthlyDigestData = internalQuery({
  args: {
    familyId: v.id("families"),
    year: v.number(),
    month: v.number(), // 1-12
  },
  handler: async (ctx, args) => {
    const family = await ctx.db.get(args.familyId);
    if (!family) {
      throw new Error("Family not found");
    }

    // Get start and end dates for the month
    const startDate = `${args.year}-${args.month.toString().padStart(2, "0")}-01`;
    const endDate = `${args.year}-${args.month.toString().padStart(2, "0")}-${new Date(args.year, args.month, 0).getDate().toString().padStart(2, "0")}`;

    // Get expenses for the month
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_family_and_date", (q) =>
        q
          .eq("familyId", args.familyId)
          .gte("date", startDate)
          .lte("date", endDate)
      )
      .collect();

    // Get previous month's total
    const prevMonth = args.month === 1 ? 12 : args.month - 1;
    const prevYear = args.month === 1 ? args.year - 1 : args.year;
    const prevStartDate = `${prevYear}-${prevMonth.toString().padStart(2, "0")}-01`;
    const prevEndDate = `${prevYear}-${prevMonth.toString().padStart(2, "0")}-${new Date(prevYear, prevMonth, 0).getDate().toString().padStart(2, "0")}`;

    const prevMonthExpenses = await ctx.db
      .query("expenses")
      .withIndex("by_family_and_date", (q) =>
        q
          .eq("familyId", args.familyId)
          .gte("date", prevStartDate)
          .lte("date", prevEndDate)
      )
      .collect();

    const previousMonthTotal = prevMonthExpenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    // Calculate total spent
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Get all users in the family
    const familyMembers = await ctx.db
      .query("familyMembers")
      .withIndex("by_family", (q) => q.eq("familyId", args.familyId))
      .collect();

    const userIds = familyMembers.map((member) => member.userId);
    const users = await Promise.all(
      userIds.map(async (userId) => {
        const user = await ctx.db.get(userId);
        return {
          _id: userId,
          name: user?.name || "Unknown User",
          email: user?.email || "",
        };
      })
    );

    // Calculate category breakdown
    const categoryMap = new Map<string, number>();
    expenses.forEach((expense) => {
      const category = expense.category || "Uncategorized";
      categoryMap.set(
        category,
        (categoryMap.get(category) || 0) + expense.amount
      );
    });

    const categories = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Calculate contributor breakdown
    const contributorMap = new Map<string, number>();
    expenses.forEach((expense) => {
      contributorMap.set(
        expense.createdBy,
        (contributorMap.get(expense.createdBy) || 0) + expense.amount
      );
    });

    const contributors = Array.from(contributorMap.entries())
      .map(([userId, totalSpent]) => {
        const user = users.find((u) => u._id === userId);
        return {
          userId: userId as any, // Type assertion for Id<"users">
          userName: user?.name || "Unknown User",
          totalSpent,
          percentage: totalSpent > 0 ? (totalSpent / totalSpent) * 100 : 0,
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent);

    // Get notable expenses (top 3 by amount)
    //TODO: Analyze expenses to get expenses that stand out not just by amount
    const notableExpenses = expenses
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    return {
      familyName: family.name,
      totalSpent,
      previousMonthTotal:
        previousMonthTotal > 0 ? previousMonthTotal : undefined,
      categories,
      contributors,
      notableExpenses,
      users,
    };
  },
});
