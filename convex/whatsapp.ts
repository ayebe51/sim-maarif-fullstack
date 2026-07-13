import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Queue a new WhatsApp message
export const queueMessage = mutation({
  args: {
    schoolId: v.optional(v.id("schools")),
    targetNumber: v.string(),
    message: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("wa_outbox", {
      schoolId: args.schoolId,
      targetNumber: args.targetNumber,
      message: args.message,
      type: args.type,
      status: "PENDING",
      createdAt: Date.now(),
    });
  },
});

// For GoWA or external workers to poll pending messages
export const getPendingMessages = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("wa_outbox")
      .withIndex("by_status", (q) => q.eq("status", "PENDING"))
      .take(args.limit || 50);
  },
});

// Update message status after sending
export const updateMessageStatus = mutation({
  args: {
    messageId: v.id("wa_outbox"),
    status: v.string(),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      status: args.status,
      errorMessage: args.errorMessage,
      sentAt: args.status === "SENT" ? Date.now() : undefined,
    });
  },
});
