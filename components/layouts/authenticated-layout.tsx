'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Sidebar, Topbar } from '@/components/navigation';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

/**
 * Authenticated Layout
 * Wraps all authenticated pages with sidebar and topbar
 * Authentication is enforced by middleware
 */
export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useStore();
  const pathname = usePathname();

  // Get page title from pathname
  const getTitle = () => {
    const path = pathname.split('/')[1] || 'dashboard';
    if (path === 'dashboard') return 'YanHRM Central';
    if (path === 'kb') return 'Knowledge Base';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar */}
        <Topbar title={getTitle()} />

        {/* Page Content with Animation */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth bg-accent/5">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{
              duration: 0.4,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
