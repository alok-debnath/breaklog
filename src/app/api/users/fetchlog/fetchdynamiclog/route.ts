import { type NextRequest, NextResponse } from "next/server";
import { getUserIdFromSession } from "@/lib/authHelpers";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get user ID from session
    const userId = await getUserIdFromSession();
    const reqBody = await request.json();
    const { monthStart, monthEnd } = reqBody;

    // Fetch logs based on the createdAt field of the main Log document
    const logs = await prisma.log.findMany({
      where: {
        userId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: {
        id: true,
        createdAt: true,
        isHalfDay: true,
        logEntries: {
          select: {
            log_status: true,
            log_time: true,
          },
        },
      },
    });

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        daily_work_required: true,
      },
    });

    // Initialize an object to store logs by date
    const logsByDate: { [date: string]: any[] } = {};

    // Organize logs by date from logEntries
    logs.forEach((log) => {
      log.logEntries.forEach((entry) => {
        const date = entry.log_time.toISOString().split("T")[0];

        if (!logsByDate[date]) {
          logsByDate[date] = [];
        }

        logsByDate[date].push(entry);
      });
    });

    // Sort logEntries by log_time for each date
    for (const date in logsByDate) {
      if (Object.hasOwn(logsByDate, date)) {
        logsByDate[date].sort(
          (a, b) =>
            new Date(a.log_time).getTime() - new Date(b.log_time).getTime(),
        );
      }
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

    // Process logs to calculate work and break time
    for (const date in logsByDate) {
      if (Object.hasOwn(logsByDate, date)) {
        const logEntries = logsByDate[date];

        const startsWithDayStart =
          logEntries.length > 0 && logEntries[0].log_status === "day start";
        const endsWithDayEnd =
          logEntries.length > 0 &&
          logEntries[logEntries.length - 1].log_status === "day end";

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
            if (log.log_status === "day start") {
              isDayStarted = true;
              dayStart = new Date(log.log_time).getTime();
            } else if (log.log_status === "day end") {
              isDayEnded = true;
              dayEnd = new Date(log.log_time).getTime();
            }

            // Calculate break time
            if (log.log_status === "exit") {
              const logExit = new Date(log.log_time).getTime();
              const nextLog = logEntries.find(
                (entry) =>
                  entry.log_time > log.log_time && entry.log_status === "enter",
              );
              if (nextLog) {
                const logEnter = new Date(nextLog.log_time).getTime();
                breakTime += logEnter - logExit;
              }
            }
          }

          // Calculate work done for this date
          if (isDayStarted) {
            if (isDayEnded) {
              workDone = dayEnd - dayStart - breakTime;
            } else {
              const currDay = new Date();
              workDone = currDay.getTime() - dayStart - breakTime;

              const lastLog = logEntries[logEntries.length - 1];
              if (lastLog.log_status === "exit") {
                const exitTime =
                  currDay.getTime() - new Date(lastLog.log_time).getTime();
                workDone = workDone - exitTime;
              }
            }

            // Format time and push the date and metrics into the 'dateMetrics' array
            const formattedBreakTime = formatTime(breakTime);
            const formattedWorkDone = formatTime(workDone);

            const parsedDate = new Date(date);
            const day = String(parsedDate.getDate()).padStart(2, "0");
            const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
            const year = parsedDate.getFullYear().toString().slice(-2);
            const formattedDate = `${day}-${month}-${year}`;

            // Check if the log is marked as half-day
            const isHalfDay = logs.some(
              (log) =>
                log.isHalfDay &&
                log.createdAt.toISOString().split("T")[0] === date,
            );

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
    }

    // Initialize the summary object.
    let summary = {};
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

      // Calculate the expected work hours.
      const expectedWorkHours =
        (user?.daily_work_required ?? 0) * numberOfDays -
        ((user?.daily_work_required ?? 0) / 2) * halfDayCount;

      // Format the total break time and total work done.
      const formattedTotalBreakTime = formatTime(totalBreakTime);
      const formattedTotalWorkDone = formatTime(totalWorkDone);

      // Store the formatted totals, number of days, and expected vs. actual work.
      summary = {
        totalWorkDone,
        formattedTotalBreakTime,
        formattedTotalWorkDone,
        numberOfDays,
        expectedWorkHours,
        halfDayCount,
      };
    }

    return NextResponse.json({
      message: "Logs fetched successfully",
      status: dateMetrics.length === 0 ? "No fullday logs found" : 200,
      data: dateMetrics.length === 0 ? "" : dateMetrics,
      summary: summary,
    });
  } catch (error: any) {
    if (error.name === "SessionError") {
      return NextResponse.json(
        { SessionError: error.message },
        { status: 400 },
      );
    } else {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
