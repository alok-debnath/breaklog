import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/dbConfig/dbConfig';

connect();

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
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      select: {
        id: true,
        createdAt: true,
        log_status: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Initialize an object to store logs by date
    const logsByDate: { [date: string]: any[] } = {};

    // Iterate through the 'logs' data and organize it by date
    logs.forEach((log) => {
      // Get the date without the time
      const date = log.createdAt.toISOString().split('T')[0];

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
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    const dateMetrics = [];
    // Process logs
    for (const date in logsByDate) {
      if (logsByDate.hasOwnProperty(date)) {
        const logEntries = logsByDate[date];

        const startsWithDayStart =
          logEntries.length > 0 && logEntries[0].log_status === 'day start';
        const endsWithDayEnd =
          logEntries.length > 0 && logEntries[logEntries.length - 1].log_status === 'day end';

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
              dayStart = new Date(log.createdAt).getTime();
            } else if (log.log_status === 'day end') {
              isDayEnded = true;
              dayEnd = new Date(log.createdAt).getTime();
            }

            // Calculate break time
            if (log.log_status === 'exit') {
              const logExit = new Date(log.createdAt).getTime();
              const nextLog = logEntries.find(
                (entry) => entry.createdAt > log.createdAt && entry.log_status === 'enter'
              );
              if (nextLog) {
                const logEnter = new Date(nextLog.createdAt).getTime();
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
                const exitTime = currDay.getTime() - new Date(lastLog.createdAt).getTime();
                workDone = workDone - exitTime;
              }
            }

            // Format time and push the date and metrics into the 'dateMetrics' array
            const formattedBreakTime = formatTime(breakTime);
            const formattedWorkDone = formatTime(workDone);

            dateMetrics.push({
              date,
              breakTime: breakTime,
              workDone: workDone,
              formattedBreakTime: formattedBreakTime,
              formattedWorkDone: formattedWorkDone,
            });
          }
        }
      }
    }

    return NextResponse.json({
      message: 'Logs fetched successfully',
      status: logs.length === 0 ? 'No logs found' : 200,
      data: logs.length === 0 ? 'No logs found' : dateMetrics,
      // workdata: {
      //   breakTime: formattedTime,
      //   workDone: formattedWorkDone,
      //   currentBreak: currentBreakTime,
      //   lastLogStatus: recentLog,
      //   firstLogStatus: firstLog,
      // },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
