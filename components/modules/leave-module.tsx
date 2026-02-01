'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, Button, Input, Textarea, Badge } from '@/components/ui';
import { ArrowRight, Plus, AlertCircle } from 'lucide-react';
import { LeaveStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

type LeaveType = 'Annual' | 'Sick' | 'Casual' | 'Maternity' | 'Unpaid';

const LEAVE_TYPES: LeaveType[] = ['Annual', 'Sick', 'Casual', 'Maternity', 'Unpaid'];


const calculateDuration = (start: string, end: string) => {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays + 1 : 0;
};

/**
 * Leave Module Component
 * Full-featured leave management with request form
 */
export const LeaveModule: React.FC = () => {
  const { currentUser, leaves, requestLeave } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    type: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }>({
    type: 'Annual',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const duration = calculateDuration(formData.startDate, formData.endDate);
  const myLeaves = leaves.filter((l) => l.userId === currentUser?.id);

  const validateForm = () => {
    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      return false;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Date Logic Checks
    if (end < start) {
      setError('End date cannot be earlier than start date');
      return false;
    }

    if (formData.type !== 'Sick' && start < today) {
      setError('Leave requests (except Sick Leave) cannot be in the past');
      return false;
    }

    if (formData.reason.trim().length < 10) {
      setError('Please provide a detailed reason (minimum 10 characters)');
      return false;
    }

    // Overlap Check
    const hasOverlap = myLeaves.some((leave) => {
      if (leave.status === LeaveStatus.REJECTED) return false;
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return start <= leaveEnd && end >= leaveStart;
    });

    if (hasOverlap) {
      setError('You already have a leave request for this period');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    requestLeave({
      userId: currentUser?.id || '',
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
    });
    setIsAdding(false);
    setFormData({
      type: 'Annual',
      startDate: '',
      endDate: '',
      reason: '',
    });
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Leave Portfolio</h2>
          <p className="text-sm text-muted-foreground">Apply for vacations or sick leave.</p>
        </div>
        <Button onClick={() => { setIsAdding(true); setError(null); }} className="rounded-xl">
          <Plus size={18} className="mr-2" /> Application
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <Card className="p-6 bg-accent/10 border-dashed border-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as LeaveType })}
                  >
                    {LEAVE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="date"
                    required
                    placeholder="Start Date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                  <Input
                    type="date"
                    required
                    placeholder="End Date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
                {duration > 0 && (
                  <div className="text-sm font-medium text-muted-foreground bg-accent/20 p-2 rounded-md inline-block">
                    Duration: <span className="text-foreground font-bold">{duration}</span> {duration === 1 ? 'day' : 'days'}
                  </div>
                )}
                <Textarea
                  required
                  placeholder="Reason for leave"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setIsAdding(false)} type="button">
                    Cancel
                  </Button>
                  <Button type="submit">Submit Request</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="overflow-hidden rounded-[2rem]">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-accent/5 border-b">
            <tr>
              <th className="p-5 text-[10px] uppercase font-black text-muted-foreground">Category</th>
              <th className="p-5 text-[10px] uppercase font-black text-muted-foreground">Timeline</th>
              <th className="p-5 text-[10px] uppercase font-black text-muted-foreground">Reason Reference</th>
              <th className="p-5 text-[10px] uppercase font-black text-muted-foreground text-right">
                State
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {myLeaves.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-muted-foreground italic">
                  No leave applications recorded.
                </td>
              </tr>
            ) : (
              myLeaves.map((l) => (
                <tr key={l.id} className="hover:bg-accent/5 transition-colors">
                  <td className="p-5 font-bold">{l.type}</td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{l.startDate}</span>
                        <ArrowRight size={10} className="text-muted-foreground" />
                        <span className="text-xs font-medium">{l.endDate}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground bg-accent/10 px-2 py-0.5 rounded-full w-fit">
                        {calculateDuration(l.startDate, l.endDate)} {calculateDuration(l.startDate, l.endDate) === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-xs text-muted-foreground italic truncate max-w-[200px]">
                    &quot;{l.reason}&quot;
                  </td>
                  <td className="p-5 text-right">
                    <Badge
                      variant={
                        l.status === LeaveStatus.APPROVED
                          ? 'success'
                          : l.status === LeaveStatus.REJECTED
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="px-3 uppercase text-[9px]"
                    >
                      {l.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
