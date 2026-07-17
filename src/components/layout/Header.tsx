'use client';

import { useSession, signOut } from 'next-auth/react';
import { useSidebarStore } from '@/stores/sidebar.store';
import { useThemeStore } from '@/stores/theme.store';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Settings,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Header() {
  const { data: session } = useSession();
  const toggleMobile = useSidebarStore((state) => state.toggleMobile);
  const { theme, toggleTheme } = useThemeStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    
    // Fetch unread notifications
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/notifications/unread');
        const json = await res.json();
        if (json.success && json.data) {
          setUnreadCount(json.data.count);
        }
      } catch (e) {
        console.error('Failed to fetch unread notifications');
      }
    };
    
    if (session?.user) {
      fetchUnread();
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [session]);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 backdrop-blur-md sm:px-6 md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobile}
          className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Center - Search (Hidden on Mobile) */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="hidden w-full max-w-md sm:block">
          <GlobalSearch />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-slate-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* Profile Dropdown */}
        <div className="relative ml-2" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 rounded-full ring-2 ring-transparent transition-all hover:ring-indigo-500/50 focus:outline-none focus:ring-indigo-500"
          >
            <Avatar
              src={(session?.user as any)?.avatar}
              fallback={session?.user?.name || ''}
              size="sm"
            />
            <div className="hidden flex-col items-start text-left sm:flex">
              <span className="text-sm font-medium text-white">
                {session?.user?.name || 'User'}
              </span>
              <span className="text-xs text-slate-400">
                {session?.user?.role?.name || 'Loading...'}
              </span>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-800 bg-slate-900 py-1 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
              <div className="border-b border-slate-800 px-4 py-3 sm:hidden">
                <p className="truncate text-sm font-medium text-white">
                  {session?.user?.name}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {session?.user?.email}
                </p>
              </div>
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => setIsProfileOpen(false)}
              >
                <UserIcon className="mr-3 h-4 w-4 text-slate-400" />
                Your Profile
              </Link>
              <Link
                href="/company-settings"
                className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => setIsProfileOpen(false)}
              >
                <Settings className="mr-3 h-4 w-4 text-slate-400" />
                Settings
              </Link>
              <div className="my-1 border-t border-slate-800" />
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex w-full items-center px-4 py-2 text-sm text-rose-400 hover:bg-slate-800"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
