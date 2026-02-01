'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button, Badge, Avatar } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Moon, Sun, Check } from 'lucide-react';

interface TopbarProps {
  title: string;
}

/**
 * Topbar Component
 * Application header with user info, notifications, and theme toggle
 */
export const Topbar: React.FC<TopbarProps> = ({ title }) => {
  const { currentUser, notifications, markNotificationRead } = useStore();
  const [isDark, setIsDark] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const unreadCount = notifications.filter(
    (n) => !n.read && (n.userId === currentUser?.id || !n.userId)
  ).length;

  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser?.id || !n.userId
  );

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold capitalize tracking-tight">{title.replace('-', ' ')}</h1>
        <Badge variant="outline" className="hidden sm:inline-flex bg-accent/30">
          {new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
        </Badge>
      </div>

      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="rounded-full w-10 h-10 p-0 hover:rotate-12 transition-transform"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
        </Button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            className="rounded-full w-10 h-10 p-0 relative"
            onClick={() => setShowNotifs(!showNotifs)}
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse" />
            )}
          </Button>

          <AnimatePresence>
            {showNotifs && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifs(false)}
                  aria-hidden="true"
                />

                {/* Dropdown */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-card border rounded-xl shadow-2xl p-4 shadow-primary/10 z-50"
                >
                  <div className="flex justify-between items-center pb-2 border-b">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    <Badge variant="secondary" className="text-[10px]">
                      {unreadCount} New
                    </Badge>
                  </div>

                  {userNotifications.length === 0 ? (
                    <p className="text-center text-xs text-muted-foreground py-8">
                      No notifications yet.
                    </p>
                  ) : (
                    <div className="space-y-2 mt-3">
                      {userNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 rounded-lg text-xs border transition-colors cursor-pointer group ${
                            n.read
                              ? 'opacity-50 grayscale bg-accent/10'
                              : 'bg-primary/5 border-primary/20'
                          }`}
                          onClick={() => markNotificationRead(n.id)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold">{n.title}</span>
                            {!n.read && (
                              <Check
                                size={12}
                                className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            )}
                          </div>
                          <p className="text-muted-foreground line-clamp-2">{n.message}</p>
                          <span className="text-[10px] opacity-40 mt-2 block">
                            {new Date(n.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 ml-2 pl-4 border-l">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold leading-none mb-1">{currentUser?.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {currentUser?.role.replace('_', ' ')}
            </p>
          </div>
          <div className="relative w-9 h-9">
            <Avatar
              src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}`}
              alt={currentUser?.name || 'User'}
              fallback={currentUser?.name || 'U'}
              className="rounded-xl border-2 border-primary/20 shadow-sm"
              size={36}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
