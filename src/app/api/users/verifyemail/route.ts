import { connect } from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;

    const user = await prisma.user.findFirst({
      where: {
        verify_token: token,
        verify_token_expiry: {
          gt: new Date(),
        },
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }
    console.log(user);

    // Update user properties
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verify_token: null,
        verify_token_expiry: null,
      },
    });
    return NextResponse.json({ message: 'Email verified', success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
