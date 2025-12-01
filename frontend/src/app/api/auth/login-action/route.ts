// src/app/api/auth/login-action/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { AuthResponse } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      // Redirect back to login with an error message
      return NextResponse.redirect(new URL('/?error=Missing email or password', request.url));
    }

    // 1. Call the external login API
    const loginResponse = await axios.post<AuthResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      email,
      password,
      returnSecureToken: true,
    });

    const { idToken, refreshToken } = loginResponse.data;

    if (!idToken || !refreshToken) {
      // Redirect back to login with an error message
      return NextResponse.redirect(new URL('/?error=Login failed, no tokens received', request.url));
    }

    // 2. Create a redirect response to the target page
    const redirectUrl = new URL('/config-user', request.url);
    const response = NextResponse.redirect(redirectUrl);

    // 3. Set the cookies on the redirect response
    response.cookies.set('idToken', idToken, {
      httpOnly: true, // Let's make it HttpOnly again for security
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
    // Redirect back to login with a generic error
    const errorMessage = error.response?.data?.error?.message || 'Login failed';
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(errorMessage)}`, request.url));
  }
}
