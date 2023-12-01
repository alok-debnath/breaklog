import { connect } from '@/dbConfig/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/dbConfig/dbConfig';

connect();

export async function POST(request: NextRequest) {
  try {
    // Get user ID from token
    const userId = await getDataFromToken(request);

    const reqBody = await request.json();
    const { log_id } = reqBody;
    const time = '';

    // Update log
    // const logs = await prisma.log.update({
    //   where: {
    //     id: log_id,
    //   },
    //   data: { createdAt: time },
    // });

    return NextResponse.json({
      // message: logs.length === 0 ? 'No logs found' : 'Logs fetched successfully',
      // status: logs.length === 0 ? 404 : 200,
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
