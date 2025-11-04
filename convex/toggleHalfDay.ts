import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const toggleHalfDay = mutation({
  args: {
    date: v.string(), // Format: DD-MM-YY
    isHalfDay: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;

    // Get user profile for timezone
    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    const timeZone = userProfile?.defaultTimeZone || "Etc/GMT";

    // Parse the date string and calculate start/end of day
    const parts = args.date.split("-");
    const correctedDate = `20${parts[2]}-${parts[1]}-${parts[0]}`;
    const dateObj = new Date(correctedDate);
    const startOfDay = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
    ).getTime();
    const endOfDay =
      new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate() + 1,
      ).getTime() - 1;

    // Find the log document for this date
    const logDoc = await ctx.db
      .query("logs")
      .withIndex("userId_createdAt", (q) =>
        q
          .eq("userId", userId)
          .gte("createdAt", startOfDay)
          .lte("createdAt", endOfDay),
      )
      .first();

    if (!logDoc) {
      throw new Error("Log not found for the specified date");
    }

    // Validate that the log can be marked/unmarked as half day
    // Must have more than 1 entry and last entry must be "day end"
    if (logDoc.logEntries.length <= 1) {
      throw new Error("Cannot mark as half day: insufficient log entries");
    }

    const lastEntry = logDoc.logEntries[logDoc.logEntries.length - 1];
    if (lastEntry.logStatus !== "day end") {
      throw new Error("Cannot mark as half day: day has not ended yet");
    }

    // Update the isHalfDay field
    await ctx.db.patch(logDoc._id, {
      isHalfDay: args.isHalfDay,
      updatedAt: Date.now(),
    });

    return {
      message: `Log ${args.isHalfDay ? "marked" : "unmarked"} as half day successfully`,
      status: 200,
    };
  },
});