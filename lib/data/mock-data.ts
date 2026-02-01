import type {
  User,
  UserRole,
  Project,
  Task,
  KnowledgeBaseDoc,
  Attendance,
  LeaveRequest,
  TimesheetEntry,
  Sprint,
  Payroll,
} from '@/types';
import { LeaveStatus, PayrollStatus } from '@/types';

/**
 * Mock Users Data
 * Represents different user roles in the system
 */
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@nexus.com',
    name: 'Super Admin',
    role: 'SUPER_ADMIN' as UserRole,
    designation: 'Chief Technology Officer',
    department: 'Executive',
    joinedDate: '2022-01-01',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: '2',
    email: 'hr@nexus.com',
    name: 'Sarah Williams',
    role: 'HR_ADMIN' as UserRole,
    designation: 'HR Director',
    department: 'People & Culture',
    joinedDate: '2022-03-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
  },
  {
    id: '3',
    email: 'manager@nexus.com',
    name: 'David Chen',
    role: 'MANAGER' as UserRole,
    designation: 'Engineering Manager',
    department: 'Technology',
    joinedDate: '2022-05-10',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
  },
  {
    id: '4',
    email: 'employee@nexus.com',
    name: 'Alex Johnson',
    role: 'EMPLOYEE' as UserRole,
    designation: 'Senior Frontend Engineer',
    department: 'Technology',
    managerId: '3',
    joinedDate: '2023-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  },
];

/**
 * Mock Sprints Data
 * Agile sprint cycles for project management
 */
export const mockSprints: Sprint[] = [
  {
    id: 's1',
    name: 'Sprint 24.1 - Foundation',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    status: 'Completed',
    goal: 'Establish core infrastructure and branding',
  },
  {
    id: 's2',
    name: 'Sprint 24.2 - Core HR Features',
    startDate: '2024-03-16',
    endDate: '2024-03-31',
    status: 'Active',
    goal: 'Deliver Attendance and Timesheet modules',
  },
];

/**
 * Mock Projects Data
 * Active projects in the organization
 */
export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Apollo Dashboard',
    description: 'Main customer dashboard revamp using Next.js 14 and advanced analytics integration.',
    ownerId: '3',
    members: ['4', '3'],
    createdAt: '2023-10-01',
  },
  {
    id: 'p2',
    name: 'YanHRM 2.0',
    description: 'Internal HRM platform development with automated payroll and leave management.',
    ownerId: '1',
    members: ['1', '2', '3', '4'],
    createdAt: '2024-01-01',
  },
];

/**
 * Mock Tasks Data
 * Work items across different projects
 */
export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Setup MongoDB Schema',
    description: 'Define models for Users, Attendance and Projects with proper indexing.',
    projectId: 'p2',
    assigneeId: '4',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-03-25',
    sprintId: 's2',
  },
  {
    id: 't2',
    title: 'Integrate Tailwind',
    description: 'Configure tailwind.config.js and establish design system guidelines.',
    projectId: 'p2',
    assigneeId: '4',
    status: 'Done',
    priority: 'Medium',
    dueDate: '2024-03-20',
    sprintId: 's1',
  },
  {
    id: 't3',
    title: 'Fix Sidebar Layout',
    description: 'Correct mobile responsiveness issues in the navigation sidebar.',
    projectId: 'p1',
    assigneeId: '4',
    status: 'Todo',
    priority: 'Urgent',
    dueDate: '2024-03-28',
    sprintId: 's2',
  },
  {
    id: 't4',
    title: 'Implement OAuth 2.0',
    description: 'Add Google and Microsoft login providers for enterprise users.',
    projectId: 'p2',
    assigneeId: '4',
    status: 'Todo',
    priority: 'High',
    dueDate: '2024-04-10',
    // This task is in Backlog (no sprintId)
  },
];

/**
 * Mock Knowledge Base Documents
 * Internal documentation and wiki
 */
export const mockDocs: KnowledgeBaseDoc[] = [
  {
    id: 'd1',
    title: 'Onboarding Guide',
    content:
      '# Welcome to YanHRM\n\nWe are glad to have you on board. Please follow these steps to set up your work environment...',
    space: 'HR',
    authorId: '2',
    updatedAt: '2024-02-10',
  },
  {
    id: 'd2',
    title: 'Code Standards',
    content:
      '# JavaScript Style Guide\n\nUse functional components, React Hooks, and strict TypeScript types. Avoid any whenever possible...',
    space: 'Engineering',
    authorId: '3',
    updatedAt: '2024-03-01',
  },
];

/**
 * Generate attendance data with current dates
 */
const today = new Date();
const todayStr = today.toISOString().split('T')[0];
const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().split('T')[0];

export const mockAttendance: Attendance[] = [
  {
    id: 'a1',
    userId: '4',
    date: yesterdayStr,
    checkIn: `${yesterdayStr}T09:00:00Z`,
    checkOut: `${yesterdayStr}T17:00:00Z`,
    type: 'Office',
    totalHours: 8,
  },
  {
    id: 'a2',
    userId: '4',
    date: todayStr,
    checkIn: `${todayStr}T08:45:00Z`,
    type: 'WFH',
  },
];

/**
 * Mock Leave Requests
 * Sample leave applications
 */
export const mockLeaves: LeaveRequest[] = [
  {
    id: 'l1',
    userId: '4',
    type: 'Annual',
    startDate: '2024-04-10',
    endDate: '2024-04-12',
    reason: 'Family trip',
    status: LeaveStatus.PENDING,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Mock Timesheet Entries
 * Time tracking records
 */
export const mockTimesheets: TimesheetEntry[] = [
  {
    id: 'ts1',
    userId: '4',
    projectId: 'p1',
    taskId: 't3',
    date: yesterdayStr,
    hours: 8,
    description: 'Worked on sidebar responsiveness and navigation components.',
    status: LeaveStatus.APPROVED,
    billable: true,
    category: 'Development',
  },
];

/**
 * Mock Payroll Data
 * Monthly payroll records
 */
export const mockPayrolls: Payroll[] = [
  {
    id: 'pr1',
    userId: '4',
    month: '03-2024',
    basicSalary: 5000,
    allowances: {
      hra: 2000,
      transport: 500,
      special: 1000,
      bonus: 0,
    },
    deductions: {
      tax: 800,
      pf: 300,
      insurance: 150,
    },
    netSalary: 7250,
    status: PayrollStatus.PAID,
    paymentDate: '2024-03-31',
  },
  {
    id: 'pr2',
    userId: '4',
    month: '04-2024',
    basicSalary: 5000,
    allowances: {
      hra: 2000,
      transport: 500,
      special: 1000,
      bonus: 500,
    },
    deductions: {
      tax: 850,
      pf: 300,
      insurance: 150,
    },
    netSalary: 7700,
    status: PayrollStatus.PROCESSED,
  },
  {
    id: 'pr3',
    userId: '1',
    month: '03-2024',
    basicSalary: 12000,
    allowances: {
      hra: 4000,
      transport: 1000,
      special: 3000,
      bonus: 2000,
    },
    deductions: {
      tax: 3500,
      pf: 1200,
      insurance: 500,
    },
    netSalary: 16800,
    status: PayrollStatus.PAID,
    paymentDate: '2024-03-31',
  },
];
