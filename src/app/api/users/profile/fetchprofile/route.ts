import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"
import { getUserIdFromSession } from '@/lib/authHelpers';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        daily_work_required: true,
        log_type: true,
        default_time_zone: true,
      },
    });
    return NextResponse.json({
      message: 'User found',
      data: user,
    });
  } catch (error: any) {
    if (error.name === 'SessionError') {
      return NextResponse.json({ SessionError: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
