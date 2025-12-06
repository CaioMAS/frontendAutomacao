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
    <div className="flex min-h-screen relative bg-gradient-to-br from-[#0a0520] via-[#100a30] to-[#17113e]">
      <Sidebar />
      <main
        className={`
          flex-1 px-4 pb-4 pt-16 md:p-6 md:pt-16 lg:p-8 lg:pt-16 overflow-auto bg-gradient-to-br from-[#0a0520] via-[#100a30] to-[#17113e] w-full
          transition-all duration-300
          ${isOpen ? 'md:ml-64' : 'ml-0'}
        `}
      >
        {children}
      </main>
    </div>
  );
}
