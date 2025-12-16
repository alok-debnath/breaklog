import { v } from "convex/values";
import { query } from "../_generated/server";

export const fetchLogs = query({
  args: {
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { error: "unauthorized" };

    const userId = identity.subject;

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    let startOfDay: number;
    let endOfDay: number;
    const timeZone = userProfile?.defaultTimeZone || "Etc/GMT";

    if (args.date) {
      // Parse date in DD-MM-YY format
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
      // Current day
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

    const logDoc = await ctx.db
      .query("logs")
      .withIndex("userId_creationTime", (q) =>
        q
          .eq("userId", userId)
          .gte("_creationTime", startOfDay)
          .lte("_creationTime", endOfDay),
      )
      .first();

    const logs =
      logDoc?.logEntries.map((entry) => ({
        id: entry.uniqueId,
        log_time: entry.logTime, // Use timestamp directly instead of Date object
        log_status: entry.logStatus,
      })) || [];

    // Calculate work data (similar to the original logic)
    let breakTime = 0;
    let workDone = 0;
    let dayStart = 0;
    let dayEnd = 0;
    let currentBreakTime: number | null = null;
    let firstLog = null;
    let lastLog = null;
    let recentLog = "";
    let isDayStarted = false;
    let isDayEnded = false;

    let logExit = 0,
      logEnter = 0;
    for (const log of logs) {
      if (log.log_status === "day start") {
        isDayStarted = true;
        dayStart = log.log_time; // Already a timestamp
      } else if (log.log_status === "day end") {
        isDayEnded = true;
        dayEnd = log.log_time; // Already a timestamp
      }

      if (log.log_status === "exit") {
        logExit = log.log_time; // Already a timestamp
      } else if (log.log_status === "enter") {
        logEnter = log.log_time; // Already a timestamp
      }

      if (logExit !== 0 && logEnter !== 0) {
        breakTime += logEnter - logExit;
        logExit = logEnter = 0;
      }
    }

    firstLog = logs.length > 0 ? logs[0].log_status : null;
    lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
    recentLog = lastLog?.log_status || "";

    if (isDayStarted) {
      if (isDayEnded) {
        workDone = dayEnd - dayStart - breakTime;
      } else {
        const currentTime = Date.now();
        workDone = currentTime - dayStart - breakTime;

        if (lastLog && recentLog === "exit") {
          const exitDuration = currentTime - lastLog.log_time; // Already a timestamp
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

    if (userProfile?.dailyWorkRequired && workDone > 0) {
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
      message: logs.length ? "Logs fetched successfully" : "No logs found",
      status: logs.length ? 200 : 404,
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
        isHalfDay: logDoc?.isHalfDay || false,
      },
    };
  },
});

export const fetchMonthlyLogs = query({
  args: {
    monthStart: v.string(),
    monthEnd: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    if (!args.monthStart || !args.monthEnd) return;

    const userId = identity.subject;

    const userProfile = await ctx.db
      .query("userProfiles")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .first();

    const timeZone = userProfile?.defaultTimeZone || "Etc/GMT";
    const dailyWorkRequired = userProfile?.dailyWorkRequired || 8;

    // Parse dates
    const startDate = new Date(args.monthStart);
    const endDate = new Date(args.monthEnd);

    // Get all logs in the month based on log document _creationTime
    const logs = await ctx.db
      .query("logs")
      .withIndex("userId_creationTime", (q) =>
        q
          .eq("userId", userId)
          .gte("_creationTime", startDate.getTime())
          .lte("_creationTime", endDate.getTime()),
      )
      .collect();

    // Initialize an object to store logs by date from logEntries
    const logsByDate: Record<
      string,
      Array<{
        uniqueId: string;
        logStatus: string;
        logTime: number;
        createdAt: number;
        isHalfDay: boolean;
      }>
    > = {};

    // Organize logs by date from logEntries
    logs.forEach((log) => {
      log.logEntries.forEach((entry) => {
        const date = new Date(entry.logTime).toISOString().split("T")[0];

        if (!logsByDate[date]) {
          logsByDate[date] = [];
        }

        logsByDate[date].push({
          ...entry,
          isHalfDay: log.isHalfDay, // Include half-day status from main log
        });
      });
    });

    // Sort logEntries by log_time for each date
    for (const date in logsByDate) {
      logsByDate[date].sort((a, b) => a.logTime - b.logTime);
    }

    // Format time helper function
    const formatTime = (milliseconds: number) => {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
        2,
        "0",
      );
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    };

    const dateMetrics = [];
    let halfDayCount = 0;

    // Process logs to calculate work and break time (only complete days)
    for (const date in logsByDate) {
      const logEntries = logsByDate[date];

      const startsWithDayStart =
        logEntries.length > 0 && logEntries[0].logStatus === "day start";
      const endsWithDayEnd =
        logEntries.length > 0 &&
        logEntries[logEntries.length - 1].logStatus === "day end";

      if (startsWithDayStart && endsWithDayEnd) {
        // Initialize variables for each date
        let breakTime = 0;
        let workDone = 0;
        let isDayStarted = false;
        let isDayEnded = false;
        let dayStart = 0;
        let dayEnd = 0;

        // Process log entries for this date
        for (const log of logEntries) {
          if (log.logStatus === "day start") {
            isDayStarted = true;
            dayStart = log.logTime;
          } else if (log.logStatus === "day end") {
            isDayEnded = true;
            dayEnd = log.logTime;
          }

          // Calculate break time - find next "enter" after each "exit"
          if (log.logStatus === "exit") {
            const logExit = log.logTime;
            const nextLog = logEntries.find(
              (entry) =>
                entry.logTime > log.logTime && entry.logStatus === "enter",
            );
            if (nextLog) {
              const logEnter = nextLog.logTime;
              breakTime += logEnter - logExit;
            }
          }
        }

        // Calculate work done for this date
        if (isDayStarted && isDayEnded) {
          workDone = dayEnd - dayStart - breakTime;

          // Format time and create date string
          const formattedBreakTime = formatTime(breakTime);
          const formattedWorkDone = formatTime(workDone);

          const parsedDate = new Date(date);
          const day = String(parsedDate.getDate()).padStart(2, "0");
          const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
          const year = parsedDate.getFullYear().toString().slice(-2);
          const formattedDate = `${day}-${month}-${year}`;

          // Check if any log for this date is marked as half-day
          const isHalfDay = logEntries.some((entry) => entry.isHalfDay);

          if (isHalfDay) {
            halfDayCount++;
          }

          dateMetrics.push({
            date: formattedDate,
            breakTime: breakTime,
            workDone: workDone,
            formattedBreakTime: formattedBreakTime,
            formattedWorkDone: formattedWorkDone,
            isHalfDay: isHalfDay,
          });
        }
      }
    }

    // Calculate summary
    const summary = {};
    if (dateMetrics.length > 0) {
      // Initialize variables to store the totals and count.
      let totalBreakTime = 0;
      let totalWorkDone = 0;
      const numberOfDays = dateMetrics.length;

      // Iterate through the data to calculate totals.
      for (const metrics of dateMetrics) {
        totalBreakTime += metrics.breakTime;
        totalWorkDone += metrics.workDone;
      }

      // Calculate the expected work hours accounting for half-days
      const expectedWorkHours =
        dailyWorkRequired * numberOfDays -
        (dailyWorkRequired / 2) * halfDayCount;

      // Format the total break time and total work done.
      const formattedTotalBreakTime = formatTime(totalBreakTime);
      const formattedTotalWorkDone = formatTime(totalWorkDone);

      // Store the formatted totals, number of days, and expected vs. actual work.
      Object.assign(summary, {
        totalWorkDone,
        formattedTotalBreakTime,
        formattedTotalWorkDone,
        numberOfDays,
        expectedWorkHours,
        halfDayCount,
        monthStart: args.monthStart,
        monthEnd: args.monthEnd,
      });
    }

    return {
      message:
        dateMetrics.length === 0
          ? "No fullday logs found"
          : "Logs fetched successfully",
      status: dateMetrics.length === 0 ? 404 : 200,
      data: dateMetrics,
      summary: summary,
    };
  },
});
