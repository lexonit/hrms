'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { UserRole } from '@/types';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  Kanban,
  BookOpen,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Timer,
  Briefcase,
  CreditCard,
  UserPlus,
} from 'lucide-react';

/**
 * Navigation Item Configuration
 */
interface NavItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  id: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    id: 'dashboard',
    roles: Object.values(UserRole),
  },
  {
    icon: Users,
    label: 'Directory',
    id: 'employees',
    roles: [UserRole.SUPER_ADMIN, UserRole.HR_ADMIN, UserRole.MANAGER],
  },
  {
    icon: UserPlus,
    label: 'Onboarding',
    id: 'onboarding',
    roles: [UserRole.SUPER_ADMIN, UserRole.HR_ADMIN],
  },
  {
    icon: Briefcase,
    label: 'Projects',
    id: 'projects',
    roles: Object.values(UserRole),
  },
  {
    icon: Kanban,
    label: 'Kanban',
    id: 'tasks',
    roles: Object.values(UserRole),
  },
  {
    icon: Clock,
    label: 'Attendance',
    id: 'attendance',
    roles: Object.values(UserRole),
  },
  {
    icon: Calendar,
    label: 'Leaves',
    id: 'leaves',
    roles: Object.values(UserRole),
  },
  {
    icon: Timer,
    label: 'Timesheets',
    id: 'timesheets',
    roles: Object.values(UserRole),
  },
  {
    icon: CreditCard,
    label: 'Payroll',
    id: 'payroll',
    roles: Object.values(UserRole),
  },
  {
    icon: BookOpen,
    label: 'Knowledge',
    id: 'kb',
    roles: Object.values(UserRole),
  },
  {
    icon: Settings,
    label: 'Settings',
    id: 'settings',
    roles: [UserRole.SUPER_ADMIN, UserRole.HR_ADMIN],
  },
];

/**
 * Sidebar Navigation Component
 * Collapsible sidebar with role-based menu items using Next.js routing
 */
export const Sidebar: React.FC = () => {
  const router = useRouter();
  const { currentUser, logout } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!currentUser) return null;

  const filteredItems = navItems.filter((item) => item.roles.includes(currentUser.role));

  return (
    <aside
      className={`h-screen bg-card border-r transition-all duration-300 flex flex-col z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            YanHRM
          </span>
        )}
        <Button
          variant="ghost"
          className="px-2"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto scrollbar-hide">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === `/${item.id}`;

          return (
            <Link
              key={item.id}
              href={`/${item.id}`}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group relative block ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center w-full">
                <Icon size={20} className={collapsed ? 'mx-auto' : 'mr-3'} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </div>
              {isActive && !collapsed && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
          aria-label="Sign out"
        >
          <LogOut size={20} className={collapsed ? 'mx-auto' : 'mr-3'} />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
