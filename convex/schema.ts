import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles for app-specific settings
  userProfiles: defineTable({
    userId: v.string(),
    username: v.optional(v.string()),
    logType: v.string(),
    dailyWorkRequired: v.optional(v.number()), // in hours
    defaultLogStart: v.optional(v.number()), // timestamp
    defaultLogEnd: v.optional(v.number()), // timestamp
    defaultBreakTime: v.optional(v.number()), // in minutes
    defaultTimeZone: v.optional(v.string()),
    defaultTheme: v.optional(v.string()),
    role: v.string(),
    isVerified: v.boolean(),
  })
    .index("userId", ["userId"])
    .index("username", ["username"]),

  // Logs table
  logs: defineTable({
    userId: v.string(),
    timeZone: v.string(),
    logEntries: v.array(v.object({
      uniqueId: v.string(),
      logStatus: v.string(),
      logTime: v.number(), // timestamp
      createdAt: v.number(), // timestamp
    })),
    isHalfDay: v.boolean(),
    createdAt: v.number(), // timestamp
    updatedAt: v.number(), // timestamp
  })
    .index("userId_createdAt", ["userId", "createdAt"])
    .index("userId", ["userId"]),
});