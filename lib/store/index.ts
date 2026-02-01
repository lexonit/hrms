import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  User,
  Attendance,
  LeaveRequest,
  Project,
  Task,
  KnowledgeBaseDoc,
  UserRole,
  TimesheetEntry,
  Sprint,
  Notification,
  Payroll,
} from '@/types';
import { LeaveStatus, PayrollStatus } from '@/types';
import {
  mockUsers,
  mockProjects,
  mockTasks,
  mockDocs,
  mockAttendance,
  mockLeaves,
  mockTimesheets,
  mockSprints,
  mockPayrolls,
} from '@/lib/data/mock-data';

/**
 * Application State Interface
 * Defines the complete state structure and available actions
 */
interface AppState {
  // State
  currentUser: User | null;
  users: User[];
  projects: Project[];
  tasks: Task[];
  sprints: Sprint[];
  docs: KnowledgeBaseDoc[];
  attendance: Attendance[];
  leaves: LeaveRequest[];
  timesheets: TimesheetEntry[];
  notifications: Notification[];
  payrolls: Payroll[];

  // Authentication Actions
  login: (email: string) => void;
  logout: () => void;

  // Payroll Actions
  markPayrollPaid: (id: string) => void;

  // Attendance Actions
  checkIn: (type: 'Office' | 'WFH') => void;
  checkOut: () => void;

  // Leave Actions
  requestLeave: (leave: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>) => void;
  approveLeave: (leaveId: string) => void;
  rejectLeave: (leaveId: string) => void;

  // Task Actions
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  updateTask: (taskId: string, data: Partial<Task>) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  assignTaskToSprint: (taskId: string, sprintId: string | undefined) => void;

  // Sprint Actions
  addSprint: (sprint: Omit<Sprint, 'id'>) => void;
  updateSprintStatus: (sprintId: string, status: Sprint['status']) => void;

  // Timesheet Actions
  addTimesheet: (entry: Omit<TimesheetEntry, 'id' | 'status'>) => void;
  updateTimesheet: (id: string, data: Partial<Omit<TimesheetEntry, 'id'>>) => void;
  deleteTimesheet: (id: string) => void;
  approveTimesheet: (id: string) => void;
  rejectTimesheet: (id: string) => void;

  // Document Actions
  upsertDoc: (doc: Partial<KnowledgeBaseDoc>) => void;

  // Project Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;

  // Admin Actions
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  addNotification: (userId: string, title: string, message: string) => void;
  markNotificationRead: (id: string) => void;
}

/**
 * Application Store
 * Central state management using Zustand with persistent storage
 * All state updates are immutable and follow best practices
 */
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      users: mockUsers,
      projects: mockProjects,
      tasks: mockTasks,
      sprints: mockSprints,
      docs: mockDocs,
      attendance: mockAttendance,
      leaves: mockLeaves,
      timesheets: mockTimesheets,      payrolls: mockPayrolls,      notifications: [],

      // Authentication Actions
      login: (email: string) => {
        const user = mockUsers.find((u) => u.email === email);
        if (user) {
          set({ currentUser: user });
        }
      },

      logout: () => {
        set({ currentUser: null });
      },

      markPayrollPaid: (id) => {
        set((state) => ({
          payrolls: state.payrolls.map((p) =>
            p.id === id
              ? { ...p, status: PayrollStatus.PAID, paymentDate: new Date().toISOString().split('T')[0] }
              : p
          ),
        }));
      },

  // Attendance Actions
  checkIn: (type) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const newEntry: Attendance = {
      id: Math.random().toString(36).substring(2, 11),
      userId: currentUser.id,
      date: new Date().toISOString().split('T')[0],
      checkIn: new Date().toISOString(),
      type,
    };

    set((state) => ({
      attendance: [newEntry, ...state.attendance],
    }));
  },

  checkOut: () => {
    const { currentUser, attendance } = get();
    if (!currentUser) return;

    const today = new Date().toISOString().split('T')[0];
    const todayEntry = attendance.find(
      (a) => a.userId === currentUser.id && a.date === today && !a.checkOut
    );

    if (todayEntry) {
      const checkOutTime = new Date().toISOString();
      const diffMs = new Date(checkOutTime).getTime() - new Date(todayEntry.checkIn).getTime();
      const hours = Number((diffMs / (1000 * 60 * 60)).toFixed(2));

      set((state) => ({
        attendance: state.attendance.map((a) =>
          a.id === todayEntry.id ? { ...a, checkOut: checkOutTime, totalHours: hours } : a
        ),
      }));
    }
  },

  // Leave Actions
  requestLeave: (leave) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const newLeave: LeaveRequest = {
      ...leave,
      id: Math.random().toString(36).substring(2, 11),
      userId: currentUser.id,
      status: LeaveStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      leaves: [newLeave, ...state.leaves],
    }));

    // Notify manager if exists
    if (currentUser.managerId) {
      get().addNotification(
        currentUser.managerId,
        'New Leave Request',
        `${currentUser.name} has requested ${leave.type} leave.`
      );
    }
  },

  approveLeave: (leaveId) => {
    const leave = get().leaves.find((l) => l.id === leaveId);
    if (!leave) return;

    set((state) => ({
      leaves: state.leaves.map((l) =>
        l.id === leaveId ? { ...l, status: LeaveStatus.APPROVED } : l
      ),
    }));

    get().addNotification(leave.userId, 'Leave Approved', `Your ${leave.type} leave has been approved.`);
  },

  rejectLeave: (leaveId) => {
    const leave = get().leaves.find((l) => l.id === leaveId);
    if (!leave) return;

    set((state) => ({
      leaves: state.leaves.map((l) =>
        l.id === leaveId ? { ...l, status: LeaveStatus.REJECTED } : l
      ),
    }));

    get().addNotification(leave.userId, 'Leave Rejected', `Your ${leave.type} leave has been rejected.`);
  },

  // Task Actions
  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
    }));
  },

  updateTask: (taskId, data) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...data } : t)),
    }));
  },

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substring(2, 11),
    };

    set((state) => ({
      tasks: [newTask, ...state.tasks],
    }));
  },

  assignTaskToSprint: (taskId, sprintId) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, sprintId } : t)),
    }));
  },

  // Sprint Actions
  addSprint: (sprintData) => {
    const newSprint: Sprint = {
      ...sprintData,
      id: 's-' + Math.random().toString(36).substring(2, 11),
    };

    set((state) => ({
      sprints: [...state.sprints, newSprint],
    }));
  },

  updateSprintStatus: (sprintId, status) => {
    set((state) => ({
      sprints: state.sprints.map((s) => (s.id === sprintId ? { ...s, status } : s)),
    }));
  },

  // Timesheet Actions
  addTimesheet: (entry) => {
    const newEntry: TimesheetEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 11),
      status: LeaveStatus.PENDING,
    };

    set((state) => ({
      timesheets: [newEntry, ...state.timesheets],
    }));

    const user = get().users.find((u) => u.id === entry.userId);
    if (user?.managerId) {
      get().addNotification(
        user.managerId,
        'Timesheet Submitted',
        `${user.name} submitted hours for ${entry.date}`
      );
    }
  },

  updateTimesheet: (id, data) => {
    set((state) => ({
      timesheets: state.timesheets.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  },

  deleteTimesheet: (id) => {
    set((state) => ({
      timesheets: state.timesheets.filter((t) => t.id !== id),
    }));
  },

  approveTimesheet: (id) => {
    const entry = get().timesheets.find((t) => t.id === id);
    if (!entry) return;

    set((state) => ({
      timesheets: state.timesheets.map((t) =>
        t.id === id ? { ...t, status: LeaveStatus.APPROVED } : t
      ),
    }));

    get().addNotification(
      entry.userId,
      'Timesheet Approved',
      `Your hours for ${entry.date} have been approved.`
    );
  },

  rejectTimesheet: (id) => {
    const entry = get().timesheets.find((t) => t.id === id);
    if (!entry) return;

    set((state) => ({
      timesheets: state.timesheets.map((t) =>
        t.id === id ? { ...t, status: LeaveStatus.REJECTED } : t
      ),
    }));

    get().addNotification(
      entry.userId,
      'Timesheet Rejected',
      `Your hours for ${entry.date} have been rejected.`
    );
  },

  // Document Actions
  upsertDoc: (doc) => {
    set((state) => {
      if (doc.id) {
        // Update existing document
        return {
          docs: state.docs.map((d) =>
            d.id === doc.id ? ({ ...d, ...doc, updatedAt: new Date().toISOString() } as KnowledgeBaseDoc) : d
          ),
        };
      }

      // Create new document
      const newDoc: KnowledgeBaseDoc = {
        id: Math.random().toString(36).substring(2, 11),
        title: doc.title || 'Untitled',
        content: doc.content || '',
        space: doc.space || 'General',
        authorId: state.currentUser?.id || 'unknown',
        updatedAt: new Date().toISOString(),
      };

      return {
        docs: [newDoc, ...state.docs],
      };
    });
  },

  // Project Actions
  addProject: (project) => {
    const newProject: Project = {
      ...project,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      projects: [newProject, ...state.projects],
    }));
  },

  // Admin Actions
  addUser: (user) => {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substring(2, 11),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
    };

    set((state) => ({
      users: [...state.users, newUser],
    }));
  },

  updateUser: (id, data) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
    }));
  },

  addNotification: (userId, title, message) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substring(2, 11),
      userId,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          // Get from localStorage for client-side
          if (typeof window !== 'undefined') {
            const value = localStorage.getItem(name);
            // Also sync to cookie for middleware access
            if (value) {
              document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=604800; SameSite=Lax`;
            }
            return value;
          }
          return null;
        },
        setItem: (name, value) => {
          // Set to localStorage for client-side
          if (typeof window !== 'undefined') {
            localStorage.setItem(name, value);
            // Also sync to cookie for middleware access
            document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=604800; SameSite=Lax`;
          }
        },
        removeItem: (name) => {
          // Remove from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem(name);
            // Also remove cookie
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          }
        },
      })),
      // Only persist authentication state, not all app data
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
);
