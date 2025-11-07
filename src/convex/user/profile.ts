import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth"; // Import the component client

export const fetch = query({
  args: {},
  handler: async (ctx) => {
    // Get the Better Auth user using the component client
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) return { error: "unauthorized" };

    const userId = authUser._id; // Use the Better Auth user ID

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    // If userProfile doesn't exist, return default values
    const profileData = userProfile || {
      username: authUser.name || authUser.email?.split("@")[0] || "user",
      dailyWorkRequired: 0,
      logType: "daymode",
      defaultTimeZone: "",
    };

    return {
      message: "User found",
      userProfileExists: !!userProfile,
      data: {
        id: userId,
        name: authUser.name,
        email: authUser.email,
        username: authUser.name,
        daily_work_required: profileData.dailyWorkRequired,
        log_type: profileData.logType,
        default_time_zone: profileData.defaultTimeZone,
        user_image: authUser.image || null,
      },
    };
  },
});

export const create = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) throw new Error("Unauthorized");

    const userId = authUser._id;

    console.log("authUser: ",authUser);
    

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      return { message: "User profile already exists" };
    }

    const newProfileId = await ctx.db.insert("userProfiles", {
      userId,
      logType: "daymode",
      dailyWorkRequired: 0,
      defaultTimeZone: "",
      role: "user",
    });

    return { message: "User profile created", profileId: newProfileId };
  },
});

export const update = mutation({
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
