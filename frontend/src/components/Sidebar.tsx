"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/logoff');
      window.location.href = '/';
    } catch (error) {
      console.error('An error occurred during logout', error);
    }
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-l from-[#100a30] to-[#17113e] text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Menu</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-700">
          Dashboard
        </Link>
        <Link href="/integration-wpp" className="block p-2 rounded hover:bg-gray-700">
          Integração API Wpp
        </Link>
        <Link href="/config-user" className="block p-2 rounded hover:bg-gray-700">
          Configuração do usuário
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button onClick={handleLogout} className="w-full p-2 text-left rounded hover:bg-gray-700">
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
