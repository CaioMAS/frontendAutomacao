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
          bg-[#17113e] text-white hover:bg-[#100a30] 
          transition-all duration-300 shadow-lg
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
          bg-gradient-to-l from-[#100a30] to-[#17113e] text-white
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Menu</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="block p-2 rounded hover:bg-gray-700 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/whatsapp-instances"
            className="block p-2 rounded hover:bg-gray-700 transition-colors"
          >
            Instâncias WhatsApp
          </Link>
          <Link
            href="/whatsapp-groups"
            className="block p-2 rounded hover:bg-gray-700 transition-colors"
          >
            Grupos WhatsApp
          </Link>
          <Link
            href="/integration-wpp"
            className="block p-2 rounded hover:bg-gray-700 transition-colors"
          >
            Números de WhatsApp
          </Link>
          <Link
            href="/config-user"
            className="block p-2 rounded hover:bg-gray-700 transition-colors"
          >
            Configuração do usuário
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full p-2 text-left rounded hover:bg-gray-700 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
