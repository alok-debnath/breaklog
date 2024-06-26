// import { connect } from '@/dbConfig/dbConfig';
import prisma from '@/dbConfig/dbConfig';
import { NextRequest } from 'next/server';

// connect();

export const fetchLogs = async (reqBody: any, userId: string) => {
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

  const userData = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      daily_work_required: true,
    },
  });

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
  let formattedWorkEndTime =
    (userData?.daily_work_required ?? 0) * 3600000 - workDone > 0 &&
    workDone &&
    recentLog !== 'day end'
      ? formatTime((userData?.daily_work_required ?? 0) * 3600000 - workDone)
      : '';
  const formattedWorkLeft = formattedWorkEndTime;

  // for formattedWorkEndTime
  if (formattedWorkEndTime !== '') {
    const [hours, minutes, seconds] = formattedWorkEndTime
      .split(':')
      .map(Number);
    const currentTime = new Date();
    const updatedTime = new Date(
      currentTime.getTime() + (hours * 3600 + minutes * 60 + seconds) * 1000,
    );
    formattedWorkEndTime = updatedTime.toISOString();
  }
  //

  return {
    message: logs.length === 0 ? 'No logs found' : 'Logs fetched successfully',
    status: logs.length === 0 ? 404 : 200,
    data: logs,
    workdata: {
      breakTime: formattedTime,
      workDone: formattedWorkDone,
      unformattedWorkDone: workDone,
      currentBreak: currentBreakTime,
      firstLogStatus: firstLog,
      lastLogStatus: recentLog,
      formattedWorkEndTime: formattedWorkEndTime,
      formattedWorkLeft: formattedWorkLeft,
    },
  };
};
