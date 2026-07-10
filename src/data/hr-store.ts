// ============================================================
// HR Store - LocalStorage Data Management
// مؤسسة الخطيب للمقاولات - إدارة بيانات الموظفين
// ============================================================

import type {
  Employee, Task, AttendanceRecord, MonthlyReport, HRSession,
  EmployeeRole, EmployeeDepartment, TaskPriority, TaskStatus,
  FinancialTransaction, FinancialTransactionType
} from '@/types/hr';

// ── Storage Keys ────────────────────────────────────────────
const KEYS = {
  EMPLOYEES: 'hr_employees',
  TASKS: 'hr_tasks',
  ATTENDANCE: 'hr_attendance',
  REPORTS: 'hr_reports',
  SESSION: 'hr_session',
  FINANCIALS: 'hr_financials',
} as const;

// ── Helpers ──────────────────────────────────────────────────
function load<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]') as T[];
  } catch { return []; }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function now(): string {
  return new Date().toISOString();
}

// ── Seed Data ────────────────────────────────────────────────
const SEED_EMPLOYEES: Employee[] = [
  {
    id: 'emp-admin',
    name: 'طه الخطيب',
    username: 'admin',
    password: 'admd@1982',
    role: 'admin',
    position: 'مدير عام',
    department: 'management',
    phone: '0782633162',
    joinDate: '2020-01-01',
    isActive: true,
    salaryType: 'monthly',
    salaryAmount: 1500,
    createdAt: '2020-01-01T00:00:00Z',
  },
  {
    id: 'emp-001',
    name: 'محمد العمر',
    username: 'm.alomar',
    password: '1234',
    role: 'supervisor',
    position: 'مشرف داخلي',
    department: 'interior',
    phone: '0791234567',
    joinDate: '2021-03-15',
    isActive: true,
    salaryType: 'monthly',
    salaryAmount: 800,
    createdAt: '2021-03-15T00:00:00Z',
  },
  {
    id: 'emp-002',
    name: 'خالد النمر',
    username: 'k.alnamir',
    password: '1234',
    role: 'employee',
    position: 'فني دهانات',
    department: 'interior',
    phone: '0799876543',
    joinDate: '2022-06-01',
    isActive: true,
    salaryType: 'daily',
    salaryAmount: 25,
    createdAt: '2022-06-01T00:00:00Z',
  },
  {
    id: 'emp-003',
    name: 'أحمد سالم',
    username: 'a.salem',
    password: '1234',
    role: 'employee',
    position: 'فني جبس',
    department: 'interior',
    phone: '0795551234',
    joinDate: '2022-09-10',
    isActive: true,
    salaryType: 'daily',
    salaryAmount: 30,
    createdAt: '2022-09-10T00:00:00Z',
  },
  {
    id: 'emp-004',
    name: 'ياسر قاسم',
    username: 'y.qasem',
    password: '1234',
    role: 'employee',
    position: 'فني عزل',
    department: 'exterior',
    phone: '0798765432',
    joinDate: '2023-01-20',
    isActive: true,
    salaryType: 'monthly',
    salaryAmount: 600,
    createdAt: '2023-01-20T00:00:00Z',
  },
];

const SEED_TASKS: Task[] = [
  {
    id: 'task-001',
    title: 'دهان شقة - شارع الجامعة',
    description: 'دهان كامل لشقة مساحتها 150م² بالدهانات الداخلية السادة مع تجهيز الجدران',
    assignedTo: 'emp-002',
    assignedBy: 'emp-admin',
    project: 'مشروع الجامعة السكني',
    location: 'عمان - شارع الجامعة',
    priority: 'high',
    status: 'in_progress',
    dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'task-002',
    title: 'تركيب جبس أسقف - فيلا عبدون',
    description: 'تنفيذ أسقف جبسية بورد بتصاميم عصرية مع إضاءة مخفية LED في الصالة والغرف',
    assignedTo: 'emp-003',
    assignedBy: 'emp-admin',
    project: 'فيلا عبدون الفاخرة',
    location: 'عمان - عبدون',
    priority: 'urgent',
    status: 'pending',
    dueDate: new Date(Date.now() + 1 * 24 * 3600 * 1000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'task-003',
    title: 'عزل سطح - بناء تجاري',
    description: 'عزل مائي وحراري لسطح مبنى تجاري مساحته 300م² باستخدام رولات البيتومين',
    assignedTo: 'emp-004',
    assignedBy: 'emp-001',
    project: 'المبنى التجاري - الدوار السابع',
    location: 'عمان - الدوار السابع',
    priority: 'medium',
    status: 'completed',
    dueDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
    completedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    employeeNotes: 'تم الإنجاز قبل الموعد المحدد بيوم كامل',
  },
  {
    id: 'task-004',
    title: 'تنظيف موقع وترتيب المواد',
    description: 'تنظيف موقع العمل في فيلا عبدون وترتيب وتصنيف المواد تحضيراً للمرحلة التالية',
    assignedTo: 'emp-002',
    assignedBy: 'emp-001',
    priority: 'low',
    status: 'pending',
    dueDate: today(),
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
];



// ── Employee CRUD ─────────────────────────────────────────────
export const EmployeeStore = {
  getAll(): Employee[] {
    seedIfEmpty();
    return load<Employee>(KEYS.EMPLOYEES);
  },
  getById(id: string): Employee | undefined {
    return this.getAll().find(e => e.id === id);
  },
  getByUsername(username: string): Employee | undefined {
    return this.getAll().find(e => e.username === username);
  },
  add(data: Omit<Employee, 'id' | 'createdAt'>): Employee {
    const emp: Employee = {
      ...data,
      id: uid(),
      createdAt: now(),
      salaryType: data.salaryType || 'monthly',
      salaryAmount: data.salaryAmount || 0,
    };
    const all = this.getAll();
    save(KEYS.EMPLOYEES, [...all, emp]);
    return emp;
  },
  update(id: string, data: Partial<Employee>): Employee | null {
    const all = this.getAll();
    const idx = all.findIndex(e => e.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data };
    save(KEYS.EMPLOYEES, all);
    return all[idx];
  },
  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(e => e.id !== id);
    save(KEYS.EMPLOYEES, filtered);
    return filtered.length < all.length;
  },
  login(username: string, password: string): Employee | null {
    const emp = this.getByUsername(username);
    if (emp && emp.password === password && emp.isActive) return emp;
    return null;
  },
};

// ── Task CRUD ─────────────────────────────────────────────────
export const TaskStore = {
  getAll(): Task[] {
    seedIfEmpty();
    return load<Task>(KEYS.TASKS);
  },
  getById(id: string): Task | undefined {
    return this.getAll().find(t => t.id === id);
  },
  getByEmployee(employeeId: string): Task[] {
    return this.getAll().filter(t => t.assignedTo === employeeId);
  },
  add(data: Omit<Task, 'id' | 'createdAt'>): Task {
    const task: Task = { ...data, id: uid(), createdAt: now() };
    save(KEYS.TASKS, [...this.getAll(), task]);
    return task;
  },
  update(id: string, data: Partial<Task>): Task | null {
    const all = this.getAll();
    const idx = all.findIndex(t => t.id === id);
    if (idx === -1) return null;
    if (data.status === 'completed' && !all[idx].completedAt) {
      data.completedAt = now();
    }
    all[idx] = { ...all[idx], ...data };
    save(KEYS.TASKS, all);
    return all[idx];
  },
  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(t => t.id !== id);
    save(KEYS.TASKS, filtered);
    return filtered.length < all.length;
  },
};

// ── Attendance CRUD ───────────────────────────────────────────
export const AttendanceStore = {
  getAll(): AttendanceRecord[] {
    return load<AttendanceRecord>(KEYS.ATTENDANCE);
  },
  getByEmployee(employeeId: string): AttendanceRecord[] {
    return this.getAll().filter(a => a.employeeId === employeeId);
  },
  getByDate(date: string): AttendanceRecord[] {
    return this.getAll().filter(a => a.date === date);
  },
  upsert(employeeId: string, date: string, data: Partial<AttendanceRecord>): AttendanceRecord {
    const all = this.getAll();
    const idx = all.findIndex(a => a.employeeId === employeeId && a.date === date);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...data };
      save(KEYS.ATTENDANCE, all);
      return all[idx];
    }
    const record: AttendanceRecord = {
      id: uid(),
      employeeId,
      date,
      status: 'present',
      ...data,
    };
    save(KEYS.ATTENDANCE, [...all, record]);
    return record;
  },
  getMonthSummary(employeeId: string, month: string) {
    const records = this.getByEmployee(employeeId).filter(a => a.date.startsWith(month));
    return {
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      leave: records.filter(r => r.status === 'leave').length,
      total: records.length,
    };
  },
};

// ── Reports ───────────────────────────────────────────────────
export const ReportStore = {
  getAll(): MonthlyReport[] {
    return load<MonthlyReport>(KEYS.REPORTS);
  },
  getByEmployee(employeeId: string): MonthlyReport[] {
    return this.getAll().filter(r => r.employeeId === employeeId);
  },
  generate(employeeId: string, month: string): MonthlyReport {
    const tasks = TaskStore.getAll().filter(
      t => t.assignedTo === employeeId && t.createdAt.startsWith(month)
    );
    const attendance = AttendanceStore.getMonthSummary(employeeId, month);
    const completed = tasks.filter(t => t.status === 'completed').length;
    const total = tasks.length;
    const taskScore = total > 0 ? Math.round((completed / total) * 60) : 0;
    const attendanceScore = attendance.total > 0
      ? Math.round((attendance.present / Math.max(attendance.total, 22)) * 40)
      : 40;
    const performanceScore = Math.min(100, taskScore + attendanceScore);

    const report: MonthlyReport = {
      id: uid(),
      employeeId,
      month,
      tasksCompleted: completed,
      tasksTotal: total,
      presentDays: attendance.present,
      absentDays: attendance.absent,
      lateDays: attendance.late,
      performanceScore,
      generatedAt: now(),
    };
    const all = this.getAll();
    const existing = all.findIndex(r => r.employeeId === employeeId && r.month === month);
    if (existing !== -1) { all[existing] = report; save(KEYS.REPORTS, all); }
    else { save(KEYS.REPORTS, [...all, report]); }
    return report;
  },
};

// ── Session ───────────────────────────────────────────────────
export const SessionStore = {
  get(): HRSession | null {
    try {
      const s = JSON.parse(localStorage.getItem(KEYS.SESSION) || 'null') as HRSession | null;
      if (!s) return null;
      if (new Date(s.expiresAt) < new Date()) { this.clear(); return null; }
      return s;
    } catch { return null; }
  },
  set(employee: Employee): HRSession {
    const session: HRSession = {
      employeeId: employee.id,
      role: employee.role,
      name: employee.name,
      loginAt: now(),
      expiresAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(), // 12h
    };
    localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
    return session;
  },
  clear(): void {
    localStorage.removeItem(KEYS.SESSION);
  },
  isLoggedIn(): boolean {
    return this.get() !== null;
  },
};

function seedIfEmpty(): void {
  if (load<Employee>(KEYS.EMPLOYEES).length === 0) {
    save(KEYS.EMPLOYEES, SEED_EMPLOYEES);
  } else {
    // Migration: Add salary fields to existing employees if missing
    const emps = load<Employee>(KEYS.EMPLOYEES);
    let updated = false;
    emps.forEach(emp => {
      if (!emp.salaryType) {
        emp.salaryType = 'monthly';
        emp.salaryAmount = 0;
        updated = true;
      }
    });
    if (updated) {
      save(KEYS.EMPLOYEES, emps);
    }
  }

  if (load<Task>(KEYS.TASKS).length === 0) {
    save(KEYS.TASKS, SEED_TASKS);
  }

  if (!localStorage.getItem(KEYS.FINANCIALS)) {
    save(KEYS.FINANCIALS, []);
  }
}

export const FinancialStore = {
  getAll(): FinancialTransaction[] {
    return load<FinancialTransaction>(KEYS.FINANCIALS);
  },
  getByEmployee(empId: string): FinancialTransaction[] {
    return this.getAll().filter(t => t.employeeId === empId);
  },
  add(data: Omit<FinancialTransaction, 'id' | 'createdAt'>): FinancialTransaction {
    const transaction: FinancialTransaction = {
      ...data,
      id: `fin-${uid()}`,
      createdAt: now()
    };
    const all = this.getAll();
    save(KEYS.FINANCIALS, [...all, transaction]);
    return transaction;
  },
  delete(id: string): void {
    save(KEYS.FINANCIALS, this.getAll().filter(t => t.id !== id));
  }
};

// Initialize seed data on import
seedIfEmpty();
