import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    console.log('📱 [API whatsapp/create] Creating WhatsApp instance');

    if (!sessionCookie) {
      console.log('❌ [API whatsapp/create] No session cookie found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { instanceName, token } = body;

    if (!instanceName) {
      return NextResponse.json({ message: 'Instance name is required' }, { status: 400 });
    }

    // Call backend to create WhatsApp instance
    // Backend extracts user email from session cookie
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/whatsapp/create`;
    console.log('📡 [API whatsapp/create] Calling backend:', backendUrl);

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Cookie': `session=${sessionCookie}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ instanceName, token }),
    });

    console.log('📥 [API whatsapp/create] Backend response status:', backendResponse.status);

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      console.log('❌ [API whatsapp/create] Backend returned error:', data);
      return NextResponse.json(
        { message: data.message || 'Error creating WhatsApp instance' },
        { status: backendResponse.status }
      );
    }

    console.log('✅ [API whatsapp/create] Instance created successfully');
    return NextResponse.json(data, { status: backendResponse.status });

  } catch (error) {
    console.error('❌ [API whatsapp/create] Exception:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
