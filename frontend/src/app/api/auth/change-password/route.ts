import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    console.log('🔐 [API change-password] Attempting password change');

    if (!sessionCookie) {
      console.log('❌ [API change-password] No session cookie found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { newPassword } = body;

    if (!newPassword) {
      return NextResponse.json({ message: 'New password is required' }, { status: 400 });
    }

    // Call backend change-password endpoint
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`;
    console.log('📡 [API change-password] Calling backend:', backendUrl);

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Cookie': `session=${sessionCookie}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });

    console.log('📥 [API change-password] Backend response status:', backendResponse.status);

    const data = await backendResponse.json();
    console.log('📥 [API change-password] Backend response data:', data);

    if (!backendResponse.ok) {
      console.log('❌ [API change-password] Backend returned error:', data);
      return NextResponse.json(
        { message: data.message || data.error?.message || 'Error changing password' },
        { status: backendResponse.status }
      );
    }

    console.log('✅ [API change-password] Password changed successfully');
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('❌ [API change-password] Exception:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
