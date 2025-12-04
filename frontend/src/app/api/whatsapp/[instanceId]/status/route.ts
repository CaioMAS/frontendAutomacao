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

    if (!sessionCookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/whatsapp/${instanceId}/status`;
    console.log('📡 [API status] Calling backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Cookie': `session=${sessionCookie}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 [API status] Backend response status:', response.status);
    
    // Debug: log raw text if error
    if (!response.ok) {
        const text = await response.text();
        console.log('❌ [API status] Backend error body:', text.substring(0, 200));
        try {
            const data = JSON.parse(text);
            return NextResponse.json(
                { message: data.message || 'Error fetching status' },
                { status: response.status }
            );
        } catch {
            return NextResponse.json(
                { message: 'Backend returned invalid response' },
                { status: response.status }
            );
        }
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error fetching instance status:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
