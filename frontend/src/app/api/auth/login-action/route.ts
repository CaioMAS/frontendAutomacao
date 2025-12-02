// src/app/api/auth/login-action/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { AuthResponse } from '@/types/auth';

export async function POST(request: Request) {
  try {
    // 1. Read the request body as JSON
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
    }

    // 2. Call the external login API
    const loginResponse = await axios.post<AuthResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      email,
      password,
      returnSecureToken: true,
    });

    const { idToken, refreshToken } = loginResponse.data;

    if (!idToken || !refreshToken) {
      return NextResponse.json({ message: 'Login failed, no tokens received' }, { status: 401 });
    }

    // 3. Create a success response
    const response = NextResponse.json({ status: 'success' }, { status: 200 });

    // 4. Set the cookies on the success response
    response.cookies.set('idToken', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'lax',
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'lax',
    });

    return response;

  } catch (error: any) {
    console.error('Login action error:', error);
    const message = error.response?.data?.error?.message || 'Login failed';
    return NextResponse.json({ message }, { status: error.response?.status || 500 });
  }
}
