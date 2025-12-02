import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ instanceId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const { instanceId } = await params;

    console.log('📱 [API whatsapp/groups] Listing WhatsApp groups for instance:', instanceId);

    if (!sessionCookie) {
      console.log('❌ [API whatsapp/groups] No session cookie found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Call backend to get WhatsApp groups
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/whatsapp/${instanceId}/groups`;
    console.log('📡 [API whatsapp/groups] Calling backend:', backendUrl);

    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Cookie': `session=${sessionCookie}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 [API whatsapp/groups] Backend response status:', backendResponse.status);

    const data = await backendResponse.json();
    console.log('📥 [API whatsapp/groups] Backend response data:', JSON.stringify(data, null, 2));

    if (!backendResponse.ok) {
      console.log('❌ [API whatsapp/groups] Backend returned error:', data);
      return NextResponse.json(
        { message: data.message || 'Error fetching groups' },
        { status: backendResponse.status }
      );
    }

    console.log('✅ [API whatsapp/groups] Groups fetched successfully');
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('❌ [API whatsapp/groups] Exception:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
