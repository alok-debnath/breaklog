import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma"
import { getUserIdFromSession } from '@/lib/authHelpers';

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession();

    const reqBody = await request.json();
    const { daily_work_required, log_type, default_time_zone } = reqBody;

    // Update profile using Prisma
    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        daily_work_required: parseFloat(daily_work_required),
        log_type: log_type,
        default_time_zone: default_time_zone,
      },
    });

    if (!result) {
      return NextResponse.json({
        message: 'No user found',
        status: 404,
      });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      status: 200,
    });
  } catch (error: any) {
    if (error.name === 'SessionError') {
      return NextResponse.json({ SessionError: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
