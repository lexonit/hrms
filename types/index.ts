/**
 * User Role Enumeration
 * Defines the hierarchy and permissions structure for the application
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  HR_ADMIN = 'HR_ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

/**
 * User Interface
 * Represents a user entity in the system
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  designation: string;
  department: string;
  managerId?: string;
  avatar?: string;
  joinedDate: string;
  previousEmployment?: PreviousEmployment[];
  documents?: UserDocument[];
  phone?: string;
  address?: string;
  dob?: string;
  gender?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
}

export interface PreviousEmployment {
  companyName: string;
  designation: string;
  startDate: string;
  endDate: string;
}

export interface UserDocument {
  name: string;
  type: 'Resume' | 'Experience Letter' | 'Relieving Letter' | 'ID Proof' | 'Other';
  url: string;
  uploadedAt: string;
}

/**
 * Attendance Record Interface
 * Tracks daily attendance with check-in/check-out times
 */
export interface Attendance {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  type: 'Office' | 'WFH';
  totalHours?: number;
}

/**
 * Leave Status Enumeration
 * Workflow states for leave requests
 */
export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

/**
 * Leave Request Interface
 * Represents a leave application from an employee
 */
export interface LeaveRequest {
  id: string;
  userId: string;
  type: 'Annual' | 'Sick' | 'Casual' | 'Maternity' | 'Unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

/**
 * Sprint Interface
 * Agile sprint for project management
 */
export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Planned' | 'Active' | 'Completed';
  goal: string;
}

/**
 * Task Interface
 * Individual work item in project tracking
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;
  sprintId?: string; // Optional: tasks not in a sprint are in Backlog
}

/**
 * Project Interface
 * Top-level project container
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: string[];
  createdAt: string;
}

/**
 * Knowledge Base Document Interface
 * Internal documentation and wiki articles
 */
export interface KnowledgeBaseDoc {
  id: string;
  title: string;
  content: string;
  space: 'HR' | 'Engineering' | 'Operations' | 'General';
  authorId: string;
  updatedAt: string;
}

/**
 * Timesheet Category Type
 * Classification for time entries
 */
export type TimesheetCategory = 'Development' | 'QA/Testing' | 'DevOps' | 'Meeting' | 'Support' | 'Management';

/**
 * Timesheet Entry Interface
 * Time tracking for projects and tasks
 */
export interface TimesheetEntry {
  id: string;
  userId: string;
  projectId: string;
  taskId: string;
  date: string;
  hours: number;
  description: string;
  status: LeaveStatus;
  billable: boolean;
  category: TimesheetCategory;
}

/**
 * Notification Interface
 * System notifications for users
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

/**
 * Payroll Status Enumeration
 */
export enum PayrollStatus {
  DRAFT = 'DRAFT',
  PROCESSED = 'PROCESSED',
  PAID = 'PAID',
}

/**
 * Payroll Record Interface
 * Comprehensive payroll data following industry standards
 */
export interface Payroll {
  id: string;
  userId: string;
  month: string; // MM-YYYY
  basicSalary: number;
  allowances: {
    hra: number;
    transport: number;
    special: number;
    bonus: number;
  };
  deductions: {
    tax: number;
    pf: number;
    insurance: number;
  };
  netSalary: number;
  status: PayrollStatus;
  paymentDate?: string;
}
