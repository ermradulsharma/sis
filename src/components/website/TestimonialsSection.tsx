'use client';

import { Star } from 'lucide-react';
import { useScrollAnimation } from './useScrollAnimation';

const testimonials = [
  {
    content:
      'SIS ERP transformed how we manage our consulting firm. Having CRM, project tracking, and invoicing in one place eliminated the chaos of switching between five different apps.',
    clientName: 'Priya Sharma',
    company: 'TechVista Solutions',
    role: 'Operations Director',
    rating: 5,
    initials: 'PS',
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    content:
      'The RBAC system is incredibly well-designed. We set up custom roles in minutes and every team member sees exactly what they need — nothing more, nothing less.',
    clientName: 'James Chen',
    company: 'Nexus Software',
    role: 'CTO',
    rating: 5,
    initials: 'JC',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    content:
      'Moving from spreadsheets to SIS ERP cut our month-end close from 5 days to 1. The finance module with PDF invoices and expense tracking is a game-changer.',
    clientName: 'Aisha Patel',
    company: 'DigitalCraft Agency',
    role: 'Finance Manager',
    rating: 5,
    initials: 'AP',
    gradient: 'from-amber-500 to-orange-600',
  },
];

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/10 to-slate-950" />

      <div
        ref={ref}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Heading */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Growing Teams
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            See how businesses are transforming their operations with SIS&nbsp;ERP.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={t.clientName}
              className={`relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 lg:p-8 transition-all duration-700 hover:border-white/10 hover:bg-white/[0.04] ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 150}ms` : '0ms',
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-300 leading-relaxed mb-6">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-white text-sm font-bold`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t.clientName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
