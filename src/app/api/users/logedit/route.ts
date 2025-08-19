import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchLogs } from '@/helpers/fetchLogs';
import { getUserIdFromSession } from '@/lib/authHelpers';

export async function POST(request: NextRequest) {
  try {
    // Get user ID from session
    const userId = await getUserIdFromSession();

    const reqBody = await request.json();
    const { log_id, log_dateTime } = reqBody;

    // Find the existing log for the user (single document with multiple entries)
    const existingLog = await prisma.log.findFirst({
      where: {
        userId: userId,
        logEntries: {
          some: {
            uniqueId: log_id,
          },
        },
      },
    });

    if (!existingLog) {
      return NextResponse.json({
        message: 'No matching log entry found',
        status: 404,
      });
    }

    // Update the specific log entry within the composite type array
    const updatedLog = await prisma.log.update({
      where: { id: existingLog.id },
      data: {
        logEntries: {
          updateMany: {
            where: { uniqueId: log_id },
            data: { log_time: log_dateTime },
          },
        },
      },
    });

    // Fetch updated logs
    const fetchedLog = await fetchLogs(reqBody, userId);

    return NextResponse.json({
      message: 'Log updated successfully',
      fetchedLog,
    });
  } catch (error: any) {
    if (error.name === 'SessionError') {
      return NextResponse.json(
        { SessionError: error.message },
        { status: 400 },
      );
    } else {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
