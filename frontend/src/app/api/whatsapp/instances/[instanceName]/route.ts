import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ instanceName: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    const { instanceName } = await params;

    console.log('📱 [API whatsapp/delete] Deleting WhatsApp instance:', instanceName);

    if (!sessionCookie) {
      console.log('❌ [API whatsapp/delete] No session cookie found');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Call backend to delete WhatsApp instance
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/whatsapp/instances/${instanceName}`;
    console.log('📡 [API whatsapp/delete] Calling backend:', backendUrl);

    const backendResponse = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Cookie': `session=${sessionCookie}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 [API whatsapp/delete] Backend response status:', backendResponse.status);

    if (!backendResponse.ok) {
      const data = await backendResponse.json();
      console.log('❌ [API whatsapp/delete] Backend returned error:', data);
      return NextResponse.json(
        { message: data.message || 'Error deleting instance' },
        { status: backendResponse.status }
      );
    }

    console.log('✅ [API whatsapp/delete] Instance deleted successfully');
    return NextResponse.json({ message: 'Instance deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('❌ [API whatsapp/delete] Exception:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
