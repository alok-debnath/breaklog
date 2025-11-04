import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const submitLog = mutation({
  args: {
    logtype: v.string(),
    date: v.optional(v.string()),
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
        dateObj.getDate(),
      ).getTime();
      endOfDay =
        new Date(
          dateObj.getFullYear(),
          dateObj.getMonth(),
          dateObj.getDate() + 1,
        ).getTime() - 1;
    } else {
      const now = new Date();
      startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ).getTime();
      endOfDay =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
        ).getTime() - 1;
    }

    // Find the log document for today
    const logDoc = await ctx.db
      .query("logs")
      .withIndex("userId_createdAt", (q) =>
        q
          .eq("userId", userId)
          .gte("createdAt", startOfDay)
          .lte("createdAt", endOfDay),
      )
      .first();

    let logToBeSaved = "";

    if (args.logtype === "undo log") {
      if (logDoc && logDoc.logEntries.length > 0) {
        const updatedEntries = logDoc.logEntries.slice(0, -1); // Remove last entry
        await ctx.db.patch(logDoc._id, {
          logEntries: updatedEntries,
          isHalfDay: false,
          updatedAt: Date.now(),
        });
      }
    } else if (args.logtype === "mark-as-half-day") {
      if (logDoc && logDoc.logEntries.length > 1) {
        const lastEntry = logDoc.logEntries[logDoc.logEntries.length - 1];
        if (lastEntry.logStatus === "day end") {
          await ctx.db.patch(logDoc._id, {
            isHalfDay: true,
            updatedAt: Date.now(),
          });
        }
      }
    } else if (args.logtype === "undo-half-day") {
      if (logDoc && logDoc.logEntries.length > 1) {
        const lastEntry = logDoc.logEntries[logDoc.logEntries.length - 1];
        if (lastEntry.logStatus === "day end") {
          await ctx.db.patch(logDoc._id, {
            isHalfDay: false,
            updatedAt: Date.now(),
          });
        }
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
        logTime: Date.now(),
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
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    }

    // Return the updated logs
    const updatedLogDoc = await ctx.db
      .query("logs")
      .withIndex("userId_createdAt", (q) =>
        q
          .eq("userId", userId)
          .gte("createdAt", startOfDay)
          .lte("createdAt", endOfDay),
      )
      .first();

    const logs =
      updatedLogDoc?.logEntries.map((entry) => ({
        id: entry.uniqueId,
        log_time: entry.logTime, // Use timestamp directly instead of Date object
        log_status: entry.logStatus,
      })) || [];

    // Calculate work data (similar to fetchLogs)
    let breakTime = 0;
    let workDone = 0;
    let dayStart = 0;
    let dayEnd = 0;
    let currentBreakTime: number | null = null;
    let firstLog = null;
    let lastLog = null;
    let recentLog = null;
    let isDayStarted = false;
    let isDayEnded = false;

    let logExit = 0,
      logEnter = 0;
    for (const log of logs) {
      const logTime = new Date(log.log_time); // Convert timestamp back to Date for calculations
      if (log.log_status === "day start") {
        isDayStarted = true;
        dayStart = logTime.getTime();
      } else if (log.log_status === "day end") {
        isDayEnded = true;
        dayEnd = logTime.getTime();
      }

      if (log.log_status === "exit") {
        logExit = logTime.getTime();
      } else if (log.log_status === "enter") {
        logEnter = logTime.getTime();
      }

      if (logExit !== 0 && logEnter !== 0) {
        breakTime += logEnter - logExit;
        logExit = logEnter = 0;
      }
    }

    firstLog = logs.length > 0 ? logs[0].log_status : null;
    lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
    recentLog = lastLog?.log_status || null;

    if (isDayStarted) {
      if (isDayEnded) {
        workDone = dayEnd - dayStart - breakTime;
      } else {
        const currentTime = Date.now();
        workDone = currentTime - dayStart - breakTime;

        if (lastLog && recentLog === "exit") {
          const exitDuration = currentTime - new Date(lastLog.log_time).getTime();
          workDone -= exitDuration;
        }
      }
    }

    if (lastLog && recentLog === "exit") {
      currentBreakTime = lastLog.log_time; // Use timestamp directly
    }

    const formatTime = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
        2,
        "0",
      );
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    };

    const formattedBreakTime = formatTime(breakTime);
    const formattedWorkDone = formatTime(workDone);

    let formattedWorkLeft = "";
    let formattedWorkEndTime = "";

    if (userProfile.dailyWorkRequired && workDone > 0) {
      const workRequiredMs = userProfile.dailyWorkRequired * 3600000;
      if (workDone < workRequiredMs) {
        formattedWorkLeft = formatTime(workRequiredMs - workDone);

        const [hours, minutes, seconds] = formattedWorkLeft
          .split(":")
          .map(Number);
        const endTime = new Date(
          Date.now() + (hours * 3600 + minutes * 60 + seconds) * 1000,
        );
        formattedWorkEndTime = endTime.toISOString();
      }
    }

    return {
      message: "Log submitted successfully",
      status: 200,
      data: logs,
      workdata: {
        breakTime: formattedBreakTime,
        workDone: formattedWorkDone,
        unformattedWorkDone: workDone,
        currentBreak: currentBreakTime,
        firstLogStatus: firstLog,
        lastLogStatus: recentLog,
        formattedWorkEndTime,
        formattedWorkLeft,
        calculatedOn: Date.now(),
        isHalfDay: updatedLogDoc?.isHalfDay || false,
      },
    };
  },
});
