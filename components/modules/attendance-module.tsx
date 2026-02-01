'use client';

import React, { useMemo, useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, Button, Badge } from '@/components/ui';
import { Clock, Coffee, Laptop, Square, History, Activity } from 'lucide-react';
import type { Attendance } from '@/types';

/**
 * Attendance Analytics Component
 * Displays comprehensive analytics for attendance patterns
 */
interface AttendanceAnalyticsProps {
  attendance: Attendance[];
}

const AttendanceAnalytics: React.FC<AttendanceAnalyticsProps> = ({ attendance }) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  const stats = useMemo(() => {
    const now = new Date();
    let filtered = attendance.filter((a) => !!a.checkOut);

    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((a) => new Date(a.date) >= weekAgo);
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((a) => new Date(a.date) >= monthAgo);
    } else {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((a) => new Date(a.date) >= yearAgo);
    }

    if (filtered.length === 0) return { avgHours: 0, avgIn: '--:--', avgOut: '--:--', count: 0 };

    const totalHours = filtered.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);
    const avgHours = totalHours / filtered.length;

    const avgInMinutes =
      filtered.reduce((acc, curr) => {
        const d = new Date(curr.checkIn);
        return acc + d.getHours() * 60 + d.getMinutes();
      }, 0) / filtered.length;

    const avgOutMinutes =
      filtered.reduce((acc, curr) => {
        const d = new Date(curr.checkOut!);
        return acc + d.getHours() * 60 + d.getMinutes();
      }, 0) / filtered.length;

    const formatMinutes = (mins: number) => {
      const h = Math.floor(mins / 60);
      const m = Math.floor(mins % 60);
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    return {
      avgHours: avgHours.toFixed(1),
      avgIn: formatMinutes(avgInMinutes),
      avgOut: formatMinutes(avgOutMinutes),
      count: filtered.length,
    };
  }, [attendance, period]);

  return (
    <Card className="p-8 rounded-[2rem] shadow-lg border-accent/20 bg-card h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center">
          <Activity size={14} className="mr-2" /> Attendance Analytics
        </h3>
        <div className="flex bg-accent/10 p-1 rounded-xl">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                period === p ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent/20'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Avg Check-In
          </p>
          <p className="text-3xl font-mono font-black text-primary">{stats.avgIn}</p>
        </div>
        <div className="p-5 bg-secondary/5 rounded-2xl border border-secondary/10 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Avg Check-Out
          </p>
          <p className="text-3xl font-mono font-black text-secondary">{stats.avgOut}</p>
        </div>
        <div className="p-5 bg-accent/5 rounded-2xl border border-accent/10 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Avg Daily Hours
          </p>
          <p className="text-3xl font-mono font-black">{stats.avgHours}h</p>
        </div>
      </div>
    </Card>
  );
};

/**
 * Attendance Module Component
 * Complete attendance tracking with check-in/out and analytics
 */
export const AttendanceModule: React.FC = () => {
  const { currentUser, attendance, checkIn, checkOut } = useStore();
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = attendance.find((a) => a.userId === currentUser?.id && a.date === today);
  const isCheckedIn = todayEntry && !todayEntry.checkOut;
  const myAttendance = attendance.filter((a) => a.userId === currentUser?.id);

  return (
    <div className="space-y-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-10 text-center bg-card shadow-2xl rounded-[3rem] border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Clock size={120} />
            </div>
            <div className="relative z-10">
              <div
                className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 border-4 transition-all duration-500 ${
                  isCheckedIn
                    ? 'border-primary shadow-[0_0_30px_rgba(var(--primary),0.3)]'
                    : 'border-muted'
                }`}
              >
                <Clock
                  size={48}
                  className={isCheckedIn ? 'text-primary animate-pulse' : 'text-muted-foreground'}
                />
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-2">Punch System</h3>
              <p className="text-muted-foreground mb-10 max-w-xs mx-auto">
                Record your working hours for accurate project tracking and payroll.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isCheckedIn ? (
                  <>
                    <Button
                      className="h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
                      onClick={() => checkIn('Office')}
                    >
                      <Laptop className="mr-3" /> Office Login
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-14 px-10 rounded-2xl text-lg font-bold"
                      onClick={() => checkIn('WFH')}
                    >
                      <Coffee className="mr-3" /> Remote Login
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="destructive"
                    className="h-14 px-16 rounded-2xl text-lg font-bold shadow-xl shadow-destructive/20"
                    onClick={checkOut}
                  >
                    <Square className="mr-3" /> End Session
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 bg-secondary text-secondary-foreground shadow-lg rounded-[2rem] border-none flex flex-col items-center justify-center text-center">
          <History className="mb-4" size={48} />
          <p className="text-5xl font-black leading-none mb-2">{myAttendance.length}</p>
          <p className="text-sm font-bold opacity-70 uppercase tracking-widest">Total Check-ins</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AttendanceAnalytics attendance={myAttendance} />
        </div>
        <Card className="p-6 bg-card shadow-lg rounded-[2rem] border-accent/20 flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Recent Status
          </h3>
          <div className="space-y-3 flex-1">
            {myAttendance.slice(0, 5).map((e) => (
              <div
                key={e.id}
                className="p-3 bg-accent/10 rounded-xl border border-accent/10 flex justify-between items-center"
              >
                <div>
                  <p className="text-xs font-bold">{e.date}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(e.checkIn).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <Badge variant={e.type === 'Office' ? 'default' : 'secondary'} className="text-[9px]">
                  {e.type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b bg-accent/5 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <History size={18} /> My Complete Logs
          </h3>
          <Badge variant="outline">{myAttendance.length} Entries</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-accent/5">
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground">Date</th>
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground">Type</th>
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground text-center">
                  In / Out
                </th>
                <th className="p-4 text-[10px] uppercase font-black text-muted-foreground text-right">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {myAttendance.map((e) => (
                <tr key={e.id} className="hover:bg-accent/5 transition-colors">
                  <td className="p-4 font-bold">{e.date}</td>
                  <td className="p-4">
                    <Badge variant="secondary" className="text-[10px]">
                      {e.type}
                    </Badge>
                  </td>
                  <td className="p-4 text-center text-xs text-muted-foreground">
                    {new Date(e.checkIn).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {e.checkOut
                      ? ` - ${new Date(e.checkOut).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}`
                      : ' (Active)'}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-primary">
                    {e.totalHours ? `${e.totalHours}h` : '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
