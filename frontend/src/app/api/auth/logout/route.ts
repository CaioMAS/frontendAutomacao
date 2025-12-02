// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response object to set cookies on
    const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });

    // Deleting cookies by setting them with an expired date is a common pattern,
    // but Next.js provides a helper for this.
    response.cookies.delete('idToken');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Error logging out' }, { status: 500 });
  }
}
