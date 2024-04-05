// import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/dbConfig/dbConfig';

// connect();

export async function POST(request: NextRequest) {
  try {
    // Get user ID from token
    const userId = await getDataFromToken(request);
    const reqBody = await request.json();
    const { monthStart, monthEnd } = reqBody;

    // Fetch logs for the current day
    const logs = await prisma.log.findMany({
      where: {
        userId,
        updatedAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: {
        id: true,
        updatedAt: true,
        log_status: true,
      },
      orderBy: {
        updatedAt: 'asc',
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

    // Iterate through the 'logs' data and organize it by date
    logs.forEach((log: { updatedAt: Date }) => {
      // Get the date without the time
      const date = log.updatedAt.toISOString().split('T')[0];

      // If the date doesn't exist in 'logsByDate', create an array for it
      if (!logsByDate[date]) {
        logsByDate[date] = [];
      }

      // Push the log entry into the corresponding date's array
      logsByDate[date].push(log);
    });

    // Format time
    const formatTime = (milliseconds: number) => {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
        2,
        '0',
      );
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
      // return `${hours}:${minutes}`;
    };

    const dateMetrics = [];
    // Process logs
    for (const date in logsByDate) {
      if (logsByDate.hasOwnProperty(date)) {
        const logEntries = logsByDate[date];

        const startsWithDayStart =
          logEntries.length > 0 && logEntries[0].log_status === 'day start';
        const endsWithDayEnd =
          logEntries.length > 0 &&
          logEntries[logEntries.length - 1].log_status === 'day end';

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
            if (log.log_status === 'day start') {
              isDayStarted = true;
              dayStart = new Date(log.updatedAt).getTime();
            } else if (log.log_status === 'day end') {
              isDayEnded = true;
              dayEnd = new Date(log.updatedAt).getTime();
            }

            // Calculate break time
            if (log.log_status === 'exit') {
              const logExit = new Date(log.updatedAt).getTime();
              const nextLog = logEntries.find(
                (entry) =>
                  entry.updatedAt > log.updatedAt &&
                  entry.log_status === 'enter',
              );
              if (nextLog) {
                const logEnter = new Date(nextLog.updatedAt).getTime();
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
              if (lastLog.log_status === 'exit') {
                const exitTime =
                  currDay.getTime() - new Date(lastLog.updatedAt).getTime();
                workDone = workDone - exitTime;
              }
            }

            // Format time and push the date and metrics into the 'dateMetrics' array
            const formattedBreakTime = formatTime(breakTime);
            const formattedWorkDone = formatTime(workDone);

            const parsedDate = new Date(date);
            const day = String(parsedDate.getDate()).padStart(2, '0');
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const year = parsedDate.getFullYear().toString().slice(-2);
            const formattedDate = `${day}-${month}-${year}`;
            dateMetrics.push({
              date: formattedDate,
              breakTime: breakTime,
              workDone: workDone,
              formattedBreakTime: formattedBreakTime,
              formattedWorkDone: formattedWorkDone,
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
      let numberOfDays = dateMetrics.length;

      // Iterate through the data to calculate totals.
      for (const metrics of dateMetrics) {
        totalBreakTime += metrics.breakTime;
        totalWorkDone += metrics.workDone;
      }

      // Calculate the expected work hours.
      const expectedWorkHours = (user?.daily_work_required ?? 0) * numberOfDays;

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
        // actualWorkHours: (totalWorkDone / 3600000).toFixed(2),
      };
    }

    return NextResponse.json({
      message: 'Logs fetched successfully',
      status: dateMetrics.length === 0 ? 'No fullday logs found' : 200,
      data: dateMetrics.length === 0 ? '' : dateMetrics,
      summary: summary,
      // workdata: {
      //   breakTime: formattedTime,
      //   workDone: formattedWorkDone,
      //   currentBreak: currentBreakTime,
      //   lastLogStatus: recentLog,
      //   firstLogStatus: firstLog,
      // },
    });
  } catch (error: any) {
    if (error.name === 'TokenError') {
      return NextResponse.json({ TokenError: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
