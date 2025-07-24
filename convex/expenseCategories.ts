import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserFamilyId } from "./lib/family";

export const getExpenseCategories = query({
  args: {},
  handler: async (ctx, args) => {
    const { familyId } = await getUserFamilyId(ctx);

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_family", (q) => q.eq("familyId", familyId))
      .collect();

    return categories.map((category) => category.name);
  },
});

export const createInitialExpenseCategories = mutation({
  args: {
    familyId: v.id("families"),
  },
  handler: async (ctx, args) => {
    const { userId } = await getUserFamilyId(ctx);

    const expenseCategories = [
      "Groceries",
      "Restaurants & Takeout",
      "Coffee & Snacks",
      "Household Supplies",
      "Personal Care",
      "Clothing & Shoes",
      "Gas & Fuel",
      "Public Transportation",
      "Rideshare",
      "Parking & Tolls",
      "Vehicle Maintenance",
      "Vehicle Insurance",
      "Car Loan Payments",
      "Rent or Mortgage",
      "Electricity",
      "Water & Sewer",
      "Gas (Home)",
      "Internet",
      "Mobile Phone",
      "Home Maintenance & Repairs",
      "Property Taxes",
      "Home Insurance",
      "Health Insurance",
      "Doctor Visits",
      "Dental & Vision",
      "Medications",
      "Therapy & Mental Health",
      "Fitness",
      "Tuition & School Fees",
      "Books & Supplies",
      "Childcare & Babysitting",
      "Kids' Activities",
      "Office Supplies",
      "Software Subscriptions",
      "Freelance/Contractor Payments",
      "Business Travel",
      "Professional Services",
      "Loan Payments",
      "Credit Card Payments",
      "Bank Fees",
      "Savings & Investments",
      "Taxes",
      "Flights",
      "Hotels",
      "Vacation Spending",
      "Events & Activities",
      "Entertainment",
      "Subscriptions",
      "Gifts",
      "Charitable Donations",
      "Pet Food & Supplies",
      "Vet Visits",
      "Pet Insurance",
      "Grooming",
      "Postage & Shipping",
      "Legal Fees",
      "Other",
    ];
    //create a bulk insert for the categories
    await Promise.all(
      expenseCategories.map((name) => {
        return ctx.db.insert("categories", {
          name,
          familyId: args.familyId,
          createdBy: userId,
          createdAt: Date.now(),
        });
      })
    );
  },
});
