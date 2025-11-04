import { mutation, query } from "./_generated/server";

export const fetchProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { error: "unauthorized" };

    const userId = identity.subject;

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    // If userProfile doesn't exist, return default values
    const profileData = userProfile || {
      username: identity.name || identity.email?.split("@")[0] || "user",
      dailyWorkRequired: 8,
      logType: "breakmode",
      defaultTimeZone: "Etc/GMT",
    };

    return {
      message: "User found",
      userProfileExists: !!userProfile,
      data: {
        id: userId,
        name: identity.name,
        email: identity.email,
        username: profileData.username,
        daily_work_required: profileData.dailyWorkRequired,
        log_type: profileData.logType,
        default_time_zone: profileData.defaultTimeZone,
      },
    };
  },
});

export const createUserProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      return { message: "User profile already exists" };
    }

    const newProfileId = await ctx.db.insert("userProfiles", {
      userId,
      username: identity.name || identity.email?.split("@")[0] || "user",
      logType: "daymode",
      dailyWorkRequired: 0,
      defaultTimeZone: "",
      role: "user",
      isVerified: false,
    });

    return { message: "User profile created", profileId: newProfileId };
  },
});
