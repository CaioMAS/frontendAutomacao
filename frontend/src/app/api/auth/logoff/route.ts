import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    console.log('🚪 [API logoff] Attempting logoff');

    if (!sessionCookie) {
      console.log('⚠️ [API logoff] No session cookie found');
      // Still clear cookies and redirect even if no session
      const response = NextResponse.json({ message: 'No active session' }, { status: 200 });
      response.cookies.delete('session');
      response.cookies.delete('idToken');
      response.cookies.delete('refreshToken');
      return response;
    }

    // Call backend logoff endpoint
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logoff`;
    console.log('📡 [API logoff] Calling backend:', backendUrl);

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Cookie': `session=${sessionCookie}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 [API logoff] Backend response status:', backendResponse.status);

    // Create response
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Clear all auth cookies
    response.cookies.delete('session');
    response.cookies.delete('idToken');
    response.cookies.delete('refreshToken');

    console.log('✅ [API logoff] Cookies cleared');
    return response;
  } catch (error) {
    console.error('❌ [API logoff] Exception:', error);
    
    // Even on error, clear cookies
    const response = NextResponse.json(
      { message: 'Logout completed with errors' },
      { status: 200 }
    );
    response.cookies.delete('session');
    response.cookies.delete('idToken');
    response.cookies.delete('refreshToken');
    
    return response;
  }
}

// GET handler for redirects (e.g., from config-user page on 401)
export async function GET() {
  try {
    console.log('🚪 [API logoff GET] Clearing session cookies and redirecting');
    
    // Create a redirect response to the login page
    const response = NextResponse.redirect(
      new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    );

    // Delete all auth-related cookies
    response.cookies.delete('session');
    response.cookies.delete('idToken');
    response.cookies.delete('refreshToken');

    console.log('✅ [API logoff GET] Cookies cleared, redirecting to login');
    return response;
  } catch (error) {
    console.error('❌ [API logoff GET] Error:', error);
    return NextResponse.json({ message: 'Error logging out' }, { status: 500 });
  }
}
