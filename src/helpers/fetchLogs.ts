import prisma from '@/dbConfig/dbConfig';

export const fetchLogs = async (reqBody: any, userId: string) => {
  const { date } = reqBody;

  // Calculate start and end of the target day (default to today)
  let startOfDay = new Date();
  let endOfDay = new Date();

  startOfDay.setUTCHours(0, 0, 0, 0);
  endOfDay.setUTCHours(23, 59, 59, 999);

  if (date) {
    const parts = date.split('-');
    const correctedDate = `20${parts[2]}-${parts[1]}-${parts[0]}`;
    startOfDay = new Date(correctedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    endOfDay = new Date(correctedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);
  }

  // Fetch user data and log entries
  const [userData, logDoc] = await Promise.all([
    prisma.user.findFirst({
      where: { id: userId },
      select: { daily_work_required: true },
    }),
    prisma.log.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        logEntries: true,
      },
    }),
  ]);

  // Extract logs or set empty array if none found
  const logs =
    logDoc?.logEntries.map((entry) => ({
      id: entry.uniqueId,
      log_time: entry.log_time,
      log_status: entry.log_status,
    })) || [];

  // Initialize variables
  let breakTime = 0;
  let workDone = 0;
  let dayStart = 0;
  let dayEnd = 0;
  let currentBreakTime = null;
  let firstLog = null;
  let lastLog = null;
  let recentLog = null;
  let isDayStarted = false;
  let isDayEnded = false;

  // Process logs
  let logExit = 0,
    logEnter = 0;
  for (const log of logs) {
    if (log.log_status === 'day start') {
      isDayStarted = true;
      dayStart = log.log_time.getTime();
    } else if (log.log_status === 'day end') {
      isDayEnded = true;
      dayEnd = log.log_time.getTime();
    }

    if (log.log_status === 'exit') {
      logExit = log.log_time.getTime();
    } else if (log.log_status === 'enter') {
      logEnter = log.log_time.getTime();
    }

    if (logExit !== 0 && logEnter !== 0) {
      breakTime += logEnter - logExit;
      logExit = logEnter = 0;
    }
  }

  // First and last log statuses
  firstLog = logs.length > 0 ? logs[0].log_status : null;
  lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
  recentLog = lastLog?.log_status || null;

  // Calculate work done
  if (isDayStarted) {
    if (isDayEnded) {
      workDone = dayEnd - dayStart - breakTime;
    } else {
      const currentTime = Date.now();
      workDone = currentTime - dayStart - breakTime;

      if (lastLog && recentLog === 'exit') {
        const exitDuration = currentTime - lastLog.log_time.getTime();
        workDone -= exitDuration;
      }
    }
  }

  // Set current break time
  if (lastLog && recentLog === 'exit') {
    currentBreakTime = lastLog.log_time;
  }

  // Format time utility
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      '0',
    );
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formattedBreakTime = formatTime(breakTime);
  const formattedWorkDone = formatTime(workDone);

  // Calculate work left and end time
  let formattedWorkLeft = '';
  let formattedWorkEndTime = '';

  if (userData?.daily_work_required) {
    const workRequiredMs = userData.daily_work_required * 3600000;
    if (workDone < workRequiredMs) {
      formattedWorkLeft = formatTime(workRequiredMs - workDone);

      const [hours, minutes, seconds] = formattedWorkLeft
        .split(':')
        .map(Number);
      const endTime = new Date(
        Date.now() + (hours * 3600 + minutes * 60 + seconds) * 1000,
      );
      formattedWorkEndTime = endTime.toISOString();
    }
  }

  return {
    message: logs.length ? 'Logs fetched successfully' : 'No logs found',
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
    },
  };
};
