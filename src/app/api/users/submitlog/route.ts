import { getDataFromToken } from '@/helpers/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/dbConfig/dbConfig';
import { fetchLogs } from '@/helpers/fetchLogs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const reqBody = await request.json();
    const { logtype } = reqBody;

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    // Find the log document for today
    let logDoc = await prisma.log.findFirst({
      where: {
        userId: userId,
        createdAt: {
          gte: startOfToday,
        },
      },
    });

    let logToBeSaved = '';
    if (logtype === 'undo log') {
      if (logDoc && logDoc.logEntries.length > 0) {
        const lastEntry = logDoc.logEntries.pop(); // Remove the last log entry
        await prisma.log.update({
          where: { id: logDoc.id },
          data: { logEntries: logDoc.logEntries },
        });
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
            logEntries: [newLogEntry],
            isHalfDay: false,
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
