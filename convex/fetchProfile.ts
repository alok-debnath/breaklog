import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth"; // Import the component client

export const fetchProfile = query({
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
        username: profileData.username,
        daily_work_required: profileData.dailyWorkRequired,
        log_type: profileData.logType,
        default_time_zone: profileData.defaultTimeZone,
        user_image: authUser.image || null,
      },
    };
  },
});

export const createUserProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.safeGetAuthUser(ctx);
    if (!authUser) throw new Error("Unauthorized");

    const userId = authUser._id;

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      return { message: "User profile already exists" };
    }

    const newProfileId = await ctx.db.insert("userProfiles", {
      userId,
      username: authUser.name || authUser.email?.split("@")[0] || "user",
      logType: "daymode",
      dailyWorkRequired: 0,
      defaultTimeZone: "",
      role: "user",
      isVerified: false,
    });

    return { message: "User profile created", profileId: newProfileId };
  },
});
