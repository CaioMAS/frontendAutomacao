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

  // If 401 (session revoked or invalid), redirect to logoff to clear cookies
  if (status === 401) {
    redirect('/api/auth/logoff');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#100a30] to-[#17113e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 relative z-10 border border-white/20">
        {/* Logo/Title with gradient */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#100a30] via-[#17113e] to-[#100a30] bg-clip-text text-transparent mb-2">
            Configurações do Usuário
          </h2>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-transparent via-[#100a30] to-transparent rounded-full"></div>
        </div>

        {/* The client component now receives only the initial data, not the token */}
        <ConfigUserContainer initialConfig={userConfig} />
      </div>
    </div>
  );
}
