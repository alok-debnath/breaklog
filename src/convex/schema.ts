import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles for app-specific settings
  userProfiles: defineTable({
    userId: v.string(),
    logType: v.string(),
    dailyWorkRequired: v.optional(v.number()), // in hours
    defaultTimeZone: v.optional(v.string()),
    role: v.string(),
  })
    .index("userId", ["userId"]),

  // Logs table
  logs: defineTable({
    userId: v.string(),
    timeZone: v.string(),
    logEntries: v.array(
      v.object({
        uniqueId: v.string(),
        logStatus: v.string(),
        logTime: v.number(), // timestamp
        createdAt: v.number(), // timestamp
      })
    ),
    isHalfDay: v.boolean(),
    updatedAt: v.number(), // timestamp
  })
    .index("userId_creationTime", ["userId"]),
});
