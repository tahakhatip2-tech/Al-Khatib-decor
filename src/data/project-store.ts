// ============================================================
// Project Store - LocalStorage Data Management
// ============================================================

import type {
  Project, ProjectExpense, ProjectPayment, ProjectSummary,
  ProjectStatus, ExpenseCategory, PaymentMethod
} from '@/types/project';

export type { ProjectStatus, ExpenseCategory, PaymentMethod };

const KEYS = {
  PROJECTS: 'projects_list',
  EXPENSES: 'projects_expenses',
  PAYMENTS: 'projects_payments',
} as const;

function load<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') as T[]; }
  catch { return []; }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function now(): string { return new Date().toISOString(); }
function today(): string { return new Date().toISOString().split('T')[0]; }

// ── Seed Data ────────────────────────────────────────────────
const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'تشطيب فيلا عبدون الفاخرة',
    client: 'م. سامر الريماوي',
    clientPhone: '0791234500',
    location: 'عمان - عبدون',
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    budget: 45000,
    status: 'ongoing',
    progress: 65,
    description: 'تشطيب داخلي كامل: جبس، دهانات، أرضيات، وعزل',
    assignedSupervisor: 'emp-001',
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'proj-002',
    name: 'عزل وتشطيب مبنى تجاري',
    client: 'شركة الأمان العقارية',
    clientPhone: '065554321',
    location: 'عمان - الدوار السابع',
    startDate: '2024-04-15',
    budget: 28000,
    status: 'completed',
    progress: 100,
    description: 'عزل سطح + دهانات خارجية',
    createdAt: '2024-04-15T00:00:00Z',
  },
  {
    id: 'proj-003',
    name: 'ديكور مطعم - مجمع تلاع العلي',
    client: 'أبو عمر للمطاعم',
    clientPhone: '0795554321',
    location: 'عمان - تلاع العلي',
    startDate: '2024-06-01',
    budget: 18500,
    status: 'pending',
    progress: 0,
    description: 'ديكور داخلي كامل للمطعم',
    createdAt: '2024-06-01T00:00:00Z',
  },
];

const SEED_EXPENSES: ProjectExpense[] = [
  { id: 'exp-001', projectId: 'proj-001', category: 'materials', description: 'جبس بورد وملحقاته', amount: 3200, date: '2024-03-10', vendor: 'جوتنت', notes: '', recordedBy: 'emp-admin', createdAt: '2024-03-10T00:00:00Z' },
  { id: 'exp-002', projectId: 'proj-001', category: 'labor', description: 'أجور عمال جبس (أسبوع)', amount: 1800, date: '2024-03-17', recordedBy: 'emp-admin', createdAt: '2024-03-17T00:00:00Z' },
  { id: 'exp-003', projectId: 'proj-001', category: 'materials', description: 'دهانات جوتن داخلي', amount: 2500, date: '2024-04-01', vendor: 'جوتن', recordedBy: 'emp-admin', createdAt: '2024-04-01T00:00:00Z' },
  { id: 'exp-004', projectId: 'proj-002', category: 'materials', description: 'رولات بيتومين عزل', amount: 4500, date: '2024-04-20', vendor: 'ناشونال', recordedBy: 'emp-admin', createdAt: '2024-04-20T00:00:00Z' },
  { id: 'exp-005', projectId: 'proj-002', category: 'labor', description: 'أجور عمال عزل', amount: 2000, date: '2024-05-01', recordedBy: 'emp-admin', createdAt: '2024-05-01T00:00:00Z' },
];

const SEED_PAYMENTS: ProjectPayment[] = [
  { id: 'pay-001', projectId: 'proj-001', amount: 15000, date: '2024-03-01', method: 'bank', reference: 'TRF-001', notes: 'دفعة أولى - 33%', recordedBy: 'emp-admin', createdAt: '2024-03-01T00:00:00Z' },
  { id: 'pay-002', projectId: 'proj-001', amount: 12000, date: '2024-04-15', method: 'check', reference: 'CHK-552', notes: 'دفعة ثانية - منتصف المشروع', recordedBy: 'emp-admin', createdAt: '2024-04-15T00:00:00Z' },
  { id: 'pay-003', projectId: 'proj-002', amount: 14000, date: '2024-04-18', method: 'cash', notes: 'دفعة أولى نقداً', recordedBy: 'emp-admin', createdAt: '2024-04-18T00:00:00Z' },
  { id: 'pay-004', projectId: 'proj-002', amount: 14000, date: '2024-05-20', method: 'bank', notes: 'دفعة نهائية', recordedBy: 'emp-admin', createdAt: '2024-05-20T00:00:00Z' },
];

function seedIfEmpty(): void {
  if (load<Project>(KEYS.PROJECTS).length === 0) save(KEYS.PROJECTS, SEED_PROJECTS);
  if (load<ProjectExpense>(KEYS.EXPENSES).length === 0) save(KEYS.EXPENSES, SEED_EXPENSES);
  if (load<ProjectPayment>(KEYS.PAYMENTS).length === 0) save(KEYS.PAYMENTS, SEED_PAYMENTS);
}

// ── Project CRUD ──────────────────────────────────────────────
export const ProjectStore = {
  getAll(): Project[] {
    seedIfEmpty();
    return load<Project>(KEYS.PROJECTS).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  getById(id: string): Project | undefined { return this.getAll().find(p => p.id === id); },
  add(data: Omit<Project, 'id' | 'createdAt'>): Project {
    const p: Project = { ...data, id: proj-, createdAt: now() };
    save(KEYS.PROJECTS, [...this.getAll(), p]);
    return p;
  },
  update(id: string, data: Partial<Project>): Project | null {
    const all = this.getAll();
    const idx = all.findIndex(p => p.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data };
    save(KEYS.PROJECTS, all);
    return all[idx];
  },
  delete(id: string): void {
    save(KEYS.PROJECTS, this.getAll().filter(p => p.id !== id));
    save(KEYS.EXPENSES, load<ProjectExpense>(KEYS.EXPENSES).filter(e => e.projectId !== id));
    save(KEYS.PAYMENTS, load<ProjectPayment>(KEYS.PAYMENTS).filter(p => p.projectId !== id));
  },
};

// ── Expense CRUD ──────────────────────────────────────────────
export const ExpenseStore = {
  getAll(): ProjectExpense[] { seedIfEmpty(); return load<ProjectExpense>(KEYS.EXPENSES); },
  getByProject(projectId: string): ProjectExpense[] { return this.getAll().filter(e => e.projectId === projectId); },
  add(data: Omit<ProjectExpense, 'id' | 'createdAt'>): ProjectExpense {
    const e: ProjectExpense = { ...data, id: exp-, createdAt: now() };
    save(KEYS.EXPENSES, [...this.getAll(), e]);
    return e;
  },
  delete(id: string): void { save(KEYS.EXPENSES, this.getAll().filter(e => e.id !== id)); },
};

// ── Payment CRUD ──────────────────────────────────────────────
export const PaymentStore = {
  getAll(): ProjectPayment[] { seedIfEmpty(); return load<ProjectPayment>(KEYS.PAYMENTS); },
  getByProject(projectId: string): ProjectPayment[] { return this.getAll().filter(p => p.projectId === projectId); },
  add(data: Omit<ProjectPayment, 'id' | 'createdAt'>): ProjectPayment {
    const p: ProjectPayment = { ...data, id: pay-, createdAt: now() };
    save(KEYS.PAYMENTS, [...this.getAll(), p]);
    return p;
  },
  delete(id: string): void { save(KEYS.PAYMENTS, this.getAll().filter(p => p.id !== id)); },
};

// ── Summary Helper ────────────────────────────────────────────
export function getProjectSummary(projectId: string): ProjectSummary {
  const project = ProjectStore.getById(projectId)!;
  const expenses = ExpenseStore.getByProject(projectId);
  const payments = PaymentStore.getByProject(projectId);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalPayments = payments.reduce((s, p) => s + p.amount, 0);
  return {
    project,
    totalExpenses,
    totalPayments,
    balance: totalPayments - totalExpenses,
    remaining: project.budget - totalPayments,
    expenses,
    payments,
  };
}

seedIfEmpty();
