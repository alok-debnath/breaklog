import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const submitLog = mutation({
  args: {
    logtype: v.string(),
    date: v.optional(v.string()), // Format: DD-MM-YY
    customLogTime: v.optional(v.number()), // Timestamp in milliseconds
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    if (!userProfile) throw new Error("User profile not found");

    const timeZone = userProfile.defaultTimeZone || "Etc/GMT";

    let startOfDay: number;
    let endOfDay: number;

    if (args.date) {
      const parts = args.date.split("-");
      const correctedDate = `20${parts[2]}-${parts[1]}-${parts[0]}`;
      const dateObj = new Date(correctedDate);
      startOfDay = new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate()
      ).getTime();
      endOfDay =
        new Date(
          dateObj.getFullYear(),
          dateObj.getMonth(),
          dateObj.getDate() + 1
        ).getTime() - 1;
    } else {
      const now = new Date();
      startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).getTime();
      endOfDay =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        ).getTime() - 1;
    }

    // Find the log document for today
    const logDoc = await ctx.db
      .query("logs")
      .withIndex("userId_creationTime", (q) =>
        q
          .eq("userId", userId)
          .gte("_creationTime", startOfDay)
          .lte("_creationTime", endOfDay)
      )
      .first();

    let logToBeSaved = "";
    let message = "Log submitted successfully";

    if (args.logtype === "undo log") {
      if (logDoc && logDoc.logEntries.length > 0) {
        const updatedEntries = logDoc.logEntries.slice(0, -1); // Remove last entry
        await ctx.db.patch(logDoc._id, {
          logEntries: updatedEntries,
          isHalfDay: false,
          updatedAt: Date.now(),
        });
        message = "Last log entry deleted successfully";
      } else {
        message = "No log entries to delete";
      }
    } else if (args.logtype === "mark-as-half-day") {
      if (logDoc && logDoc.logEntries.length > 1) {
        const lastEntry = logDoc.logEntries[logDoc.logEntries.length - 1];
        if (lastEntry.logStatus === "day end") {
          await ctx.db.patch(logDoc._id, {
            isHalfDay: true,
            updatedAt: Date.now(),
          });
          message = "Marked as half day successfully";
        } else {
          message = "Cannot mark as half day: day not ended";
        }
      } else {
        message = "Cannot mark as half day: insufficient log entries";
      }
    } else if (args.logtype === "undo-half-day") {
      if (logDoc && logDoc.logEntries.length > 1) {
        const lastEntry = logDoc.logEntries[logDoc.logEntries.length - 1];
        if (lastEntry.logStatus === "day end") {
          await ctx.db.patch(logDoc._id, {
            isHalfDay: false,
            updatedAt: Date.now(),
          });
          message = "Half day marking undone successfully";
        } else {
          message = "Cannot undo half day: day not ended";
        }
      } else {
        message = "Cannot undo half day: insufficient log entries";
      }
    }

    if (args.logtype === "day log") {
      if (!logDoc || logDoc.logEntries.length === 0) {
        logToBeSaved = "day start";
      } else {
        const lastLogStatus =
          logDoc.logEntries[logDoc.logEntries.length - 1].logStatus;
        logToBeSaved =
          lastLogStatus === "enter" || lastLogStatus === "day start"
            ? "exit"
            : "enter";
      }
    } else if (args.logtype === "day end") {
      logToBeSaved = "day end";
    } else if (args.logtype === "break log") {
      if (
        !logDoc ||
        logDoc.logEntries.length === 0 ||
        logDoc.logEntries[logDoc.logEntries.length - 1].logStatus === "enter"
      ) {
        logToBeSaved = "exit";
      } else {
        logToBeSaved = "enter";
      }
    }

    if (logToBeSaved) {
      const newLogEntry = {
        uniqueId: crypto.randomUUID(),
        logStatus: logToBeSaved,
        logTime: args.customLogTime ?? Date.now(),
        createdAt: Date.now(),
      };

      if (logDoc) {
        const updatedEntries = [...logDoc.logEntries, newLogEntry];
        await ctx.db.patch(logDoc._id, {
          logEntries: updatedEntries,
          updatedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("logs", {
          userId,
          timeZone,
          logEntries: [newLogEntry],
          isHalfDay: false,
          updatedAt: Date.now(),
        });
      }
    }

    return {
      message,
      status: 200,
    };
  },
});
