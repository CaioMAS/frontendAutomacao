"use client";

import Sidebar from '@/components/Sidebar';
import { useSidebar } from '@/context/SidebarContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen relative bg-slate-900">
      <Sidebar />
      <main
        className={`
          flex-1 p-4 md:p-6 lg:p-8 overflow-auto bg-slate-900 w-full
          transition-all duration-300
          ${isOpen ? 'ml-64' : 'ml-0'}
        `}
      >
        {children}
      </main>
    </div>
  );
}
