'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { UserRole } from '@/types';
import { Card, Button, Badge } from '@/components/ui';
import {
  Kanban,
  Briefcase,
  Calendar as CalendarIcon,
  Target,
  BarChart3,
  TrendingUp,
  Timer,
  BookOpen,
  Users,
} from 'lucide-react';

/**
 * Dashboard Module Component
 * Main dashboard with overview and quick actions
 */
export const DashboardModule: React.FC = () => {
  const { currentUser, tasks, attendance, leaves, projects } = useStore();

  const activeTasks = tasks.filter((t) => t.assigneeId === currentUser?.id && t.status !== 'Done');
  const pendingLeavesCount = leaves.filter(
    (l) => l.status === 'PENDING' && l.userId === currentUser?.id
  ).length;
  const today = new Date().toISOString().split('T')[0];
  const teamInToday = attendance.filter((a) => a.date === today && !a.checkOut).length;

  const stats = [
    { label: 'Active Tasks', value: activeTasks.length, icon: Kanban, color: 'text-blue-500', tab: 'tasks' },
    {
      label: 'My Projects',
      value: projects.filter((p) => p.members.includes(currentUser?.id || '')).length,
      icon: Briefcase,
      color: 'text-purple-500',
      tab: 'projects',
    },
    { label: 'Pending Leaves', value: pendingLeavesCount, icon: CalendarIcon, color: 'text-amber-500', tab: 'leaves' },
  ];

  const quickActions = [
    { label: 'Time Off', icon: CalendarIcon, tab: 'leaves' },
    { label: 'Time Sheet', icon: Timer, tab: 'timesheets' },
    { label: 'Yan Wiki', icon: BookOpen, tab: 'kb' },
    { label: 'Directory', icon: Users, tab: 'employees' },
  ];

  return (
    <div className="space-y-8 pb-32">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Hero Card */}
        <Card className="xl:col-span-2 p-10 bg-primary text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/40 rounded-[2rem] border-none min-h-[300px] flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8 rotate-12">
            <Target size={300} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-center">
            <Badge className="w-fit mb-4 bg-white/20 text-white border-none backdrop-blur-sm">
              System Health: Optimal
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">YanHRM Dashboard</h2>
            <p className="text-lg opacity-80 mb-10 max-w-xl leading-relaxed">
              Welcome back, {currentUser?.name.split(' ')[0]}.
              {' '}You have {activeTasks.length} active tasks assigned for this sprint.
              {currentUser?.role === UserRole.MANAGER
                ? ` Current team capacity is at ${teamInToday} members clocked-in.`
                : ' Log your time today to stay sync with the team.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/attendance">
                <Button className="bg-white text-primary hover:bg-white/90 px-10 h-14 text-lg font-bold rounded-2xl shadow-xl border-none ring-4 ring-white/10">
                  Digital Clock-In
                </Button>
              </Link>
              <Link href="/tasks">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 h-14 text-lg font-bold rounded-2xl shadow-xl border-none ring-4 ring-secondary/10">
                  Manage Tasks
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Stats Sidebar */}
        <div className="space-y-6 flex flex-col h-full">
          <Card className="flex-1 p-8 bg-card shadow-lg hover:shadow-xl transition-all rounded-[2rem] border-accent/20">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center">
              <BarChart3 size={14} className="mr-2" /> Quick Stats
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Link key={stat.label} href={`/${stat.tab}`}>
                    <div className="flex items-center justify-between p-4 bg-accent/10 rounded-2xl border border-accent/10 cursor-pointer hover:bg-accent/20 transition-all">
                      <div className="flex items-center gap-3">
                        <Icon size={20} className={stat.color} />
                        <span className="text-sm font-medium">{stat.label}</span>
                      </div>
                      <span className="text-xl font-black">{stat.value}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
          
          <Card className="p-8 bg-secondary text-secondary-foreground shadow-lg rounded-[2rem] border-none flex flex-col items-center justify-center text-center">
            <TrendingUp className="mb-2" size={32} />
            <p className="text-3xl font-black leading-none">98.4%</p>
            <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">Engagement</p>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={`/${action.tab}`}>
              <Button
                variant="outline"
                className="h-32 w-full rounded-[1.5rem] flex flex-col gap-3 hover:bg-primary/5 hover:border-primary/40 transition-all group bg-card border-accent/20 shadow-sm"
              >
                <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-primary/10 transition-colors">
                  <Icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="font-bold text-sm">{action.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
