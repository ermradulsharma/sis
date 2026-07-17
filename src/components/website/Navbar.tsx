'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Blocks } from 'lucide-react';

const navLinks = [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-black/20' : 'bg-transparent'}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-110"><Blocks className="h-5 w-5 text-white" /></div>
                        <span className="text-xl font-bold tracking-tight text-white">SIS <span className="text-indigo-400">ERP</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-all">{link.label}</Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</Link>
                        <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5">Get Started</Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 text-slate-300 hover:text-white" aria-label="Toggle menu">{isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="border-t border-white/5 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-1">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} onClick={() => setIsMobileOpen(false)} className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">{link.label}</Link>
                    ))}
                    <div className="pt-3 border-t border-white/5 space-y-2">
                        <Link href="/login" className="block w-full text-center px-4 py-3 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors">Log In</Link>
                        <Link href="/login" className="block w-full text-center px-4 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">Get Started</Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
