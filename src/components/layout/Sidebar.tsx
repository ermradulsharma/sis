'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSidebarStore } from '@/stores/sidebar.store';
import { NAVIGATION } from '@/config/navigation';
import { hasPermission } from '@/config/permissions';
import { isModuleEnabled } from '@/config/modules';
import { APP_CONFIG } from '@/config/constants';
import { cn } from '@/lib/utils';
import {
    ChevronLeft,
    X,
    LayoutDashboard,
    Settings,
    Users,
    Shield,
    UserCheck,
    Building2,
    MapPin,
    Bell,
    ScrollText,
    FolderOpen,
    UserPlus,
    Building,
    Contact,
    GitBranchPlus,
    FileSpreadsheet,
    FolderKanban,
    CheckSquare,
    Clock,
    Package,
    Tags,
    Ticket,
    BookOpen,
    CalendarCheck,
    CalendarOff,
    Wallet,
    Receipt,
    CreditCard,
    Banknote,
    FileText,
    PenSquare,
    Image as ImageIcon,
    BarChart3,
    TrendingUp,
} from 'lucide-react';

// Map icon names from config to actual Lucide components
const IconMap: Record<string, React.ElementType> = {
    LayoutDashboard,
    Settings,
    Users,
    Shield,
    UserCheck,
    Building2,
    MapPin,
    Bell,
    ScrollText,
    FolderOpen,
    UserPlus,
    Building,
    Contact,
    GitBranchPlus,
    FileSpreadsheet,
    FolderKanban,
    CheckSquare,
    Clock,
    Package,
    Tags,
    Ticket,
    BookOpen,
    CalendarCheck,
    CalendarOff,
    Wallet,
    Receipt,
    CreditCard,
    Banknote,
    FileText,
    PenSquare,
    Image: ImageIcon,
    BarChart3,
    TrendingUp,
};

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userPermissions = session?.user?.role?.permissions || [];

    const { isCollapsed, isMobileOpen, toggleCollapsed, closeMobile } = useSidebarStore();

    // Filter navigation items based on user permissions and active modules
    const filteredNav = NAVIGATION.map((section) => {
        const items = section.items.filter((item) => {
            // Check module enabled status
            if (item.moduleId && !isModuleEnabled(item.moduleId)) return false;
            // Check permission
            if (item.permission && !hasPermission(userPermissions, item.permission)) return false;
            return true;
        });
        return { ...section, items };
    }).filter((section) => section.items.length > 0);

    return (
        <>
            {/* Mobile Backdrop */}
            {isMobileOpen && <div className="fixed inset-0 z-40 bg-black/80 lg:hidden backdrop-blur-sm" onClick={closeMobile} aria-hidden="true" />}

            {/* Sidebar */}
            <aside className={cn('fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 lg:static', isCollapsed ? 'w-20' : 'w-72', isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
                {/* Logo Section */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-4">
                    <Link href="/admin" className="flex items-center gap-3 overflow-hidden" onClick={() => isMobileOpen && closeMobile()}>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"><span className="font-bold">S</span></div>
                        {!isCollapsed && <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">{APP_CONFIG.name}</span>}
                    </Link>
                    <button onClick={closeMobile} className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"><X className="h-5 w-5" /></button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6">
                    {filteredNav.map((section, idx) => (
                        <div key={idx} className="space-y-1">
                            {!isCollapsed && section.title && <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{section.title}</h4>}
                            {isCollapsed && section.title && <div className="mx-auto mb-2 h-px w-8 bg-slate-800" />}

                            <ul className="space-y-1">
                                {section.items.map((item, itemIdx) => {
                                    const Icon = item.icon ? IconMap[item.icon] : null;
                                    const isActive = item.href ? (item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)) : false;
                                    return (
                                        <li key={itemIdx}>
                                            <Link href={item.href || '#'} onClick={() => isMobileOpen && closeMobile()} className={cn('group flex items-center rounded-lg px-2 py-2 text-sm font-medium transition-all duration-200', isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100', isCollapsed ? 'justify-center' : 'gap-3',)} title={isCollapsed ? item.label : undefined}>
                                                {Icon && (<Icon className={cn('shrink-0 transition-colors', isCollapsed ? 'h-5 w-5' : 'h-5 w-5', isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300',)} />)}
                                                {!isCollapsed && (<span className="flex-1 truncate">{item.label}</span>)}
                                                {!isCollapsed && item.badge && (<span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-semibold text-indigo-300">{item.badge}</span>)}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer / Collapse Toggle */}
                <div className="hidden border-t border-slate-800 p-4 lg:flex lg:items-center lg:justify-center">
                    <button onClick={toggleCollapsed} className={cn('flex h-10 w-full items-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors', isCollapsed ? 'justify-center' : 'px-4 justify-between',)}>
                        {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
                        <ChevronLeft className={cn('h-5 w-5 transition-transform duration-300', isCollapsed && 'rotate-180')} />
                    </button>
                </div>
            </aside>
        </>
    );
}
