'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { useScrollAnimation } from './useScrollAnimation';

const plans = [
    {
        name: 'Starter',
        description: 'For small teams getting started',
        price: '49',
        period: '/month',
        features: [
            'Up to 10 users',
            'CRM & Sales Pipeline',
            'Basic Project Management',
            'Invoice Generation',
            'Email Support',
            '5 GB Storage',
        ],
        cta: 'Start Free Trial',
        href: '/login',
        highlighted: false,
    },
    {
        name: 'Professional',
        description: 'For growing businesses',
        price: '149',
        period: '/month',
        features: [
            'Up to 50 users',
            'All Starter features',
            'HR & Payroll',
            'Advanced Analytics',
            'Custom Roles & Permissions',
            'API Access',
            'Priority Support',
            '50 GB Storage',
        ],
        cta: 'Start Free Trial',
        href: '/login',
        highlighted: true,
    },
    {
        name: 'Enterprise',
        description: 'For large organizations',
        price: 'Custom',
        period: '',
        features: [
            'Unlimited users',
            'All Professional features',
            'Dedicated Instance',
            'Custom Integrations',
            'SLA Guarantee',
            'On-premise Option',
            '24/7 Phone Support',
            'Unlimited Storage',
        ],
        cta: 'Contact Sales',
        href: '#contact',
        highlighted: false,
    },
];

export default function PricingSection() {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <section id="pricing" className="relative py-24 sm:py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/30 to-slate-950" />

            <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">Pricing</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Simple, <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Transparent</span> Pricing</h2>
                    <p className="mx-auto max-w-2xl text-lg text-slate-400">Choose the plan that fits your team. Start free, upgrade as you grow.</p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
                    {plans.map((plan, index) => (
                        <div key={plan.name} className={`relative rounded-2xl border p-6 lg:p-8 transition-all duration-700 ${plan.highlighted ? 'border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 to-transparent shadow-2xl shadow-indigo-500/10 md:scale-105' : 'border-white/5 bg-white/[0.02] hover:border-white/10'} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: isVisible ? `${index * 150}ms` : '0ms' }}>
                            {plan.highlighted && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full shadow-lg shadow-indigo-500/25">Most Popular</span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                                <p className="text-sm text-slate-400">{plan.description}</p>
                            </div>

                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">{plan.price !== 'Custom' && '$'}{plan.price}</span>
                                {plan.period && <span className="text-slate-400 text-sm">{plan.period}</span>}
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <Check
                                            className={`h-5 w-5 shrink-0 mt-0.5 ${plan.highlighted ? 'text-indigo-400' : 'text-slate-500'
                                                }`}
                                        />
                                        <span className="text-sm text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.href}
                                className={`block w-full text-center py-3 px-6 rounded-xl text-sm font-semibold transition-all ${plan.highlighted
                                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
                                    : 'border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 hover:border-white/20'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
