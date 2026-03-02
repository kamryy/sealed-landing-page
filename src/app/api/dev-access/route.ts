import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const DEV_ACCESS_COOKIE = 'sealed-dev-access';

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password?.trim();
    const expectedPassword = process.env.DEV_ACCESS_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { error: 'DEV_ACCESS_PASSWORD is not configured' },
        { status: 500 }
      );
    }

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Access granted',
    });
    response.cookies.set({
      name: DEV_ACCESS_COOKIE,
      value: 'granted',
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error('Dev access submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: DEV_ACCESS_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 0,
  });

  return response;
}
