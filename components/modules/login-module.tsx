'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, Button, Input, BackgroundBeams } from '@/components/ui';
import { motion } from 'framer-motion';
import { LogIn, ArrowRight } from 'lucide-react';

/**
 * Login Page Component
 * Authentication interface for the application
 */
export const LoginModule: React.FC = () => {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  const quickLogin = (userEmail: string) => {
    login(userEmail);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <BackgroundBeams />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <Card className="p-10 shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(255,255,255,0.05)] border-primary/20 bg-card/80 backdrop-blur-2xl rounded-[2.5rem]">
          <div className="text-center mb-10">
            <motion.div
              whileHover={{ rotate: 0 }}
              initial={{ rotate: 12 }}
              className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/40"
            >
              <LogIn className="text-white" size={40} />
            </motion.div>
            <h2 className="text-4xl font-black tracking-tight mb-2 text-foreground">
              YanHRM Portal
            </h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
              Enterprise OS 2.0
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Identity
              </label>
              <Input
                type="email"
                placeholder="name@yan-hrm.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-accent/30 rounded-2xl border-none focus:ring-2 focus:ring-primary text-base px-6 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Secure Key
              </label>
              <Input
                type="password"
                placeholder="••••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-accent/30 rounded-2xl border-none focus:ring-2 focus:ring-primary text-base px-6 transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/20 group transition-all active:scale-[0.98]"
            >
              Authorize Access{' '}
              <ArrowRight
                className="ml-3 group-hover:translate-x-1 transition-transform"
                size={24}
              />
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-dashed border-accent/20">
            <p className="text-[10px] text-center text-muted-foreground mb-6 uppercase tracking-[0.2em] font-black">
              Simulation Identities
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="text-[10px] h-10 rounded-xl font-bold uppercase tracking-widest"
                onClick={() => quickLogin('admin@nexus.com')}
                type="button"
              >
                Super User
              </Button>
              <Button
                variant="outline"
                className="text-[10px] h-10 rounded-xl font-bold uppercase tracking-widest"
                onClick={() => quickLogin('hr@nexus.com')}
                type="button"
              >
                HR System
              </Button>
              <Button
                variant="outline"
                className="text-[10px] h-10 rounded-xl font-bold uppercase tracking-widest"
                onClick={() => quickLogin('manager@nexus.com')}
                type="button"
              >
                Team Lead
              </Button>
              <Button
                variant="outline"
                className="text-[10px] h-10 rounded-xl font-bold uppercase tracking-widest"
                onClick={() => quickLogin('employee@nexus.com')}
                type="button"
              >
                Staff
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
