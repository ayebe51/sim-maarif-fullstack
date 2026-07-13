import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create or update a subscription
export const createSubscription = mutation({
  args: {
    schoolId: v.id("schools"),
    planType: v.string(),
    billingCycle: v.string(),
    price: v.number(),
    durationDays: v.number(),
  },
  handler: async (ctx, args) => {
    // Check existing
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .first();
      
    if (existing) {
      await ctx.db.patch(existing._id, {
        planType: args.planType,
        billingCycle: args.billingCycle,
        price: args.price,
        updatedAt: Date.now(),
      });
      return existing._id;
    }
    
    return await ctx.db.insert("subscriptions", {
      schoolId: args.schoolId,
      planType: args.planType,
      status: "PENDING",
      billingCycle: args.billingCycle,
      price: args.price,
      expiresAt: Date.now() + args.durationDays * 24 * 60 * 60 * 1000,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }
});

// Create a transaction
export const createTransaction = mutation({
  args: {
    schoolId: v.id("schools"),
    subscriptionId: v.id("subscriptions"),
    amount: v.number(),
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("transactions", {
      ...args,
      paymentStatus: "PENDING",
      createdAt: Date.now(),
    });
  }
});

// Handle Mock Payment Webhook
export const handlePaymentWebhook = mutation({
  args: {
    transactionId: v.id("transactions"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.transactionId, {
      paymentStatus: args.status,
      paidAt: args.status === "PAID" ? Date.now() : undefined,
    });
    
    // if paid, update subscription status
    if (args.status === "PAID") {
      const tx = await ctx.db.get(args.transactionId);
      if (tx) {
         await ctx.db.patch(tx.subscriptionId, {
           status: "ACTIVE",
           updatedAt: Date.now()
         });
      }
    }
  }
});
