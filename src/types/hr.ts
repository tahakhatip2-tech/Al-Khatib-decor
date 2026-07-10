// ============================================================
// HR System - TypeScript Types
// مؤسسة الخطيب للمقاولات - نظام إدارة الموظفين
// ============================================================

export type EmployeeRole = 'admin' | 'supervisor' | 'employee';
export type EmployeeDepartment = 'interior' | 'exterior' | 'maintenance' | 'management';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'holiday';

export interface Employee {
  id: string;
  name: string;
  username: string;
  password: string;
  role: EmployeeRole;
  position: string;        // المنصب: نجار، دهان، بنّاء، مشرف...
  department: EmployeeDepartment;
  phone: string;
  joinDate: string;        // ISO date string
  isActive: boolean;
  salaryType?: 'monthly' | 'daily'; // نوع الراتب
  salaryAmount?: number;            // قيمة الراتب أو الأجرة اليومية
  avatar?: string;         // initials color hex
  notes?: string;
  createdAt: string;
}

export type FinancialTransactionType = 'advance' | 'bonus' | 'deduction' | 'salary_payment';

export interface FinancialTransaction {
  id: string;
  employeeId: string;
  type: FinancialTransactionType;
  amount: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  recordedBy: string; // admin id
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;      // employee id
  assignedBy: string;      // admin/supervisor id
  project?: string;        // project name
  location?: string;       // موقع العمل
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;         // ISO date string
  createdAt: string;
  completedAt?: string;
  employeeNotes?: string;  // ملاحظات الموظف
  adminNotes?: string;     // ملاحظات المدير
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;            // YYYY-MM-DD
  checkIn?: string;        // HH:MM
  checkOut?: string;       // HH:MM
  status: AttendanceStatus;
  notes?: string;
}

export interface MonthlyReport {
  id: string;
  employeeId: string;
  month: string;           // YYYY-MM
  tasksCompleted: number;
  tasksTotal: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  performanceScore: number; // 0-100
  managerNotes?: string;
  generatedAt: string;
}

export interface HRSession {
  employeeId: string;
  role: EmployeeRole;
  name: string;
  loginAt: string;
  expiresAt: string;
}
