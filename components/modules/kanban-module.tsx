'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Card, Badge, Button, Avatar } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task, User } from '@/types';
import {
  Search,
  Clock,
  ChevronDown,
  X,
  Check,
  UserCircle,
  Package,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

/**
 * AssigneeDropdown Component
 * Advanced dropdown with search, grouping, and visual feedback
 */
interface AssigneeDropdownProps {
  currentId: string;
  onSelect: (id: string) => void;
  users: User[];
  sprintMemberIds?: string[];
}

const AssigneeDropdown: React.FC<AssigneeDropdownProps> = ({
  currentId,
  onSelect,
  users,
  sprintMemberIds = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const current = users.find((u) => u.id === currentId);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Grouping logic
  const sprintTeam = useMemo(
    () => users.filter((u) => sprintMemberIds.includes(u.id)),
    [users, sprintMemberIds]
  );
  const others = useMemo(
    () => users.filter((u) => !sprintMemberIds.includes(u.id)),
    [users, sprintMemberIds]
  );

  const filterList = (list: User[]) =>
    list.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredSprintTeam = filterList(sprintTeam);
  const filteredOthers = filterList(others);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1 hover:bg-accent/50 p-1.5 rounded-lg transition-colors group border border-transparent hover:border-accent"
      >
        <div className="relative w-5 h-5">
          <Avatar
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${current?.name || currentId}`}
            alt={current?.name || 'User'}
            fallback={current?.name || 'U'}
            size={20}
            className="rounded-full border border-card shadow-sm"
          />
        </div>
        <ChevronDown size={10} className="text-muted-foreground group-hover:text-foreground" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-72 bg-card border rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] z-[999] py-0 flex flex-col max-h-[400px] overflow-hidden"
          >
            {/* Header with Search */}
            <div className="p-4 bg-accent/5 border-b sticky top-0 bg-card z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                  <UserCircle size={12} /> Assign To
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={14}
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search name or dept..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="w-full h-10 pl-10 pr-3 text-sm bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-1">
              {/* Sprint Team Section */}
              {filteredSprintTeam.length > 0 && (
                <div className="mb-2">
                  <p className="px-3 py-1.5 text-[9px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                    <svg
                      width={10}
                      height={10}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Sprint Team
                  </p>
                  {filteredSprintTeam.map((u) => (
                    <UserItem
                      key={u.id}
                      user={u}
                      isCurrent={u.id === currentId}
                      onSelect={() => {
                        onSelect(u.id);
                        setIsOpen(false);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Others Section */}
              {filteredOthers.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                    General Directory
                  </p>
                  {filteredOthers.map((u) => (
                    <UserItem
                      key={u.id}
                      user={u}
                      isCurrent={u.id === currentId}
                      onSelect={() => {
                        onSelect(u.id);
                        setIsOpen(false);
                      }}
                    />
                  ))}
                </div>
              )}

              {filteredSprintTeam.length === 0 && filteredOthers.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-xs text-muted-foreground italic">No matching members found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * User Item Component
 */
interface UserItemProps {
  user: User;
  isCurrent: boolean;
  onSelect: () => void;
}

const UserItem: React.FC<UserItemProps> = ({ user, isCurrent, onSelect }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onSelect();
    }}
    className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs hover:bg-primary/5 rounded-lg transition-all text-left group/item ${
      isCurrent ? 'bg-primary/10 font-bold' : ''
    }`}
  >
    <div className="relative flex-shrink-0">
      <Avatar
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
        alt={user.name}
        fallback={user.name}
        size={32}
        className="rounded-full border border-card shadow-sm"
      />
      {isCurrent && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full border-2 border-card flex items-center justify-center">
          <Check size={8} className="text-white" />
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="truncate font-bold text-foreground group-hover/item:text-primary transition-colors">
        {user.name}
      </p>
      <p className="text-[9px] text-muted-foreground truncate uppercase font-medium">
        {user.designation}
      </p>
    </div>
  </button>
);

/**
 * Kanban Module Component
 * Full-featured agile board with sprint planning, backlog, and multiple views
 */
export const KanbanModule: React.FC = () => {
  const { tasks, projects, users, sprints, updateTaskStatus, updateTask, assignTaskToSprint } =
    useStore();
  const [view, setView] = useState<'Board' | 'List' | 'Backlog' | 'Planning'>('Board');
  const [activeSprintId, setActiveSprintId] = useState<string>(
    sprints.find((s) => s.status === 'Active')?.id || sprints[0]?.id
  );
  const [filterUserIds, setFilterUserIds] = useState<string[]>([]);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const columns: Task['status'][] = ['Todo', 'In Progress', 'Review', 'Done'];

  const rawActiveSprintTasks = useMemo(
    () => tasks.filter((t) => t.sprintId === activeSprintId),
    [tasks, activeSprintId]
  );

  // Apply Filter based on selected Team members
  const activeSprintTasks = useMemo(() => {
    if (filterUserIds.length === 0) return rawActiveSprintTasks;
    return rawActiveSprintTasks.filter((t) => filterUserIds.includes(t.assigneeId));
  }, [rawActiveSprintTasks, filterUserIds]);

  const backlogTasks = tasks.filter((t) => !t.sprintId);

  const workingTeam = useMemo(() => {
    const ids = new Set(rawActiveSprintTasks.map((t) => t.assigneeId));
    return users.filter((u) => ids.has(u.id));
  }, [rawActiveSprintTasks, users]);

  const sprintMemberIds = useMemo(() => workingTeam.map((u) => u.id), [workingTeam]);

  const toggleUserFilter = (userId: string) => {
    setFilterUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDropToColumn = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) updateTaskStatus(taskId, status);
    setDragOverColumn(null);
    setDraggedTaskId(null);
  };

  const handleDropToSprint = (e: React.DragEvent, sprintId: string | undefined) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) assignTaskToSprint(taskId, sprintId);
    setDraggedTaskId(null);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <header className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Agile Workflow</h2>
            <div className="flex bg-accent/20 p-1 rounded-xl mt-2">
              {(['Board', 'List', 'Backlog', 'Planning'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    view === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="h-10 rounded-xl border px-3 text-xs font-bold bg-card"
              value={activeSprintId}
              onChange={(e) => setActiveSprintId(e.target.value)}
            >
              {sprints.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(view === 'Board' || view === 'List') && (
          <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-2xl shadow-sm gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2 px-1 flex items-center gap-2">
                  <UserCheck size={10} /> Filter by Team
                </span>
                <div className="flex items-center gap-1">
                  {workingTeam.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => toggleUserFilter(u.id)}
                      className={`relative group transition-all p-0.5 rounded-full ${
                        filterUserIds.includes(u.id)
                          ? 'ring-2 ring-primary ring-offset-1 bg-primary/20'
                          : 'hover:scale-110'
                      }`}
                      title={u.name}
                    >
                      <Avatar
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                        alt={u.name}
                        fallback={u.name}
                        size={32}
                        className="rounded-full border-2 border-card shadow-sm"
                      />
                      {filterUserIds.includes(u.id) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border border-card flex items-center justify-center text-[6px] text-white">
                          <Check size={6} />
                        </div>
                      )}
                    </button>
                  ))}
                  {workingTeam.length > 0 && (
                    <Button
                      variant="ghost"
                      className="h-8 text-[9px] font-bold uppercase tracking-widest ml-2"
                      onClick={() => setFilterUserIds([])}
                    >
                      Reset
                    </Button>
                  )}
                  {workingTeam.length === 0 && (
                    <span className="text-xs text-muted-foreground italic ml-2">
                      No assignees yet
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right self-end md:self-center">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1 block">
                Sprint Delivery
              </span>
              <p className="text-sm font-black text-primary">
                {activeSprintTasks.filter((t) => t.status === 'Done').length} /{' '}
                {activeSprintTasks.length} Done
              </p>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'Board' ? (
            <motion.div
              key="board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex space-x-4 overflow-x-auto pb-6 scrollbar-thin"
            >
              {columns.map((status) => (
                <div
                  key={status}
                  className={`flex-1 min-w-[320px] flex flex-col space-y-4 rounded-xl p-2 transition-colors overflow-visible ${
                    dragOverColumn === status
                      ? 'bg-primary/5 border-2 border-dashed border-primary'
                      : 'bg-accent/5'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverColumn(status);
                  }}
                  onDragLeave={() => setDragOverColumn(null)}
                  onDrop={(e) => handleDropToColumn(e, status)}
                >
                  <div className="flex items-center justify-between px-3 py-2 bg-card border rounded-lg shadow-sm">
                    <span className="text-xs font-bold uppercase flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          status === 'Done'
                            ? 'bg-green-500'
                            : status === 'In Progress'
                            ? 'bg-blue-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      {status}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {activeSprintTasks.filter((t) => t.status === status).length}
                    </Badge>
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto pr-1 overflow-x-visible">
                    {activeSprintTasks
                      .filter((t) => t.status === status)
                      .map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={() => setDraggedTaskId(null)}
                          className={draggedTaskId === task.id ? 'opacity-40 z-0' : 'z-10'}
                        >
                          <Card className="p-4 bg-card border shadow-sm group/card relative hover:shadow-md transition-shadow !overflow-visible">
                            <div className="flex justify-between items-start mb-2">
                              <Badge
                                variant={task.priority === 'Urgent' ? 'destructive' : 'secondary'}
                                className="text-[9px] uppercase font-bold"
                              >
                                {task.priority}
                              </Badge>
                              <AssigneeDropdown
                                users={users}
                                currentId={task.assigneeId}
                                sprintMemberIds={sprintMemberIds}
                                onSelect={(id) => updateTask(task.id, { assigneeId: id })}
                              />
                            </div>
                            <h4 className="font-bold text-sm mb-1 leading-tight">{task.title}</h4>
                            <p className="text-[10px] text-muted-foreground line-clamp-2 mb-3">
                              {task.description}
                            </p>
                            <div className="flex justify-between items-center text-[8px] font-black uppercase text-muted-foreground border-t pt-2 mt-auto">
                              <span className="truncate max-w-[120px]">
                                {projects.find((p) => p.id === task.projectId)?.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={10} /> {task.dueDate}
                              </span>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : view === 'List' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col space-y-4"
            >
              <Card className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-accent/5 border-b sticky top-0 bg-card z-10 shadow-sm">
                      <tr>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                          Task Details
                        </th>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                          Status
                        </th>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-muted-foreground text-center">
                          Assignee
                        </th>
                        <th className="p-4 text-[10px] uppercase font-black tracking-widest text-muted-foreground text-right">
                          Project
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {activeSprintTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-accent/5 transition-colors group">
                          <td className="p-4">
                            <p className="font-bold text-sm leading-none mb-1">{task.title}</p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                              {task.description}
                            </p>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant={task.status === 'Done' ? 'success' : 'outline'}
                              className="text-[10px] font-black"
                            >
                              {task.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-3">
                              <AssigneeDropdown
                                users={users}
                                currentId={task.assigneeId}
                                sprintMemberIds={sprintMemberIds}
                                onSelect={(id) => updateTask(task.id, { assigneeId: id })}
                              />
                              <span className="text-xs font-bold w-32 truncate">
                                {users.find((u) => u.id === task.assigneeId)?.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <span className="text-[10px] font-black text-primary uppercase">
                              {projects.find((p) => p.id === task.projectId)?.name}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          ) : view === 'Backlog' ? (
            <motion.div
              key="backlog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full"
            >
              <Card className="p-0 overflow-hidden flex flex-col h-full">
                <div className="p-4 bg-accent/5 border-b flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Package size={18} className="text-muted-foreground" />
                    <h3 className="font-bold">Product Backlog Inventory</h3>
                  </div>
                  <Badge variant="outline" className="font-black px-3">
                    {backlogTasks.length} Items
                  </Badge>
                </div>
                <div className="p-4 space-y-2 overflow-y-auto flex-1">
                  {backlogTasks.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground italic">
                      Backlog is empty. Everything is planned!
                    </div>
                  ) : (
                    backlogTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 border rounded-xl flex justify-between items-center bg-card hover:border-primary transition-all group !overflow-visible"
                      >
                        <div>
                          <p className="font-bold text-sm leading-none mb-1">{task.title}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black opacity-50">
                            {projects.find((p) => p.id === task.projectId)?.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="text-[9px] font-black uppercase">
                            {task.priority}
                          </Badge>
                          <AssigneeDropdown
                            users={users}
                            currentId={task.assigneeId}
                            sprintMemberIds={sprintMemberIds}
                            onSelect={(id) => updateTask(task.id, { assigneeId: id })}
                          />
                          <Button
                            variant="outline"
                            className="h-8 text-[10px] font-black uppercase tracking-widest"
                            onClick={() => setView('Planning')}
                          >
                            Plan <ArrowRight size={10} className="ml-1" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="planning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col md:flex-row gap-6"
            >
              <div
                className="flex-1 bg-accent/5 rounded-2xl p-6 border overflow-hidden flex flex-col"
                onDrop={(e) => handleDropToSprint(e, undefined)}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Unplanned Backlog
                  </h3>
                  <Badge variant="secondary" className="font-black">
                    {backlogTasks.length}
                  </Badge>
                </div>
                <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                  {backlogTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="p-4 bg-card border rounded-xl cursor-grab shadow-sm hover:shadow-md transition-all active:scale-95 active:cursor-grabbing"
                    >
                      <p className="text-sm font-bold leading-tight">{task.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 truncate uppercase font-black opacity-50">
                        {projects.find((p) => p.id === task.projectId)?.name}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div
                className="flex-1 bg-primary/5 rounded-2xl p-6 border border-primary/10 overflow-hidden flex flex-col"
                onDrop={(e) => handleDropToSprint(e, activeSprintId)}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-primary">
                    Sprint Scope: {sprints.find((s) => s.id === activeSprintId)?.name}
                  </h3>
                  <Badge className="bg-primary font-black">{activeSprintTasks.length}</Badge>
                </div>
                <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                  {activeSprintTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="p-4 bg-card border-l-4 border-l-primary rounded-xl cursor-grab shadow-sm hover:shadow-md transition-all overflow-visible"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold flex-1 pr-4 leading-tight">{task.title}</p>
                        <AssigneeDropdown
                          users={users}
                          currentId={task.assigneeId}
                          sprintMemberIds={sprintMemberIds}
                          onSelect={(id) => updateTask(task.id, { assigneeId: id })}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                            users.find((u) => u.id === task.assigneeId)?.name || 'User'
                          }`}
                          alt="User"
                          fallback={users.find((u) => u.id === task.assigneeId)?.name || 'U'}
                          size={20}
                          className="rounded-full border border-card"
                        />
                        <span className="text-[9px] font-black text-muted-foreground uppercase">
                          {task.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  {activeSprintTasks.length === 0 && (
                    <div className="py-20 text-center text-xs text-muted-foreground italic border-2 border-dashed border-primary/20 rounded-2xl">
                      Drag tasks here to assign to sprint
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
