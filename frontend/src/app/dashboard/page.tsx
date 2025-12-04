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
    <div className="max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">Dashboard</h1>
      <p className="text-base md:text-lg text-slate-400 mb-6">Bem-vindo(a) ao seu painel!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/config-user"
          className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-indigo-500/20"
        >
          Configurações do Usuário
        </Link>
        <Link
          href="/change-password"
          className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-emerald-500/20"
        >
          Alterar Senha
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full text-center bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-red-500/20"
        >
          {isLoggingOut ? 'Saindo...' : 'Sair'}
        </button>
      </div>

      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
    </div>
  );
}
