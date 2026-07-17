'use client';

import { Fragment, ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function SlideOver({ isOpen, onClose, title, description, children, footer }: SlideOverProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background backdrop */}
        <div 
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
          aria-hidden="true" 
          onClick={onClose}
        />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
          {/* Slide-over panel */}
          <div className="pointer-events-auto w-screen max-w-md transform transition-all duration-300 ease-in-out">
            <div className="flex h-full flex-col divide-y divide-slate-800 bg-slate-900 shadow-2xl">
              
              {/* Header */}
              <div className="px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white" id="slide-over-title">
                    {title}
                  </h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="relative rounded-md text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={onClose}
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                {description && (
                  <div className="mt-1">
                    <p className="text-sm text-slate-400">{description}</p>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                {children}
              </div>
              
              {/* Footer */}
              {footer && (
                <div className="flex shrink-0 justify-end gap-3 px-4 py-4 sm:px-6 bg-slate-900/90 backdrop-blur-md">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
