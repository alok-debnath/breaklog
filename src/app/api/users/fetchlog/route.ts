import { fetchLogs } from '@/helpers/fetchLogs';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get user ID from token
    const userId = session.user.id;
    const reqBody = await request.json();
    const fetchedLog = await fetchLogs(reqBody, userId);

    return NextResponse.json({
      ...fetchedLog,
    });
  } catch (error: any) {
    if (error.name === 'SessionError') {
      return NextResponse.json({ SessionError: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
