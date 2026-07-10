import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SessionStore } from "@/data/hr-store";
import { ProjectStore, ExpenseStore, PaymentStore, getProjectSummary } from "@/data/project-store";
import type { Project, ProjectExpense, ProjectPayment, ProjectStatus, ExpenseCategory, PaymentMethod, ProjectSummary } from "@/types/project";
import { PaymentReceiptModal } from "@/components/payment-receipt";
import {
  FolderOpen, Plus, Trash2, Edit, TrendingUp, TrendingDown,
  DollarSign, CheckCircle2, Clock, PauseCircle, XCircle,
  ChevronRight, Wallet, Receipt, BarChart3, ArrowRight, X, FileText
} from "lucide-react";

const STATUS_MAP: Record<ProjectStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: "في الانتظار", color: "bg-slate-100 text-slate-600",   icon: <Clock className="w-3 h-3" /> },
  ongoing:   { label: "جاري التنفيذ", color: "bg-blue-100 text-blue-700",   icon: <TrendingUp className="w-3 h-3" /> },
  completed: { label: "مكتمل",        color: "bg-green-100 text-green-700", icon: <CheckCircle2 className="w-3 h-3" /> },
  paused:    { label: "متوقف",        color: "bg-amber-100 text-amber-700", icon: <PauseCircle className="w-3 h-3" /> },
  cancelled: { label: "ملغي",         color: "bg-red-100 text-red-700",     icon: <XCircle className="w-3 h-3" /> },
};

const EXP_CATEGORIES: Record<ExpenseCategory, string> = {
  materials: "مواد بناء",
  labor:     "عمالة",
  transport: "نقل وشحن",
  equipment: "معدات",
  services:  "خدمات",
  other:     "أخرى",
};

const PAY_METHODS: Record<PaymentMethod, string> = {
  cash: "نقداً", bank: "تحويل بنكي", check: "شيك", transfer: "حوالة",
};

export default function ProjectsMgmt() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Modals
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<ProjectPayment | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'expenses' | 'payments'>('overview');

  // Forms
  const [projForm, setProjForm] = useState<Partial<Project>>({ status: 'pending', progress: 0, budget: 0 });
  const [expForm, setExpForm] = useState<Partial<ProjectExpense>>({ category: 'materials' });
  const [payForm, setPayForm] = useState<Partial<ProjectPayment>>({ method: 'cash' });

  const today = new Date().toISOString().split('T')[0];
  const session = SessionStore.get();

  const refresh = () => setProjects(ProjectStore.getAll());

  useEffect(() => {
    if (!SessionStore.isLoggedIn()) { setLocation("/hr"); return; }
    const s = SessionStore.get();
    if (s?.role !== 'admin' && s?.role !== 'supervisor') { setLocation("/hr/dashboard"); return; }
    refresh();
  }, []);

  const summary = selectedProject ? getProjectSummary(selectedProject.id) : null;

  // --- Project actions ---
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projForm.name || !projForm.client || !projForm.location) return;
    if (projForm.id) {
      ProjectStore.update(projForm.id, projForm);
      toast({ title: "تم تحديث بيانات المشروع" });
    } else {
      const p = ProjectStore.add({
        name: projForm.name!,
        client: projForm.client!,
        clientPhone: projForm.clientPhone,
        location: projForm.location!,
        startDate: projForm.startDate || today,
        endDate: projForm.endDate,
        budget: projForm.budget || 0,
        status: projForm.status || 'pending',
        progress: projForm.progress || 0,
        description: projForm.description,
        assignedSupervisor: projForm.assignedSupervisor,
      });
      toast({ title: "تم إضافة المشروع بنجاح" });
    }
    refresh();
    setIsProjModalOpen(false);
    setProjForm({ status: 'pending', progress: 0, budget: 0 });
  };

  const handleDeleteProject = (id: string) => {
    if (!confirm("هل أنت متأكد؟ سيتم حذف المشروع ومصاريفه ودفعاته")) return;
    ProjectStore.delete(id);
    if (selectedProject?.id === id) setSelectedProject(null);
    refresh();
    toast({ title: "تم حذف المشروع" });
  };

  // --- Expense actions ---
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !expForm.description || !expForm.amount) return;
    ExpenseStore.add({
      projectId: selectedProject.id,
      category: expForm.category || 'other',
      description: expForm.description!,
      amount: expForm.amount!,
      date: expForm.date || today,
      vendor: expForm.vendor,
      notes: expForm.notes,
      recordedBy: session?.employeeId || 'emp-admin',
    });
    toast({ title: "تم تسجيل المصروف" });
    setIsExpenseModalOpen(false);
    setExpForm({ category: 'materials' });
    if (selectedProject) setSelectedProject(ProjectStore.getById(selectedProject.id) || null);
  };

  // --- Payment actions ---
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !payForm.amount) return;
    PaymentStore.add({
      projectId: selectedProject.id,
      amount: payForm.amount!,
      date: payForm.date || today,
      method: payForm.method || 'cash',
      reference: payForm.reference,
      notes: payForm.notes,
      recordedBy: session?.employeeId || 'emp-admin',
    });
    toast({ title: "تم تسجيل الدفعة" });
    setIsPaymentModalOpen(false);
    setPayForm({ method: 'cash' });
    if (selectedProject) setSelectedProject(ProjectStore.getById(selectedProject.id) || null);
  };

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const ongoingCount = projects.filter(p => p.status === 'ongoing').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      <Helmet><title>إدارة المشاريع | مؤسسة الخطيب</title></Helmet>

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-slate-900">إدارة المشاريع والمصاريف</h1>
        </div>
        <Button onClick={() => { setProjForm({ status: 'pending', progress: 0, budget: 0 }); setIsProjModalOpen(true); }} size="sm">
          <Plus className="w-4 h-4 ml-2" /> مشروع جديد
        </Button>
      </div>

      {/* Stats Row */}
      <div className="px-6 py-4 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-slate-800">{projects.length}</div>
          <div className="text-sm text-slate-500 mt-1">إجمالي المشاريع</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">{ongoingCount}</div>
          <div className="text-sm text-slate-500 mt-1">قيد التنفيذ</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <div className="text-sm text-slate-500 mt-1">مكتملة</div>
        </div>
      </div>

      {/* Main Content: List + Detail */}
      <div className="px-6 pb-8 flex gap-4">
        {/* Projects List */}
        <div className="w-80 flex-shrink-0 space-y-2">
          {projects.map(proj => {
            const s = getProjectSummary(proj.id);
            const isSelected = selectedProject?.id === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => { setSelectedProject(proj); setActiveDetailTab('overview'); }}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-primary ring-1 ring-primary/20' : 'border-slate-100'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 text-sm leading-tight">{proj.name}</h3>
                  <ArrowRight className={`w-4 h-4 flex-shrink-0 ml-2 transition-colors ${isSelected ? 'text-primary' : 'text-slate-300'}`} />
                </div>
                <p className="text-xs text-slate-500 mb-2">{proj.client} · {proj.location}</p>
                <div className="flex justify-between items-center">
                  <Badge className={`text-xs gap-1 ${STATUS_MAP[proj.status].color}`}>
                    {STATUS_MAP[proj.status].icon}{STATUS_MAP[proj.status].label}
                  </Badge>
                  <span className="text-xs font-bold text-slate-700">{proj.budget.toLocaleString()} د</span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/60 rounded-full" style={{ width: `${proj.progress}%` }} />
                </div>
              </div>
            );
          })}
          {projects.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-500 text-sm">
              لا يوجد مشاريع مسجلة
            </div>
          )}
        </div>

        {/* Project Detail Panel */}
        {selectedProject && summary ? (
          <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Detail Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-l from-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedProject.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">{selectedProject.client} — {selectedProject.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setProjForm(selectedProject); setIsProjModalOpen(true); }}>
                    <Edit className="w-3.5 h-3.5 ml-1" /> تعديل
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleDeleteProject(selectedProject.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              {/* Financial overview cards */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">الميزانية</div>
                  <div className="font-bold text-slate-800">{selectedProject.budget.toLocaleString()} د</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <div className="text-xs text-green-600 mb-1">المستلم</div>
                  <div className="font-bold text-green-700">{summary.totalPayments.toLocaleString()} د</div>
                </div>
                <div className="bg-red-50 rounded-xl p-3">
                  <div className="text-xs text-red-600 mb-1">المصاريف</div>
                  <div className="font-bold text-red-700">{summary.totalExpenses.toLocaleString()} د</div>
                </div>
                <div className={`rounded-xl p-3 ${summary.balance >= 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  <div className={`text-xs mb-1 ${summary.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>الصافي</div>
                  <div className={`font-bold ${summary.balance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {summary.balance >= 0 ? '+' : ''}{summary.balance.toLocaleString()} د
                  </div>
                </div>
              </div>
              {/* Progress */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${selectedProject.progress}%` }} />
                </div>
                <span className="text-sm font-bold text-slate-700">{selectedProject.progress}%</span>
                <Badge className={`${STATUS_MAP[selectedProject.status].color} gap-1`}>
                  {STATUS_MAP[selectedProject.status].label}
                </Badge>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              {(['overview', 'expenses', 'payments'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveDetailTab(tab)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeDetailTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  {tab === 'overview' ? 'نظرة عامة' : tab === 'expenses' ? `المصاريف (${summary.expenses.length})` : `الدفعات (${summary.payments.length})`}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-5 overflow-y-auto max-h-[50vh]">
              {/* Overview Tab */}
              {activeDetailTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-slate-500">تاريخ البداية:</span> <span className="font-medium">{selectedProject.startDate}</span></div>
                    {selectedProject.endDate && <div><span className="text-slate-500">تاريخ الانتهاء:</span> <span className="font-medium">{selectedProject.endDate}</span></div>}
                    <div><span className="text-slate-500">العميل:</span> <span className="font-medium">{selectedProject.client}</span></div>
                    {selectedProject.clientPhone && <div><span className="text-slate-500">الهاتف:</span> <span className="font-medium" dir="ltr">{selectedProject.clientPhone}</span></div>}
                    <div><span className="text-slate-500">المتبقي للتحصيل:</span> <span className="font-bold text-amber-600">{summary.remaining.toLocaleString()} دينار</span></div>
                  </div>
                  {selectedProject.description && (
                    <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">{selectedProject.description}</div>
                  )}
                </div>
              )}

              {/* Expenses Tab */}
              {activeDetailTab === 'expenses' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-slate-500">إجمالي المصاريف: <span className="font-bold text-red-600">{summary.totalExpenses.toLocaleString()} دينار</span></div>
                    <Button size="sm" onClick={() => { setExpForm({ category: 'materials', date: today }); setIsExpenseModalOpen(true); }}>
                      <Plus className="w-4 h-4 ml-1" /> إضافة مصروف
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {summary.expenses.sort((a,b) => b.date.localeCompare(a.date)).map(exp => (
                      <div key={exp.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-slate-800">{exp.description}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{EXP_CATEGORIES[exp.category]} {exp.vendor ? `· ${exp.vendor}` : ''} · {exp.date}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-red-600">{exp.amount.toLocaleString()} د</span>
                          <button onClick={() => { ExpenseStore.delete(exp.id); setSelectedProject(ProjectStore.getById(selectedProject.id) || null); }} className="text-slate-400 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {summary.expenses.length === 0 && <p className="text-center text-slate-500 py-4 text-sm">لا يوجد مصاريف مسجلة</p>}
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {activeDetailTab === 'payments' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-slate-500">إجمالي المستلم: <span className="font-bold text-green-600">{summary.totalPayments.toLocaleString()} دينار</span></div>
                    <Button size="sm" onClick={() => { setPayForm({ method: 'cash', date: today }); setIsPaymentModalOpen(true); }}>
                      <Plus className="w-4 h-4 ml-1" /> تسجيل دفعة
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {summary.payments.sort((a,b) => b.date.localeCompare(a.date)).map(pay => (
                      <div key={pay.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-slate-800">{pay.notes || 'دفعة'}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{PAY_METHODS[pay.method]} {pay.reference ? `· ${pay.reference}` : ''} · {pay.date}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-600">{pay.amount.toLocaleString()} د</span>
                          <button
                            onClick={() => { setReceiptPayment(pay); setIsReceiptOpen(true); }}
                            className="flex items-center gap-1 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg px-2 py-1 transition-colors"
                            title="طباعة سند قبض"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            سند
                          </button>
                          <button onClick={() => { PaymentStore.delete(pay.id); setSelectedProject(ProjectStore.getById(selectedProject.id) || null); }} className="text-slate-400 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {summary.payments.length === 0 && <p className="text-center text-slate-500 py-4 text-sm">لا يوجد دفعات مسجلة</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">اختر مشروعاً من القائمة لعرض تفاصيله</p>
            </div>
          </div>
        )}
      </div>

      {/* Payment Receipt Modal */}
      {isReceiptOpen && receiptPayment && selectedProject && (
        <PaymentReceiptModal
          payment={receiptPayment}
          summary={getProjectSummary(selectedProject.id)}
          onClose={() => { setIsReceiptOpen(false); setReceiptPayment(null); }}
        />
      )}
      {/* Project Modal */}
      {isProjModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold">{projForm.id ? 'تعديل المشروع' : 'إضافة مشروع جديد'}</h3>
              <button onClick={() => setIsProjModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              <form id="projForm" onSubmit={handleSaveProject} className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm text-slate-600 mb-1 block">اسم المشروع *</label>
                  <Input required value={projForm.name || ''} onChange={e => setProjForm({...projForm, name: e.target.value})} placeholder="مثال: تشطيب فيلا الياسمين" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">اسم العميل *</label>
                  <Input required value={projForm.client || ''} onChange={e => setProjForm({...projForm, client: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">هاتف العميل</label>
                  <Input dir="ltr" value={projForm.clientPhone || ''} onChange={e => setProjForm({...projForm, clientPhone: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">الموقع *</label>
                  <Input required value={projForm.location || ''} onChange={e => setProjForm({...projForm, location: e.target.value})} placeholder="عمان - الجبيهة" />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">الميزانية (دينار) *</label>
                  <Input type="number" min="0" required value={projForm.budget || ''} onChange={e => setProjForm({...projForm, budget: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">تاريخ البداية</label>
                  <Input type="date" value={projForm.startDate || ''} onChange={e => setProjForm({...projForm, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">تاريخ الانتهاء المتوقع</label>
                  <Input type="date" value={projForm.endDate || ''} onChange={e => setProjForm({...projForm, endDate: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">الحالة</label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm" value={projForm.status || 'pending'} onChange={e => setProjForm({...projForm, status: e.target.value as ProjectStatus})}>
                    {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">نسبة الإنجاز ({projForm.progress || 0}%)</label>
                  <Input type="range" min="0" max="100" value={projForm.progress || 0} onChange={e => setProjForm({...projForm, progress: Number(e.target.value)})} className="h-10" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-slate-600 mb-1 block">وصف المشروع</label>
                  <Textarea className="resize-none h-20" value={projForm.description || ''} onChange={e => setProjForm({...projForm, description: e.target.value})} />
                </div>
              </form>
            </div>
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsProjModalOpen(false)}>إلغاء</Button>
              <Button type="submit" form="projForm" className="bg-primary text-white">حفظ المشروع</Button>
            </div>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold">تسجيل مصروف</h3>
              <button onClick={() => setIsExpenseModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto">
              <form id="expForm" onSubmit={handleSaveExpense} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">نوع المصروف *</label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm" value={expForm.category || 'materials'} onChange={e => setExpForm({...expForm, category: e.target.value as ExpenseCategory})}>
                    {Object.entries(EXP_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">الوصف *</label>
                  <Input required value={expForm.description || ''} onChange={e => setExpForm({...expForm, description: e.target.value})} placeholder="مثال: جبس بورد 12.5 مم" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">المبلغ (دينار) *</label>
                    <Input type="number" min="0" required value={expForm.amount || ''} onChange={e => setExpForm({...expForm, amount: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">التاريخ</label>
                    <Input type="date" value={expForm.date || today} onChange={e => setExpForm({...expForm, date: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">المورد / الجهة</label>
                  <Input value={expForm.vendor || ''} onChange={e => setExpForm({...expForm, vendor: e.target.value})} placeholder="مثال: جوتنت، ناشونال..." />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">ملاحظات</label>
                  <Textarea className="resize-none h-16" value={expForm.notes || ''} onChange={e => setExpForm({...expForm, notes: e.target.value})} />
                </div>
              </form>
            </div>
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsExpenseModalOpen(false)}>إلغاء</Button>
              <Button type="submit" form="expForm" className="bg-red-500 text-white hover:bg-red-600">تسجيل المصروف</Button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold">تسجيل دفعة من العميل</h3>
              <button onClick={() => setIsPaymentModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto">
              <form id="payForm" onSubmit={handleSavePayment} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">المبلغ المستلم (دينار) *</label>
                    <Input type="number" min="0" required value={payForm.amount || ''} onChange={e => setPayForm({...payForm, amount: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">التاريخ</label>
                    <Input type="date" value={payForm.date || today} onChange={e => setPayForm({...payForm, date: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">طريقة الدفع *</label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm" value={payForm.method || 'cash'} onChange={e => setPayForm({...payForm, method: e.target.value as PaymentMethod})}>
                    {Object.entries(PAY_METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">رقم الإيصال / الشيك</label>
                  <Input dir="ltr" value={payForm.reference || ''} onChange={e => setPayForm({...payForm, reference: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">ملاحظات</label>
                  <Textarea className="resize-none h-16" value={payForm.notes || ''} onChange={e => setPayForm({...payForm, notes: e.target.value})} placeholder="مثال: دفعة أولى، دفعة نهائية..." />
                </div>
              </form>
            </div>
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsPaymentModalOpen(false)}>إلغاء</Button>
              <Button type="submit" form="payForm" className="bg-green-600 text-white hover:bg-green-700">تسجيل الدفعة</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
