import { APP_CONFIG } from '@/config/constants';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
              <span className="text-xl font-bold">S</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              {APP_CONFIG.name}
            </span>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-slate-900 object-cover overflow-hidden">
          {/* Decorative background for auth pages */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-3xl" />
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-600/30 blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-violet-600/30 blur-[128px]" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-md text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Enterprise Resource Planning</h2>
              <p className="text-lg text-slate-300">
                Manage your software company's operations, projects, and people from a single, unified platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
