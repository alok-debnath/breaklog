import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const updateProfile = mutation({
  args: {
    dailyWorkRequired: v.optional(v.number()),
    logType: v.optional(v.string()),
    defaultTimeZone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    const updates: {
      dailyWorkRequired?: number;
      logType?: string;
      defaultTimeZone?: string;
    } = {};
    if (args.dailyWorkRequired !== undefined)
      updates.dailyWorkRequired = args.dailyWorkRequired;
    if (args.logType !== undefined) updates.logType = args.logType;
    if (args.defaultTimeZone !== undefined)
      updates.defaultTimeZone = args.defaultTimeZone;

    await ctx.db.patch(userProfile._id, updates);

    return {
      message: "Profile updated successfully",
      status: 200,
    };
  },
});
