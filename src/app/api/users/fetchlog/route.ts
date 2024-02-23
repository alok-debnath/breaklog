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
    const { date } = reqBody;

    // Calculate the start of today in UTC time
    let startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    // Calculate the end of today in UTC time
    let endOfToday = new Date();
    endOfToday.setUTCHours(23, 59, 59, 999);

    if (date !== undefined) {
      const parts = date.split('-');
      const correctedDate = `20${parts[2]}-${parts[1]}-${parts[0]}`;
      startOfToday = new Date(correctedDate);
      startOfToday.setUTCHours(0, 0, 0, 0);

      // Calculate the end of the specific date in UTC time
      endOfToday = new Date(correctedDate);
      endOfToday.setUTCHours(23, 59, 59, 999);
    }

    // Fetch logs for the current day
    const logs = await prisma.log.findMany({
      where: {
        userId,
        updatedAt: {
          gte: startOfToday,
          lte: endOfToday,
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

    // Initialize variables
    let breakTime = 0;
    let workDone = 0;
    let logExit = 0;
    let logEnter = 0;
    let dayStart = 0;
    let dayEnd = 0;
    let isDayStarted = false;
    let isDayEnded = false;
    let currentBreakTime = null;
    let recentLog = null;

    // Process logs
    for (const log of logs) {
      if (log.log_status === 'day start') {
        isDayStarted = true;
        dayStart = log.updatedAt.getTime();
      } else if (log.log_status === 'day end') {
        isDayEnded = true;
        dayEnd = log.updatedAt.getTime();
      }

      // calculates break time
      if (log.log_status === 'exit') {
        logExit = log.updatedAt.getTime();
      } else if (log.log_status === 'enter') {
        logEnter = log.updatedAt.getTime();
      }
      if (logExit !== 0 && logEnter !== 0) {
        breakTime += logEnter - logExit;
        logExit = 0;
        logEnter = 0;
      }
    }

    // the most recent log
    const lastLog = logs[logs.length - 1];
    const firstLog = logs.length > 0 ? logs[0].log_status : null;

    // Calculate work done
    if (isDayStarted) {
      if (isDayEnded) {
        workDone = dayEnd - dayStart - breakTime;
      } else {
        const currDay = new Date();
        workDone = currDay.getTime() - dayStart - breakTime;

        if (lastLog.log_status === 'exit') {
          const exitTime = currDay.getTime() - lastLog.updatedAt.getTime();
          workDone = workDone - exitTime;
        }
      }
    }

    // Determine current break time and recent log status
    if (logs.length > 0) {
      if (lastLog.log_status === 'exit') {
        currentBreakTime = lastLog.updatedAt;
      }
      recentLog = lastLog.log_status;
    }

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
    };

    const formattedTime = formatTime(breakTime);
    const formattedWorkDone = formatTime(workDone);

    return NextResponse.json({
      message:
        logs.length === 0 ? 'No logs found' : 'Logs fetched successfully',
      status: logs.length === 0 ? 404 : 200,
      data: logs,
      workdata: {
        breakTime: formattedTime,
        workDone: formattedWorkDone,
        unformattedWorkDone: workDone,
        currentBreak: currentBreakTime,
        lastLogStatus: recentLog,
        firstLogStatus: firstLog,
      },
    });
  } catch (error: any) {
    if (error.name === 'TokenError') {
      return NextResponse.json({ TokenError: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
