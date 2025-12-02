import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    console.log('📱 [API whatsapp/instances] Listing WhatsApp instances');
    console.log('🍪 [API whatsapp/instances] Session cookie:', sessionCookie ? 'EXISTS' : 'MISSING');

    if (!sessionCookie) {
      console.log('❌ [API whatsapp/instances] No session cookie found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Call backend to list user's WhatsApp instances
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/whatsapp/instances`;
    console.log('📡 [API whatsapp/instances] Calling backend:', backendUrl);

    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Cookie': `session=${sessionCookie}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 [API whatsapp/instances] Backend response status:', backendResponse.status);

    const data = await backendResponse.json();
    console.log('📥 [API whatsapp/instances] Backend response data:', JSON.stringify(data, null, 2));

    if (!backendResponse.ok) {
      console.log('❌ [API whatsapp/instances] Backend returned error:', data);
      return NextResponse.json(
        { message: data.message || 'Error fetching instances' },
        { status: backendResponse.status }
      );
    }

    console.log('✅ [API whatsapp/instances] Instances fetched successfully');
    console.log('📊 [API whatsapp/instances] Returning data:', data);
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('❌ [API whatsapp/instances] Exception:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
