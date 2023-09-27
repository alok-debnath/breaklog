import { connect } from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, username, password } = reqBody;

    // check if user exists
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });
    console.log(user);
    if (user) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // save user to DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: 'User created successfully',
      success: true,
      newUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
