'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Card, Button, Input } from '@/components/ui';
import { Plus, Calendar, CalendarDays, ChevronLeft, ChevronRight, Save, Trash2 } from 'lucide-react';
import { TimesheetEntry } from '@/types';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, parseISO } from 'date-fns';

type ViewMode = 'week' | 'month';

/**
 * Timesheet Grid Component
 * Editable grid for bulk timesheet updates
 */
const TimesheetGrid: React.FC<{
  viewMode: ViewMode;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  entries: TimesheetEntry[];
  projects: any[];
  onSave: (rows: any[]) => void;
}> = ({ viewMode, currentDate, onDateChange, entries, projects, onSave }) => {
  const [rows, setRows] = useState<any[]>([]);

  // Calculate headers based on view mode
  const headers = useMemo(() => {
    const days = [];
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
      for (let i = 0; i < 7; i++) {
        days.push(addDays(start, i));
      }
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      let day = start;
      while (day <= end) {
        days.push(day);
        day = addDays(day, 1);
      }
    }
    return days;
  }, [viewMode, currentDate]);

  // Initialize rows from entries
  useEffect(() => {
    // Group entries by Project + Description + Category + Billable
    const groups: Record<string, any> = {};
    
    entries.forEach(entry => {
      const key = `${entry.projectId}-${entry.description}-${entry.category}-${entry.billable}`;
      if (!groups[key]) {
        groups[key] = {
          id: Math.random().toString(36).substring(7), // Temp ID for UI key
          projectId: entry.projectId,
          description: entry.description,
          category: entry.category,
          billable: entry.billable,
          entries: {}, // Ensure this is initialized
          isNew: false
        };
      }
      
      // Map date to hours and entry ID
      // Normalize date string to avoid timezone issues
      const dateStr = entry.date.split('T')[0];
      groups[key].entries[dateStr] = {
        hours: entry.hours,
        id: entry.id
      };
    });

    const initialRows = Object.values(groups);
    if (initialRows.length === 0) {
      // Add one empty row if no entries
      initialRows.push({
        id: Math.random().toString(36).substring(7),
        projectId: projects[0]?.id || '',
        description: '',
        category: 'Development',
        billable: true,
        entries: {},
        isNew: true
      });
    }
    setRows(initialRows);
  }, [entries, projects]); // Re-run when entries change (e.g. week change)

  const handleCellChange = (rowId: string, dateStr: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) && value !== '') return;
    
    setRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      return {
        ...row,
        entries: {
          ...row.entries,
          [dateStr]: { 
            ...row.entries[dateStr], 
            hours: value === '' ? 0 : numValue 
          }
        }
      };
    }));
  };

  const addRow = () => {
    setRows(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      projectId: projects[0]?.id || '',
      description: '',
      category: 'Development',
      billable: true,
      entries: {},
      isNew: true
    }]);
  };

  const deleteRow = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
    // Note: Actual deletion handling on save needs to consider this
    // For now, this just removes from UI, but consistent "Save" logic will handle it
    // Wait, if I delete a row from UI that had persistent entries, "Save" won't see them
    // and thus won't update them. They will remain.
    // Logic needs to be: calculate Diff between Original Entries in this View Range and Current Rows.
    // If an original ID is not in the final rows (or has 0 hours), delete it.
  };

  const handleSave = () => {
    onSave(rows);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-accent/5 p-4 rounded-xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => onDateChange(addDays(currentDate, viewMode === 'week' ? -7 : -30))}>
            <ChevronLeft size={20} />
          </Button>
          <div className="font-bold text-lg">
            {viewMode === 'week' ? (
              `${format(headers[0], 'MMM d')} - ${format(headers[headers.length-1], 'MMM d, yyyy')}`
            ) : (
              format(currentDate, 'MMMM yyyy')
            )}
          </div>
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => onDateChange(addDays(currentDate, viewMode === 'week' ? 7 : 30))}>
            <ChevronRight size={20} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={addRow} variant="outline" className="gap-2">
             <Plus size={16} /> Add Row
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-xl shadow-sm bg-background">
        <table className="w-full text-sm border-collapse min-w-[max-content]">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="p-3 text-left min-w-[200px] sticky left-0 bg-muted/50 z-10 border-r">Project / Task</th>
              {headers.map(date => (
                <th key={date.toISOString()} className="p-2 text-center w-[80px] min-w-[80px] border-r">
                  <div className="font-semibold">{format(date, 'EEE')}</div>
                  <div className="text-xs text-muted-foreground">{format(date, 'd')}</div>
                </th>
              ))}
              <th className="p-3 w-[50px]"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className="border-b hover:bg-muted/5 group">
                <td className="p-3 sticky left-0 bg-background z-10 border-r group-hover:bg-muted/5">
                  <div className="space-y-2">
                    <select
                      className="w-full h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                      value={row.projectId}
                      onChange={(e) => setRows(prev => prev.map(r => r.id === row.id ? { ...r, projectId: e.target.value } : r))}
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <Input 
                      className="h-8 text-xs" 
                      placeholder="Task Description..."
                      value={row.description}
                      onChange={(e) => setRows(prev => prev.map(r => r.id === row.id ? { ...r, description: e.target.value } : r))}
                    />
                  </div>
                </td>
                {headers.map(date => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const hours = row.entries[dateStr]?.hours || 0;
                  return (
                    <td key={dateStr} className="p-1 border-r text-center">
                      <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        className={cn(
                          "w-full h-10 text-center rounded-md border border-transparent hover:border-input focus:border-primary focus:ring-1 focus:ring-primary bg-transparent text-sm transition-all",
                          hours > 0 && "font-bold text-primary bg-primary/5"
                        )}
                        value={hours || ''}
                        onChange={(e) => handleCellChange(row.id, dateStr, e.target.value)}
                      />
                    </td>
                  );
                })}
                <td className="p-2 text-center">
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-0"
                    onClick={() => deleteRow(row.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
             <tr className="bg-muted/20 font-bold">
              <td className="p-3 sticky left-0 bg-muted/20 border-r text-right">Total</td>
              {headers.map(date => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const total = rows.reduce((sum, row) => sum + (row.entries[dateStr]?.hours || 0), 0);
                return (
                  <td key={dateStr} className="p-2 text-center text-primary border-r">
                    {total > 0 ? total : '-'}
                  </td>
                );
              })}
              <td></td>
             </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

/**
 * Timesheet Module Component
 */
export const TimesheetModule: React.FC = () => {
  const { currentUser, timesheets, projects, addTimesheet, updateTimesheet, deleteTimesheet } = useStore();
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter entries for current view range
  const filteredEntries = useMemo(() => {
    let start, end;
    if (viewMode === 'week') {
      start = startOfWeek(currentDate, { weekStartsOn: 1 });
      end = addDays(start, 6);
    } else {
      start = startOfMonth(currentDate);
      end = endOfMonth(currentDate);
    }
    // Normalize time
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);

    return timesheets.filter(t => {
      if (t.userId !== currentUser?.id) return false;
      const tDate = parseISO(t.date);
      return tDate >= start && tDate <= end;
    });
  }, [timesheets, currentDate, viewMode, currentUser]);

  const handleGridSave = (rows: any[]) => {
    // 1. Identify all original entry IDs in the current view
    const originalIds = new Set(filteredEntries.map(e => e.id));
    const processedIds = new Set<string>();

    // 2. Process all cells in all rows
    rows.forEach(row => {
      Object.entries(row.entries).forEach(([dateStr, data]: [string, any]) => {
        const hours = Number(data.hours);
        const entryId = data.id;

        if (entryId) {
          processedIds.add(entryId);
          if (hours > 0) {
            // Update
             updateTimesheet(entryId, {
               hours,
               projectId: row.projectId,
               description: row.description,
               category: row.category,
               billable: row.billable
             });
          } else {
             // Delete (hours cleared)
             deleteTimesheet(entryId);
          }
        } else if (hours > 0) {
          // Create New
          addTimesheet({
            userId: currentUser?.id || '',
            projectId: row.projectId,
            taskId: '',
            date: dateStr,
            hours,
            description: row.description,
            billable: row.billable,
            category: row.category
          });
        }
      });
    });

    // 3. Delete any original entries that were not present in the submitted rows
    // (This happens if a whole row was deleted)
    originalIds.forEach(id => {
      if (!processedIds.has(id)) {
        deleteTimesheet(id);
      }
    });

    // Provide feedback?
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Technical Timesheet</h2>
          <p className="text-sm text-muted-foreground mt-1">
             Manage your time entries via the grid below
          </p>
        </div>
        <div className="bg-accent/10 p-1 rounded-xl flex gap-1">
          <Button
            variant={viewMode === 'week' ? 'primary' : 'ghost'}
            onClick={() => { setViewMode('week'); setCurrentDate(new Date()); }}
            className="rounded-lg gap-2"
          >
            <Calendar size={16} /> Week View
          </Button>
          <Button
            variant={viewMode === 'month' ? 'primary' : 'ghost'}
            onClick={() => { setViewMode('month'); setCurrentDate(new Date()); }}
            className="rounded-lg gap-2"
          >
            <CalendarDays size={16} /> Month View
          </Button>
        </div>
      </div>

      <Card className="p-6 border-2 border-dashed shadow-sm">
        <TimesheetGrid
          viewMode={viewMode}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          entries={filteredEntries}
          projects={projects}
          onSave={handleGridSave}
        />
      </Card>
    </div>
  );
};