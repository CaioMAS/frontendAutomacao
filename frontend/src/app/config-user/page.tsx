// frontend/src/app/config-user/page.tsx
import { cookies } from 'next/headers';

import { UserConfig } from '@/types/auth';
import ConfigUserForm from './ConfigUserForm'; // We will create this client component

async function fetchUserConfig(idToken: string): Promise<UserConfig | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/config-user`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      cache: 'no-store', // Ensure fresh data is fetched on every request
    });

    if (!response.ok) {
      // Log more details on error
      const errorText = await response.text();
      console.error(`Error fetching user config: ${response.status} ${response.statusText}`, errorText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user config:', error);
    return null;
  }
}

export default async function ConfigUserPage() {
  console.log('--- EXECUTANDO O NOVO CÓDIGO DA PÁGINA CONFIG-USER ---');
  const cookieStore: any = cookies();
  const idToken = cookieStore.get('idToken')?.value;

  if (!idToken) {
    // Handle unauthenticated state, e.g., redirect to login
    // In a real app, you'd use middleware or a more robust auth solution
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500">Você não está autenticado. Por favor, faça login.</p>
          <p><a href="/" className="text-blue-500 hover:underline">Ir para Login</a></p>
        </div>
      </div>
    );
  }

  const userConfig = await fetchUserConfig(idToken);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Configurações do Usuário</h2>
        <ConfigUserForm initialData={userConfig} idToken={idToken} />
      </div>
    </div>
  );
}
