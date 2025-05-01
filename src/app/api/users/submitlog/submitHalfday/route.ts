import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"
import { fetchLogs } from '@/helpers/fetchLogs';
import getStartAndEndOfDay from '@/helpers/getStartAndEndOfDay';
import { DateTime } from 'luxon';
import { getUserIdFromSession } from '@/lib/authHelpers';

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    const reqBody = await request.json();
    const { logtype, date } = reqBody;

    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        default_time_zone: true,
      },
    });

    let [startOfDay, endOfDay, timeZone] = getStartAndEndOfDay(user);

    if (date) {
      const parts = date.split('-');
      const correctedDate = `20${parts[2]}-${parts[1]}-${parts[0]}`;
      const dateObj = DateTime.fromISO(correctedDate, { zone: timeZone });
      startOfDay = dateObj.startOf('day').toJSDate();
      endOfDay = dateObj.endOf('day').toJSDate();
    }

    const logDoc = await prisma.log.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (logtype === 'mark-as-half-day') {
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

    const fetchedLog = await fetchLogs(reqBody, userId);

    return NextResponse.json({
      message: 'Log submitted successfully',
      fetchedLog,
    });
  } catch (error: any) {
    if (error.name === 'SessionError') {
      return NextResponse.json({ SessionError: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
