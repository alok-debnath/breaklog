import { fetchLogs } from '@/helpers/fetchLogs';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromSession } from '@/lib/authHelpers';

export async function POST(request: NextRequest) {
  try {
    // Get user ID from session
    const userId = await getUserIdFromSession();
    const reqBody = await request.json();
    const fetchedLog = await fetchLogs(reqBody, userId);

    return NextResponse.json({
      ...fetchedLog,
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
