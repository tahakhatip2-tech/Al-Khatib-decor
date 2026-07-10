import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SessionStore, EmployeeStore, TaskStore, FinancialStore } from "@/data/hr-store";
import { 
  LogOut, Users, ClipboardList, Plus, UserPlus, 
  Settings, CheckCircle2, Clock, Trash2, Edit
} from "lucide-react";
import type { Employee, Task, FinancialTransaction, EmployeeRole, EmployeeDepartment, TaskPriority, FinancialTransactionType } from "@/types/hr";

export default function HRAdmin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [admin, setAdmin] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'tasks' | 'financials'>('overview');
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);

  // Modals state
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isFinModalOpen, setIsFinModalOpen] = useState(false);
  const [isFinHistoryOpen, setIsFinHistoryOpen] = useState(false);
  const [selectedEmpForFin, setSelectedEmpForFin] = useState<Employee | null>(null);
  
  // Forms state
  const [empForm, setEmpForm] = useState<Partial<Employee>>({ role: 'employee', department: 'interior', salaryType: 'monthly', salaryAmount: 0 });
  const [taskForm, setTaskForm] = useState<Partial<Task>>({ priority: 'medium', status: 'pending' });
  const [finForm, setFinForm] = useState<Partial<FinancialTransaction>>({ type: 'advance' });

  const refreshData = () => {
    setEmployees(EmployeeStore.getAll().filter(e => e.role !== 'admin')); // hide root admins
    setTasks(TaskStore.getAll().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setTransactions(FinancialStore.getAll().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  useEffect(() => {
    if (!SessionStore.isLoggedIn()) {
      setLocation("/hr");
      return;
    }
    const session = SessionStore.get();
    if (session?.role !== 'admin' && session?.role !== 'supervisor') {
      setLocation("/hr/dashboard");
      return;
    }
    
    const emp = EmployeeStore.getById(session.employeeId);
    if (emp) {
      setAdmin(emp);
      refreshData();
    }
  }, [setLocation]);

  const handleLogout = () => {
    SessionStore.clear();
    setLocation("/hr");
    toast({ title: "تم تسجيل الخروج بنجاح" });
  };

  // --- Employee Actions ---
  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.name || !empForm.username || !empForm.password) return;
    
    // Check if username exists
    if (!empForm.id && EmployeeStore.getByUsername(empForm.username)) {
      toast({ title: "خطأ", description: "اسم المستخدم موجود مسبقاً", variant: "destructive" });
      return;
    }

    if (empForm.id) {
      EmployeeStore.update(empForm.id, empForm);
      toast({ title: "تم تحديث بيانات الموظف" });
    } else {
      EmployeeStore.add({
        name: empForm.name,
        username: empForm.username,
        password: empForm.password,
        role: empForm.role as EmployeeRole,
        position: empForm.position || 'عامل',
        department: empForm.department as EmployeeDepartment,
        phone: empForm.phone || '',
        joinDate: new Date().toISOString().split('T')[0],
        isActive: true,
        salaryType: empForm.salaryType || 'monthly',
        salaryAmount: empForm.salaryAmount || 0,
      });
      toast({ title: "تم إضافة الموظف بنجاح" });
    }
    
    setIsEmpModalOpen(false);
    setEmpForm({ role: 'employee', department: 'interior', salaryType: 'monthly', salaryAmount: 0 });
    refreshData();
  };

  // --- Financial Actions ---
  const handleSaveFinancial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finForm.employeeId || !finForm.type || !finForm.amount || !admin) return;

    FinancialStore.add({
      employeeId: finForm.employeeId,
      type: finForm.type as FinancialTransactionType,
      amount: Number(finForm.amount),
      date: new Date().toISOString().split('T')[0],
      notes: finForm.notes,
      recordedBy: admin.id
    });

    toast({ title: "تم تسجيل الحركة المالية بنجاح" });
    setIsFinModalOpen(false);
    setFinForm({ type: 'advance' });
    refreshData();
  };

  // --- Task Actions ---
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title || !taskForm.assignedTo || !admin) return;

    if (taskForm.id) {
      TaskStore.update(taskForm.id, taskForm);
      toast({ title: "تم تحديث المهمة" });
    } else {
      TaskStore.add({
        title: taskForm.title,
        description: taskForm.description || '',
        assignedTo: taskForm.assignedTo,
        assignedBy: admin.id,
        project: taskForm.project || '',
        location: taskForm.location || '',
        priority: taskForm.priority as TaskPriority,
        status: 'pending',
        dueDate: taskForm.dueDate || new Date().toISOString().split('T')[0],
      });
      toast({ title: "تم إسناد المهمة بنجاح" });
    }

    setIsTaskModalOpen(false);
    setTaskForm({ priority: 'medium', status: 'pending' });
    refreshData();
  };

  if (!admin) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary selection:text-white" dir="rtl">
      <Helmet>
        <title>الإدارة | نظام الموارد البشرية</title>
      </Helmet>

      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg hidden sm:block">لوحة تحكم المدير - الموارد البشرية</h1>
            <h1 className="font-bold text-lg sm:hidden">نظام الـ HR</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-300">مرحباً، {admin.name}</div>
            <button onClick={handleLogout} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-2 space-x-reverse mb-8 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100 inline-flex">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            نظرة عامة
          </button>
          <button 
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'employees' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            إدارة الموظفين
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'tasks' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            إدارة المهام
          </button>
          <button 
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'financials' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            المالية والأجور
          </button>
        </div>

        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Users className="w-6 h-6" /></div>
                <div><div className="text-2xl font-bold text-slate-800">{employees.length}</div><div className="text-sm text-slate-500">إجمالي الموظفين</div></div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Clock className="w-6 h-6" /></div>
                <div><div className="text-2xl font-bold text-slate-800">{tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length}</div><div className="text-sm text-slate-500">مهام نشطة</div></div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 className="w-6 h-6" /></div>
                <div><div className="text-2xl font-bold text-slate-800">{tasks.filter(t => t.status === 'completed').length}</div><div className="text-sm text-slate-500">مهام منجزة</div></div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4">إجراءات سريعة</h2>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => { setEmpForm({ role: 'employee', department: 'interior' }); setIsEmpModalOpen(true); }} className="bg-secondary hover:bg-blue-900">
                  <UserPlus className="w-4 h-4 ml-2" /> إضافة موظف جديد
                </Button>
                <Button onClick={() => { setTaskForm({ priority: 'medium', status: 'pending' }); setIsTaskModalOpen(true); }} className="bg-primary hover:bg-yellow-600 text-white">
                  <Plus className="w-4 h-4 ml-2" /> إسناد مهمة جديدة
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ================= EMPLOYEES TAB ================= */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">قائمة الموظفين</h2>
              <Button onClick={() => { setEmpForm({ role: 'employee', department: 'interior' }); setIsEmpModalOpen(true); }} className="h-9">
                <UserPlus className="w-4 h-4 ml-2" /> موظف جديد
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">الاسم</th>
                    <th className="px-4 py-3 font-medium">المنصب</th>
                    <th className="px-4 py-3 font-medium">القسم</th>
                    <th className="px-4 py-3 font-medium">اسم المستخدم</th>
                    <th className="px-4 py-3 font-medium">الحالة</th>
                    <th className="px-4 py-3 font-medium text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-slate-800">{emp.name}</td>
                      <td className="px-4 py-3 text-slate-600">{emp.position}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {emp.department === 'interior' ? 'تشطيب داخلي' : emp.department === 'exterior' ? 'تشطيب خارجي' : 'صيانة'}
                      </td>
                      <td className="px-4 py-3 text-slate-500" dir="ltr">{emp.username}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={emp.isActive ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}>
                          {emp.isActive ? 'نشط' : 'موقوف'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 flex justify-center gap-2">
                        <button onClick={() => { setEmpForm(emp); setIsEmpModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"><Edit className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">لا يوجد موظفين مسجلين</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TASKS TAB ================= */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">سجل المهام</h2>
              <Button onClick={() => { setTaskForm({ priority: 'medium', status: 'pending' }); setIsTaskModalOpen(true); }} className="h-9">
                <Plus className="w-4 h-4 ml-2" /> مهمة جديدة
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">المهمة</th>
                    <th className="px-4 py-3 font-medium">الموظف المسؤول</th>
                    <th className="px-4 py-3 font-medium">الأولوية</th>
                    <th className="px-4 py-3 font-medium">الحالة</th>
                    <th className="px-4 py-3 font-medium">تاريخ التسليم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.map(task => {
                    const emp = EmployeeStore.getById(task.assignedTo);
                    return (
                      <tr key={task.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800">{task.title}</div>
                          {task.project && <div className="text-xs text-slate-500">{task.project}</div>}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-700">{emp?.name || 'غير معروف'}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={
                            task.priority === 'urgent' ? 'bg-red-50 text-red-600 border-red-200' :
                            task.priority === 'high' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                          }>
                            {task.priority === 'urgent' ? 'عاجل' : task.priority === 'high' ? 'عالي' : 'متوسط'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={
                            task.status === 'completed' ? 'bg-green-50 text-green-600 border-green-200' :
                            task.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            'bg-yellow-50 text-yellow-600 border-yellow-200'
                          }>
                            {task.status === 'completed' ? 'مكتملة' : task.status === 'in_progress' ? 'قيد التنفيذ' : 'بالانتظار'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{task.dueDate}</td>
                      </tr>
                    );
                  })}
                  {tasks.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">لا يوجد مهام</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= FINANCIALS TAB ================= */}
        {activeTab === 'financials' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">السجل المالي والأجور</h2>
              <Button onClick={() => { setFinForm({ type: 'advance' }); setIsFinModalOpen(true); }} className="h-9">
                <Plus className="w-4 h-4 ml-2" /> تسجيل حركة مالية
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">الموظف</th>
                    <th className="px-4 py-3 font-medium">الراتب الأساسي</th>
                    <th className="px-4 py-3 font-medium">إجمالي السلف</th>
                    <th className="px-4 py-3 font-medium">إجمالي الخصومات</th>
                    <th className="px-4 py-3 font-medium">إجمالي المكافآت</th>
                    <th className="px-4 py-3 font-medium text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map(emp => {
                    const empTrans = transactions.filter(t => t.employeeId === emp.id);
                    const advances = empTrans.filter(t => t.type === 'advance').reduce((sum, t) => sum + t.amount, 0);
                    const deductions = empTrans.filter(t => t.type === 'deduction').reduce((sum, t) => sum + t.amount, 0);
                    const bonuses = empTrans.filter(t => t.type === 'bonus').reduce((sum, t) => sum + t.amount, 0);
                    
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-800">{emp.name}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {emp.salaryAmount} دينار ({emp.salaryType === 'monthly' ? 'شهري' : 'يومي'})
                        </td>
                        <td className="px-4 py-3 text-red-500 font-medium">{advances} دينار</td>
                        <td className="px-4 py-3 text-red-500 font-medium">{deductions} دينار</td>
                        <td className="px-4 py-3 text-green-500 font-medium">{bonuses} دينار</td>
                        <td className="px-4 py-3 flex justify-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            setSelectedEmpForFin(emp);
                            setIsFinHistoryOpen(true);
                          }}>
                            عرض الكشف
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {employees.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">لا يوجد موظفين مسجلين</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* --- Employee Modal --- */}
      {isEmpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold">{empForm.id ? 'تعديل موظف' : 'إضافة موظف جديد'}</h3>
              <button onClick={() => setIsEmpModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <form id="empForm" onSubmit={handleSaveEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">الاسم الكامل *</label>
                    <Input required value={empForm.name || ''} onChange={e => setEmpForm({...empForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">المسمى الوظيفي</label>
                    <Input placeholder="مثال: فني دهانات" value={empForm.position || ''} onChange={e => setEmpForm({...empForm, position: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">اسم المستخدم للدخول *</label>
                    <Input dir="ltr" required value={empForm.username || ''} onChange={e => setEmpForm({...empForm, username: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">كلمة المرور *</label>
                    <Input dir="ltr" type="text" required value={empForm.password || ''} onChange={e => setEmpForm({...empForm, password: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">القسم</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                      value={empForm.department} 
                      onChange={e => setEmpForm({...empForm, department: e.target.value as any})}
                    >
                      <option value="interior">تشطيب داخلي</option>
                      <option value="exterior">أعمال خارجية</option>
                      <option value="maintenance">صيانة عامة</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">الصلاحية</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                      value={empForm.role} 
                      onChange={e => setEmpForm({...empForm, role: e.target.value as any})}
                    >
                      <option value="employee">موظف (عامل/فني)</option>
                      <option value="supervisor">مشرف</option>
                    </select>
                  </div>
                  <div className="col-span-2 pt-2 border-t mt-2">
                    <h4 className="text-sm font-bold text-slate-800 mb-2">البيانات المالية</h4>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">نوع الراتب *</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                      value={empForm.salaryType || 'monthly'} 
                      onChange={e => setEmpForm({...empForm, salaryType: e.target.value as any})}
                    >
                      <option value="monthly">راتب شهري</option>
                      <option value="daily">يومية (مياومة)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">قيمة الراتب / اليومية (دينار) *</label>
                    <Input type="number" min="0" required value={empForm.salaryAmount || ''} onChange={e => setEmpForm({...empForm, salaryAmount: Number(e.target.value)})} />
                  </div>
                </div>
              </form>
            </div>
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEmpModalOpen(false)}>إلغاء</Button>
              <Button type="submit" form="empForm" className="bg-primary text-white">حفظ الموظف</Button>
            </div>
          </div>
        </div>
      )}

      {/* --- Task Modal --- */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold">{taskForm.id ? 'تعديل المهمة' : 'إسناد مهمة جديدة'}</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <form id="taskForm" onSubmit={handleSaveTask} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">عنوان المهمة *</label>
                  <Input required value={taskForm.title || ''} onChange={e => setTaskForm({...taskForm, title: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">الموظف المسؤول *</label>
                  <select 
                    required
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                    value={taskForm.assignedTo || ''} 
                    onChange={e => setTaskForm({...taskForm, assignedTo: e.target.value})}
                  >
                    <option value="" disabled>-- اختر الموظف --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.position})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">المشروع المرتبط</label>
                    <Input placeholder="مثال: فيلا الياسمين" value={taskForm.project || ''} onChange={e => setTaskForm({...taskForm, project: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">الموقع</label>
                    <Input placeholder="عمان - الجبيهة" value={taskForm.location || ''} onChange={e => setTaskForm({...taskForm, location: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">الأولوية</label>
                    <select 
                      className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                      value={taskForm.priority || 'medium'} 
                      onChange={e => setTaskForm({...taskForm, priority: e.target.value as any})}
                    >
                      <option value="low">منخفضة</option>
                      <option value="medium">متوسطة</option>
                      <option value="high">عالية</option>
                      <option value="urgent">عاجلة جداً</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">تاريخ التسليم</label>
                    <Input type="date" required value={taskForm.dueDate || ''} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">تفاصيل المهمة</label>
                  <Textarea className="resize-none h-20" value={taskForm.description || ''} onChange={e => setTaskForm({...taskForm, description: e.target.value})} />
                </div>
              </form>
            </div>
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsTaskModalOpen(false)}>إلغاء</Button>
              <Button type="submit" form="taskForm" className="bg-primary text-white">حفظ المهمة</Button>
            </div>
          </div>
        </div>
      )}

      {/* --- Financial Modal --- */}
      {isFinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold">تسجيل حركة مالية</h3>
              <button onClick={() => setIsFinModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <form id="finForm" onSubmit={handleSaveFinancial} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">الموظف *</label>
                  <select 
                    required
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                    value={finForm.employeeId || ''} 
                    onChange={e => setFinForm({...finForm, employeeId: e.target.value})}
                  >
                    <option value="" disabled>-- اختر الموظف --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">نوع الحركة *</label>
                  <select 
                    required
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                    value={finForm.type || 'advance'} 
                    onChange={e => setFinForm({...finForm, type: e.target.value as any})}
                  >
                    <option value="advance">سلفة</option>
                    <option value="deduction">خصم</option>
                    <option value="bonus">مكافأة</option>
                    <option value="salary_payment">تسليم راتب / يومية</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">القيمة (دينار) *</label>
                  <Input type="number" min="0" required value={finForm.amount || ''} onChange={e => setFinForm({...finForm, amount: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">ملاحظات والتفاصيل</label>
                  <Textarea className="resize-none h-20" value={finForm.notes || ''} onChange={e => setFinForm({...finForm, notes: e.target.value})} />
                </div>
              </form>
            </div>
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFinModalOpen(false)}>إلغاء</Button>
              <Button type="submit" form="finForm" className="bg-primary text-white">حفظ العملية</Button>
            </div>
          </div>
        </div>
      )}

      {/* --- Financial History Modal --- */}
      {isFinHistoryOpen && selectedEmpForFin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold">الكشف المالي: {selectedEmpForFin.name}</h3>
              <button onClick={() => setIsFinHistoryOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <div className="text-xs text-slate-500">الراتب الأساسي</div>
                  <div className="font-bold text-slate-800">{selectedEmpForFin.salaryAmount} دينار ({selectedEmpForFin.salaryType === 'monthly' ? 'شهري' : 'يومي'})</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">مجموع السلف</div>
                  <div className="font-bold text-red-600">{transactions.filter(t => t.employeeId === selectedEmpForFin.id && t.type === 'advance').reduce((s, t) => s + t.amount, 0)} دينار</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">مجموع الخصومات</div>
                  <div className="font-bold text-red-600">{transactions.filter(t => t.employeeId === selectedEmpForFin.id && t.type === 'deduction').reduce((s, t) => s + t.amount, 0)} دينار</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">مجموع المكافآت</div>
                  <div className="font-bold text-green-600">{transactions.filter(t => t.employeeId === selectedEmpForFin.id && t.type === 'bonus').reduce((s, t) => s + t.amount, 0)} دينار</div>
                </div>
              </div>
              
              <h4 className="font-bold text-slate-800 mb-3 text-sm">سجل الحركات</h4>
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">التاريخ</th>
                    <th className="px-4 py-2 font-medium">النوع</th>
                    <th className="px-4 py-2 font-medium">القيمة</th>
                    <th className="px-4 py-2 font-medium">التفاصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.filter(t => t.employeeId === selectedEmpForFin.id).map(t => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2 text-slate-600">{t.date}</td>
                      <td className="px-4 py-2">
                        <Badge variant="outline" className={
                          t.type === 'advance' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          t.type === 'deduction' ? 'bg-red-50 text-red-600 border-red-200' :
                          t.type === 'bonus' ? 'bg-green-50 text-green-600 border-green-200' :
                          'bg-blue-50 text-blue-600 border-blue-200'
                        }>
                          {t.type === 'advance' ? 'سلفة' : t.type === 'deduction' ? 'خصم' : t.type === 'bonus' ? 'مكافأة' : 'تسليم راتب'}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 font-bold text-slate-800">{t.amount} دينار</td>
                      <td className="px-4 py-2 text-slate-500">{t.notes || '-'}</td>
                    </tr>
                  ))}
                  {transactions.filter(t => t.employeeId === selectedEmpForFin.id).length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-4 text-center text-slate-500">لا يوجد حركات مسجلة</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
