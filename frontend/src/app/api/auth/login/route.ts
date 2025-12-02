import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 [API login] Attempting login for:', email);

    // Forward the request to the backend
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;
    console.log('📡 [API login] Forwarding to backend:', backendUrl);

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('📥 [API login] Backend response status:', backendResponse.status);

    const data = await backendResponse.json();
    console.log('📥 [API login] Backend response data:', data);

    // Create the Next.js response
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Forward the Set-Cookie header if present
    const setCookieHeader = backendResponse.headers.get('set-cookie');
    console.log('🍪 [API login] Set-Cookie header from backend:', setCookieHeader ? 'EXISTS' : 'MISSING');
    
    if (setCookieHeader) {
      console.log('🍪 [API login] Forwarding Set-Cookie:', setCookieHeader.substring(0, 50) + '...');
      response.headers.set('Set-Cookie', setCookieHeader);
    }

    console.log('✅ [API login] Login response sent');
    return response;
  } catch (error) {
    console.error('❌ [API login] Exception:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
