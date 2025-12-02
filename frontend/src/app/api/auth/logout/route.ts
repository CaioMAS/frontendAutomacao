// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🚪 [API logout] Clearing session cookies');
    
    // Create a redirect response to the login page
    const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));

    // Delete all auth-related cookies
    response.cookies.delete('session');
    response.cookies.delete('idToken');
    response.cookies.delete('refreshToken');

    console.log('✅ [API logout] Cookies cleared, redirecting to login');
    return response;
  } catch (error) {
    console.error('❌ [API logout] Error:', error);
    return NextResponse.json({ message: 'Error logging out' }, { status: 500 });
  }
}
