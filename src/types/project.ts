// ============================================================
// Project Management - TypeScript Types
// ============================================================

export type ProjectStatus = 'pending' | 'ongoing' | 'completed' | 'paused' | 'cancelled';
export type ExpenseCategory = 'materials' | 'labor' | 'transport' | 'equipment' | 'services' | 'other';
export type PaymentMethod = 'cash' | 'bank' | 'check' | 'transfer';

export interface Project {
  id: string;
  name: string;
  client: string;
  clientPhone?: string;
  location: string;
  startDate: string;
  endDate?: string;
  budget: number;
  status: ProjectStatus;
  progress: number;
  description?: string;
  assignedSupervisor?: string;
  createdAt: string;
}

export interface ProjectExpense {
  id: string;
  projectId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  vendor?: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export interface ProjectPayment {
  id: string;
  projectId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export interface ProjectSummary {
  project: Project;
  totalExpenses: number;
  totalPayments: number;
  balance: number;
  remaining: number;
  expenses: ProjectExpense[];
  payments: ProjectPayment[];
}
