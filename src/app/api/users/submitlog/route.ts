import { getDataFromToken } from '@/helpers/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/dbConfig/dbConfig';
import { fetchLogs } from '@/helpers/fetchLogs';
import { v4 as uuidv4 } from 'uuid';
import getStartAndEndOfDay from '@/helpers/getStartAndEndOfDay';

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const reqBody = await request.json();
    const { logtype } = reqBody;

    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        default_time_zone: true,
      },
    });

    const [startOfDay, endOfDay, timeZone] = getStartAndEndOfDay(user);

    // Find the log document for today
    let logDoc = await prisma.log.findFirst({
      where: {
        userId: userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    let logToBeSaved = '';
    if (logtype === 'undo log') {
      if (logDoc && logDoc.logEntries.length > 0) {
        const lastEntry = logDoc.logEntries.pop(); // Remove the last log entry
        await prisma.log.update({
          where: { id: logDoc.id },
          data: { logEntries: logDoc.logEntries, isHalfDay: false },
        });
      }
    } else if (logtype === 'mark-as-half-day') {
      if (logDoc && logDoc.logEntries.length > 1) {
        const lastEntry = logDoc.logEntries[logDoc.logEntries.length - 1];
        if (lastEntry.log_status === 'day end') {
          await prisma.log.update({
            where: { id: logDoc.id },
            data: { isHalfDay: true },
          });
        }
      }
    } else if (logtype === 'undo-half-day') {
      if (logDoc && logDoc.logEntries.length > 1) {
        const lastEntry = logDoc.logEntries[logDoc.logEntries.length - 1];
        if (lastEntry.log_status === 'day end') {
          await prisma.log.update({
            where: { id: logDoc.id },
            data: { isHalfDay: false },
          });
        }
      }
    }

    if (logtype === 'day log') {
      if (!logDoc || logDoc.logEntries.length === 0) {
        logToBeSaved = 'day start';
      } else {
        const lastLogStatus =
          logDoc.logEntries[logDoc.logEntries.length - 1].log_status;
        logToBeSaved =
          lastLogStatus === 'enter' || lastLogStatus === 'day start'
            ? 'exit'
            : 'enter';
      }
    } else if (logtype === 'day end') {
      logToBeSaved = 'day end';
    } else if (logtype === 'break log') {
      if (
        !logDoc ||
        logDoc.logEntries.length === 0 ||
        logDoc.logEntries[logDoc.logEntries.length - 1].log_status === 'enter'
      ) {
        logToBeSaved = 'exit';
      } else {
        logToBeSaved = 'enter';
      }
    }

    if (logToBeSaved) {
      const newLogEntry = {
        uniqueId: uuidv4(), // Generate a unique ID for the log entry
        log_status: logToBeSaved,
        log_time: new Date(),
        createdAt: new Date(),
      };

      if (logDoc) {
        await prisma.log.update({
          where: { id: logDoc.id },
          data: {
            logEntries: {
              push: newLogEntry, // Append the new log entry
            },
          },
        });
      } else {
        await prisma.log.create({
          data: {
            userId: userId,
            timeZone: timeZone,
            logEntries: [newLogEntry],
          },
        });
      }
    }

    const fetchedLog = await fetchLogs(reqBody, userId);

    return NextResponse.json({
      message: 'Log submitted successfully',
      fetchedLog,
    });
  } catch (error: any) {
    if (error.name === 'TokenError') {
      return NextResponse.json({ TokenError: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
