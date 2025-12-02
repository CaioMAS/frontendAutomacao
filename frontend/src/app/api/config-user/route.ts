import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// This is the GET handler to fetch user configuration
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  console.log('🔍 [API config-user GET] Session cookie:', sessionCookie ? 'EXISTS' : 'MISSING');
  console.log('🔍 [API config-user GET] All cookies:', cookieStore.getAll().map(c => c.name));

  if (!sessionCookie) {
    console.log('❌ [API config-user GET] No session cookie found, returning 401');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/config-user`;
    console.log('📡 [API config-user GET] Fetching from backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      headers: {
        'Cookie': `session=${sessionCookie}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('📥 [API config-user GET] Backend response status:', response.status);

    const data = await response.json();
    console.log('📥 [API config-user GET] Backend response data:', data);

    if (!response.ok) {
      console.log('❌ [API config-user GET] Backend returned error:', data);
      return NextResponse.json({ message: data.message || 'Error fetching user config' }, { status: response.status });
    }

    console.log('✅ [API config-user GET] Success, returning data');
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('❌ [API config-user GET] Exception:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// This is the POST handler to update user configuration
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/config-user`, {
      method: 'POST',
      headers: {
        'Cookie': `session=${sessionCookie}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message || 'Error updating user config' }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error in /api/config-user POST:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
