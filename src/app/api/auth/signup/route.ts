import { connect } from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import prisma from '@/dbConfig/dbConfig';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, username, password } = reqBody;

    // check if user exists
    let user: string[] = [];

    const emailCheck = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    const usernameCheck = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (emailCheck) {
      user.push('email');
    }

    if (usernameCheck) {
      user.push('username');
    }

    if (user.length > 0) {
      let errorMessage = '';
      if (user.length === 2) {
        errorMessage += 'email and username already exists';
      } else {
        errorMessage += `${user[0]} already exists`;
      }

      return NextResponse.json(
        { error: errorMessage, focusOn: user },
        { status: 400 },
      );
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
