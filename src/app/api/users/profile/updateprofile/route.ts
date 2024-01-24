import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/dbConfig/dbConfig';

connect();

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const reqBody = await request.json();
    const { daily_work_required, log_type } = reqBody;

    // Update profile using Prisma
    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        daily_work_required: parseFloat(daily_work_required),
        log_type: log_type,
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
    if (error.name === 'TokenError') {
      return NextResponse.json({ TokenError: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
}
