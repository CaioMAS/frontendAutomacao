import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const idToken = cookieStore.get('idToken');

  if (!idToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Here you could add logic to validate the token against your backend
  // or decode it to get user information.
  // For now, simply having the cookie is enough to be considered "logged in" by the client.

  return NextResponse.json({ isAuthenticated: true }, { status: 200 });
}
