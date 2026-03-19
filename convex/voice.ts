import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createVoice = mutation({
  args: {
    title: v.string(),
    cloudId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const date = Date.now();
    return await ctx.db.insert("voice", {
      title: args.title,
      cloudId: args.cloudId,
      userId: args.userId,
      createdAt: date,
      updatedAt: date,
    });
  },
});
