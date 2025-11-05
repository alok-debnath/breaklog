import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const editLog = mutation({
  args: {
    logId: v.string(),
    logDateTime: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;

    // Find the log document containing the entry
    const allLogs = await ctx.db
      .query("logs")
      .withIndex("userId_creationTime", (q) => q.eq("userId", userId))
      .collect();

    const logDoc = allLogs.find((log) =>
      log.logEntries.some((entry) => entry.uniqueId === args.logId),
    );

    if (!logDoc) {
      throw new Error("No matching log entry found");
    }

    if (!logDoc) {
      throw new Error("No matching log entry found");
    }

    // Update the specific log entry
    const updatedEntries = logDoc.logEntries.map((entry) =>
      entry.uniqueId === args.logId
        ? { ...entry, logTime: args.logDateTime }
        : entry,
    );

    await ctx.db.patch(logDoc._id, {
      logEntries: updatedEntries,
      updatedAt: Date.now(),
    });

    return {
      message: "Log updated successfully",
    };
  },
});
