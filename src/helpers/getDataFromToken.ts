import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get('token')?.value || '';
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    return decodedToken.id;
  } catch (error: any) {
    cookies().set('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    const tokenError = new Error(error.message);
    tokenError.name = 'TokenError';

    throw tokenError;
  }
};
