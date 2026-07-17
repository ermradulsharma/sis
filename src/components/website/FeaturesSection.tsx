'use client';

import {
  Users,
  FolderKanban,
  UserCog,
  DollarSign,
  Package,
  Headphones,
  FileText,
  BarChart3,
} from 'lucide-react';
import { useScrollAnimation } from './useScrollAnimation';

const features = [
  {
    icon: Users,
    title: 'CRM & Sales',
    description:
      'Manage leads, customers, opportunities, quotations, and follow-ups with a visual sales pipeline.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FolderKanban,
    title: 'Project Management',
    description:
      'Track projects with Kanban boards, task assignments, milestones, and integrated time tracking.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: UserCog,
    title: 'HR & Payroll',
    description:
      'Clock in/out attendance, leave management, payroll processing, and employee self-service.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: DollarSign,
    title: 'Finance',
    description:
      'Generate invoices with PDF export, track payments, manage expenses, and monitor cash flow.',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    icon: Package,
    title: 'Inventory',
    description:
      'Product catalog, category management, stock level monitoring, and low-stock alerts.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Headphones,
    title: 'Service & Support',
    description:
      'Helpdesk ticketing system, SLA management, and searchable knowledge base for customers.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: FileText,
    title: 'CMS',
    description:
      'Blog management, FAQ builder, testimonials, and a centralized contact message inbox.',
    gradient: 'from-teal-500 to-emerald-500',
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    description:
      'Business analytics dashboards, revenue reports, lead funnels, and workforce distribution.',
    gradient: 'from-fuchsia-500 to-pink-500',
  },
];

export default function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
            Modules
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything You Need,{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              One Platform
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Stop juggling between fragmented tools. SIS&nbsp;ERP brings every
            department under one roof with a unified interface and shared data
            model.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 hover:-translate-y-1 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 75}ms` : '0ms',
              }}
            >
              {/* Hover glow */}
              <div
                className={`absolute -inset-px rounded-2xl bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity blur-xl`}
              />

              <div className="relative">
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-4`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
