// frontend/src/app/config-user/page.tsx
import { UserConfig } from '@/types/auth';
import ConfigUserContainer from './ConfigUserContainer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// This Server Component now fetches data from the internal BFF endpoint.
async function fetchUserConfig(cookieHeader: string): Promise<{ data: UserConfig | null; status: number }> {
  try {
    // Construct the absolute URL for server-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const absoluteUrl = `${baseUrl}/api/config-user`;

    // We need to manually pass the cookie header for server-side fetch calls.
    const response = await fetch(absoluteUrl, {
      headers: {
        'Cookie': cookieHeader,
      },
      cache: 'no-store',
    });

    if (response.status === 401) {
      // The BFF route determined the user is not authenticated (cookie revoked or invalid)
      return { data: null, status: 401 };
    }

    if (!response.ok) {
      console.error(`Error fetching user config: ${response.status} ${response.statusText}`);
      return { data: null, status: response.status };
    }

    const jsonResponse = await response.json();

    if (jsonResponse.success && Array.isArray(jsonResponse.data) && jsonResponse.data.length > 0) {
      return { data: jsonResponse.data[0], status: 200 };
    }

    return { data: null, status: 200 };
  } catch (error) {
    console.error('Error fetching user config:', error);
    return { data: null, status: 500 };
  }
}

export default async function ConfigUserPage() {
  // On the server, we need to get the cookies and pass them to the fetch call.
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

  // Check for authentication cookie (idToken or session)
  const hasAuthCookie = cookieStore.has('idToken') || cookieStore.has('session');

  if (!hasAuthCookie) {
    redirect('/');
  }

  const { data: userConfig, status } = await fetchUserConfig(cookieHeader);

  // If 401 (session revoked or invalid), redirect to logout to clear cookies
  if (status === 401) {
    redirect('/api/auth/logout');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Configurações do Usuário</h2>
        {/* The client component now receives only the initial data, not the token */}
        <ConfigUserContainer initialConfig={userConfig} />
      </div>
    </div>
  );
}
