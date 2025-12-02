"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/logoff', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('✅ Logout successful, redirecting to login');
        // Redirect to login page
        window.location.href = '/';
      } else {
        const data = await response.json();
        setError(data.message || 'Error logging out');
      }
    } catch (error) {
      console.error('❌ Error during logout:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">Bem-vindo(a) ao seu painel!</p>
      <div className="space-y-4">
        <Link href="/config-user" className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Configurações do Usuário
        </Link>
        <Link href="/change-password" className="block text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Alterar Senha
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full text-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          {isLoggingOut ? 'Saindo...' : 'Sair'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
