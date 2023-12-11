import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get('token')?.value || '';
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    return decodedToken.id;
  } catch (error: any) {
    if (error.message === 'invalid token') {
      cookies().set('token', '', {
        httpOnly: true,
        expires: new Date(0),
      });
    }
    throw new Error(error.message);
  }
};
