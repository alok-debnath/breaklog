// signup route (fixed)
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, username, password } = reqBody;

    // Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: {
        email: true,
        username: true,
      },
    });

    if (existingUser) {
      const conflicts = [];
      if (existingUser.email === email) conflicts.push('email');
      if (existingUser.username === username) conflicts.push('username');

      const errorMessage =
        conflicts.length === 2
          ? 'email and username already exist'
          : `${conflicts[0]} already exists`;

      return NextResponse.json(
        { error: errorMessage, focusOn: conflicts },
        { status: 400 },
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create user and account (transaction for safety)
    const newUserWithAccount = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          username,
          password: hashedPassword, // Now including the hashed password here
        },
      });

      await tx.account.create({
        data: {
          userId: user.id,
          provider: 'credentials', // Set provider to 'credentials' for this case
          providerAccountId: email, // Using email as provider account ID
          access_token: hashedPassword, // Store hashed password as access token
          type: 'credentials', // The 'type' field is required
        },
      });

      return user;
    });

    return NextResponse.json({
      message: 'User created successfully',
      success: true,
      data: newUserWithAccount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
