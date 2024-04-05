// import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/dbConfig/dbConfig';

// connect();

export async function POST(request: NextRequest) {
  try {
    // Get user ID from token
    const userId = await getDataFromToken(request);

    const reqBody = await request.json();
    const { log_id, log_dateTime } = reqBody;

    // Update log using Prisma
    const result = await prisma.log.update({
      where: {
        id: log_id,
        userId: userId,
      },
      data: {
        updatedAt: log_dateTime,
      },
    });

    if (!result) {
      return NextResponse.json({
        message: 'No matching log found',
        status: 404,
      });
    }

    return NextResponse.json({
      message: 'Log updated successfully',
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
