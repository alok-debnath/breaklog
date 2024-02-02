import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = NextResponse.json({
      message: 'Logged successfully',
      success: true,
    });
    
    // Set cache control header to 'no-store'
    response.headers.set('Cache-Control', 'no-store');

    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
