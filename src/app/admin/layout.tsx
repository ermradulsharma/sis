'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useSidebarStore } from '@/stores/sidebar.store';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          // Desktop specific margins are not needed here since Sidebar is static on large screens,
          // but we manage width on the Sidebar itself.
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
