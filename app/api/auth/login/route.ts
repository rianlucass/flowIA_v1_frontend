import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_COOKIE = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'flowia-token';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const upstream = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await upstream.json();

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  const { token, ...userInfo } = data as { token: string; [key: string]: unknown };

  const response = NextResponse.json(userInfo, { status: 200 });

  // Token stored in httpOnly cookie — inaccessible to JavaScript
  response.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days — matches API token validity
  });

  return response;
}
