"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';

const Sidebar = () => {
  const router = useRouter();
  const { isOpen, toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');

      const response = await fetch('/api/auth/logoff', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('✅ Logout successful, redirecting to login');
        window.location.href = '/';
      } else {
        console.error('❌ Logout failed');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('❌ An error occurred during logout', error);
      window.location.href = '/';
    }
  };

  return (
    <>
      {/* Menu button - moves to right when sidebar is open */}
      <button
        onClick={toggleSidebar}
        className={`
          fixed top-4 z-50 p-2 rounded-md 
          bg-slate-800 text-white hover:bg-slate-700 
          transition-all duration-300 shadow-lg border border-slate-700
          ${isOpen ? 'left-auto right-4' : 'left-4'}
        `}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>


      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-40
          w-64 min-h-screen
          bg-slate-800 text-slate-100
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          border-r border-slate-700 shadow-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-slate-700 flex items-center justify-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Closer Ally
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="block p-3 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-200 text-slate-400 font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/whatsapp-instances"
            className="block p-3 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-200 text-slate-400 font-medium"
          >
            Instâncias WhatsApp
          </Link>
          <Link
            href="/whatsapp-groups"
            className="block p-3 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-200 text-slate-400 font-medium"
          >
            Grupos WhatsApp
          </Link>
          <Link
            href="/integration-wpp"
            className="block p-3 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-200 text-slate-400 font-medium"
          >
            Números de WhatsApp
          </Link>
          <Link
            href="/config-user"
            className="block p-3 rounded-lg hover:bg-slate-700 hover:text-white transition-all duration-200 text-slate-400 font-medium"
          >
            Configuração do usuário
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full p-3 text-left rounded-lg hover:bg-red-900/20 hover:text-red-400 text-slate-400 transition-all duration-200 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
