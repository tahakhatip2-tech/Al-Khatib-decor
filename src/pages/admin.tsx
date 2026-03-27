import React, { useState, Component } from "react";
import { Layout } from "@/components/layout";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, Briefcase, Building, MessageSquare, Plus, Trash2, Edit, 
  Loader2, LogIn, ShieldCheck, Eye, EyeOff, LogOut, X, Save, Star, CheckCircle, XCircle
} from "lucide-react";

// ===========================
// Auth Section
// ===========================
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admd@1982";
const AUTH_KEY = "alkhatib_admin_auth";

function isAuthenticated(): boolean {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return false;
    const { expiry } = JSON.parse(stored);
    return Date.now() < expiry;
  } catch { return false; }
}

function storeAuth() {
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  localStorage.setItem(AUTH_KEY, JSON.stringify({ expiry }));
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

// ===========================
// Types
// ===========================
interface Service {
  id: number; title: string; description: string; category: string;
  icon?: string; images: string[]; features: string[];
  isActive: boolean; sortOrder: number;
}
interface Project {
  id: number; title: string; description: string; category: string;
  location?: string; completionDate?: string; area?: string;
  images: string[]; features: string[]; isActive: boolean; isFeatured: boolean; sortOrder: number;
}
interface Inquiry {
  id: number; customerName: string; customerPhone: string;
  customerEmail?: string; serviceType: string; serviceTitle?: string;
  message: string; status: string; createdAt: string;
}

// ===========================
// Modal Component
// ===========================
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ===========================
// Login Page
// ===========================
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise(r => setTimeout(r, 800)); // simulate auth

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      storeAuth();
      toast({ title: "مرحباً بك! تم تسجيل الدخول بنجاح ✓" });
      onLogin();
    } else {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex w-20 h-20 bg-primary/20 rounded-full items-center justify-center mb-4 ring-2 ring-primary/40">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white">لوحة التحكم</h1>
          <p className="text-slate-400 mt-2">مؤسسة الخطيب للمقاولات</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label className="text-slate-200 mb-2 block">البريد الإلكتروني</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-primary h-12"
              />
            </div>
            <div>
              <Label className="text-slate-200 mb-2 block">كلمة المرور</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-primary h-12 pl-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/20 text-red-300 p-3 rounded-lg text-sm">
                <XCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-yellow-600 text-white font-bold text-base rounded-xl mt-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : <LogIn className="w-5 h-5 ml-2" />}
              {isLoading ? "جاري التحقق..." : "تسجيل الدخول"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ===========================
// Service Form
// ===========================
function ServiceForm({ service, onSave, onClose }: { service?: Service; onSave: (data: Partial<Service>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: service?.title || "",
    description: service?.description || "",
    category: service?.category || "interior",
    icon: service?.icon || "Paintbrush",
    images: service?.images || [""],
    isActive: service?.isActive ?? true,
    sortOrder: service?.sortOrder ?? 0,
  });

  const handleImageChange = (idx: number, val: string) => {
    const newImages = [...form.images];
    newImages[idx] = val;
    setForm(p => ({ ...p, images: newImages }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (form.images.length >= 5) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setForm(p => {
            if (p.images.length >= 5) return p;
            const newArray = p.images.filter(x => x !== ""); // Remove empty placeholders
            return { ...p, images: [...newArray, ev.target!.result as string].slice(0, 5) };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImageField = (idx: number) => {
    setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, images: form.images.filter(x => x !== ""), features: service?.features || [] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block text-slate-700">العنوان *</Label>
          <Input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} required className="h-10" />
        </div>
        <div>
          <Label className="mb-1.5 block text-slate-700">القسم *</Label>
          <select value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}
            className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="interior">داخلي</option>
            <option value="exterior">خارجي</option>
            <option value="maintenance">صيانة</option>
          </select>
        </div>
      </div>
      <div>
        <Label className="mb-1.5 block text-slate-700">الوصف *</Label>
        <Textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} required rows={3} />
      </div>

      <div className="space-y-3">
        <Label className="block text-slate-700">صور الخدمة (حد أقصى 5)</Label>
        
        {/* Thumbnails */}
        <div className="flex flex-wrap gap-3">
          {form.images.filter(Boolean).map((img, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group bg-slate-100 flex items-center justify-center">
              <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => removeImageField(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {form.images.filter(Boolean).length < 5 && (
            <Label className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary cursor-pointer transition-colors">
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-[10px]">إضافة صورة</span>
              <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
            </Label>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
        <Switch checked={form.isActive} onCheckedChange={val => setForm(p => ({...p, isActive: val}))} id="svc-active" />
        <Label htmlFor="svc-active" className="cursor-pointer">الخدمة مفعّلة</Label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1 bg-primary text-white h-10">
          <Save className="w-4 h-4 ml-2" /> حفظ
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-10">إلغاء</Button>
      </div>
    </form>
  );
}

// ===========================
// Project Form
// ===========================
function ProjectForm({ project, onSave, onClose }: { project?: Project; onSave: (data: Partial<Project>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    category: project?.category || "سكني",
    location: project?.location || "",
    completionDate: project?.completionDate || "",
    area: project?.area || "",
    images: project?.images?.length ? project.images : (project as any)?.gallery?.length ? (project as any).gallery : [""],
    isActive: project?.isActive ?? true,
    isFeatured: project?.isFeatured ?? false,
    sortOrder: project?.sortOrder ?? 0,
  });

  const handleImageChange = (idx: number, val: string) => {
    const newImages = [...form.images];
    newImages[idx] = val;
    setForm(p => ({ ...p, images: newImages }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (form.images.length >= 5) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setForm(p => {
            if (p.images.length >= 5) return p;
            const newArray = p.images.filter((x: string) => x !== ""); // Remove empty placeholders
            return { ...p, images: [...newArray, ev.target!.result as string].slice(0, 5) };
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImageField = (idx: number) => {
    setForm(p => ({ ...p, images: p.images.filter((_: string, i: number) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, images: form.images.filter((x: string) => x !== ""), features: project?.features || [] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block text-slate-700">العنوان *</Label>
          <Input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} required className="h-10" />
        </div>
        <div>
          <Label className="mb-1.5 block text-slate-700">التصنيف *</Label>
          <Input value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))} required className="h-10" />
        </div>
      </div>
      <div>
        <Label className="mb-1.5 block text-slate-700">الوصف *</Label>
        <Textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} required rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-1.5 block text-slate-700">الموقع</Label>
          <Input value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))} className="h-10" />
        </div>
        <div>
          <Label className="mb-1.5 block text-slate-700">المساحة</Label>
          <Input value={form.area} onChange={e => setForm(p => ({...p, area: e.target.value}))} className="h-10" />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="block text-slate-700">صور المشروع (حد أقصى 5)</Label>
        
        {/* Thumbnails */}
        <div className="flex flex-wrap gap-3">
          {form.images.filter(Boolean).map((img: string, idx: number) => (
            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 group bg-slate-100 flex items-center justify-center">
              <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => removeImageField(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {form.images.filter(Boolean).length < 5 && (
            <Label className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:text-primary cursor-pointer transition-colors">
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-[10px]">إضافة صورة</span>
              <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
            </Label>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <Switch checked={form.isActive} onCheckedChange={val => setForm(p => ({...p, isActive: val}))} id="proj-active" />
          <Label htmlFor="proj-active" className="cursor-pointer text-sm">مفعّل</Label>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <Switch checked={form.isFeatured} onCheckedChange={val => setForm(p => ({...p, isFeatured: val}))} id="proj-feat" />
          <Label htmlFor="proj-feat" className="cursor-pointer text-sm">مميّز</Label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1 bg-primary text-white h-10">
          <Save className="w-4 h-4 ml-2" /> حفظ
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-10">إلغاء</Button>
      </div>
    </form>
  );
}

// ===========================
// Stats Card
// ===========================
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <p className="text-4xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

// ===========================
// Error Boundary
// ===========================
class AdminErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50" dir="rtl">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100 max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">حدث خطأ في لوحة التحكم</h2>
            <p className="text-slate-500 text-sm mb-4">{this.state.error?.message || "خطأ غير متوقع"}</p>
            <button 
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-600"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ===========================
// Main Dashboard
// ===========================
function AdminInner() {
  const { toast } = useToast();
  const [authed, setAuthed] = useState(isAuthenticated);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data state — local for now (no backend required)
  const [services, setServices] = useState<Service[]>([
    { id: 1, title: "الجبس والديكور الداخلي", description: "تصاميم جبسية احترافية وتشطيبات داخلية فاخرة", category: "interior", icon: "LayoutTemplate", images: [], features: ["تصاميم عصرية", "ألوان متنوعة"], isActive: true, sortOrder: 1 },
    { id: 2, title: "الدهانات", description: "دهانات داخلية وخارجية بأجود الأنواع", category: "interior", icon: "Paintbrush", images: [], features: ["ألوان كمبيوتر", "ثبات طويل"], isActive: true, sortOrder: 2 },
    { id: 3, title: "جلي البلاط والرخام", description: "إعادة اللمعان والحيوية لأرضياتك", category: "interior", icon: "Diamond", images: [], features: ["جلي كريستال", "تلميع"], isActive: true, sortOrder: 3 },
    { id: 4, title: "صيانة وترميم الأبنية", description: "صيانة شاملة وترميم متخصص للمباني", category: "maintenance", icon: "HardHat", images: [], features: ["تدعيم إنشائي", "تجديد شامل"], isActive: true, sortOrder: 4 },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { id: 1, title: "فيلا فاخرة - حي الرابية", description: "تنفيذ كامل للتشطيبات الداخلية والخارجية", category: "سكني", location: "عمان، الرابية", completionDate: "2024-03-01", area: "450 م²", images: [], features: ["تشطيبات فاخرة"], isActive: true, isFeatured: true, sortOrder: 1 },
    { id: 2, title: "برج تجاري - وسط البلد", description: "تصميم وتنفيذ مكاتب عصرية", category: "تجاري", location: "عمان", completionDate: "2023-11-15", area: "1200 م²", images: [], features: ["مساحات مفتوحة"], isActive: true, isFeatured: true, sortOrder: 2 },
    { id: 3, title: "مجمع سكني - الجبيهة", description: "دهانات خارجية وعزل مائي", category: "سكني", location: "عمان، الجبيهة", completionDate: "2023-09-10", area: "2500 م²", images: [], features: ["عزل مائي"], isActive: true, isFeatured: false, sortOrder: 3 },
  ]);

  const [inquiries, setInquiries] = useState<Inquiry[]>([
    { id: 1, customerName: "أحمد محمد", customerPhone: "0791234567", serviceType: "interior", serviceTitle: "الجبس والديكور", message: "أريد تصميم غرفة معيشة جديدة", status: "new", createdAt: new Date().toISOString() },
    { id: 2, customerName: "فاطمة علي", customerPhone: "0789876543", serviceType: "maintenance", serviceTitle: "صيانة الأبنية", message: "صيانة عامة لفيلا سكنية", status: "new", createdAt: new Date(Date.now() - 86400000).toISOString() },
  ]);

  // Modals
  const [serviceModal, setServiceModal] = useState<{ open: boolean; data?: Service }>({ open: false });
  const [projectModal, setProjectModal] = useState<{ open: boolean; data?: Project }>({ open: false });

  let nextId = Date.now();

  // Service CRUD
  const saveService = (form: Partial<Service>) => {
    if (serviceModal.data) {
      setServices(prev => prev.map(s => s.id === serviceModal.data!.id ? { ...s, ...form } as Service : s));
      toast({ title: "✓ تم تعديل الخدمة بنجاح" });
    } else {
      setServices(prev => [...prev, { ...form, id: ++nextId } as Service]);
      toast({ title: "✓ تم إضافة الخدمة بنجاح" });
    }
    setServiceModal({ open: false });
  };

  const deleteService = (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    setServices(prev => prev.filter(s => s.id !== id));
    toast({ title: "تم الحذف بنجاح" });
  };

  // Project CRUD
  const saveProject = (form: Partial<Project>) => {
    if (projectModal.data) {
      setProjects(prev => prev.map(p => p.id === projectModal.data!.id ? { ...p, ...form } as Project : p));
      toast({ title: "✓ تم تعديل المشروع بنجاح" });
    } else {
      setProjects(prev => [...prev, { ...form, id: ++nextId } as Project]);
      toast({ title: "✓ تم إضافة المشروع بنجاح" });
    }
    setProjectModal({ open: false });
  };

  const deleteProject = (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;
    setProjects(prev => prev.filter(p => p.id !== id));
    toast({ title: "تم الحذف بنجاح" });
  };

  const handleLogout = () => {
    clearAuth();
    setAuthed(false);
    toast({ title: "تم تسجيل الخروج بنجاح" });
  };

  if (!authed) {
    return <LoginPage onLogin={() => setAuthed(true)} />;
  }

  const NAV_ITEMS = [
    { id: "dashboard", icon: LayoutDashboard, label: "الرئيسية", count: undefined },
    { id: "services",  icon: Briefcase,       label: "الخدمات",  count: services.length },
    { id: "projects",  icon: Building,        label: "المشاريع", count: projects.length },
    { id: "inquiries", icon: MessageSquare,   label: "الاستفسارات", count: inquiries.length },
  ];

  return (
    <Layout>
      <Helmet>
        <title>لوحة التحكم | مؤسسة الخطيب للمقاولات</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex min-h-[calc(100vh-140px)] bg-slate-50" dir="rtl">

        {/* Sidebar - Desktop */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl hidden md:flex">
          {/* Brand */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">لوحة التحكم</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right group ${
                  activeTab === item.id
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="flex-1 font-medium text-sm">{item.label}</span>
                {item.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === item.id ? "bg-white/20 text-white" : "bg-slate-700 text-slate-300"
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </aside>

        {/* Mobile Top Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-xs transition-colors ${
                activeTab === item.id ? "text-primary" : "text-slate-400"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-auto pb-24 md:pb-8">

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">نظرة عامة</h1>
                  <p className="text-slate-500 mt-1">مرحباً، أدمن الخطيب</p>
                </div>
                <div className="text-sm text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-xl">
                  {new Date().toLocaleDateString('ar-JO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={Briefcase} label="إجمالي الخدمات" value={services.length} color="bg-blue-100 text-blue-600" />
                <StatCard icon={Building} label="إجمالي المشاريع" value={projects.length} color="bg-green-100 text-green-600" />
                <StatCard icon={MessageSquare} label="الاستفسارات" value={inquiries.length} color="bg-yellow-100 text-yellow-600" />
                <StatCard icon={Star} label="المشاريع المميزة" value={projects.filter(p => p.isFeatured).length} color="bg-yellow-100 text-yellow-600" />
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">الإجراءات السريعة</h2>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => { setActiveTab("services"); setTimeout(() => setServiceModal({ open: true }), 100); }}
                    className="bg-blue-600 text-white hover:bg-blue-700">
                    <Plus className="w-4 h-4 ml-2" /> إضافة خدمة
                  </Button>
                  <Button onClick={() => { setActiveTab("projects"); setTimeout(() => setProjectModal({ open: true }), 100); }}
                    className="bg-green-600 text-white hover:bg-green-700">
                    <Plus className="w-4 h-4 ml-2" /> إضافة مشروع
                  </Button>
                  <Button onClick={() => setActiveTab("inquiries")} variant="outline">
                    <MessageSquare className="w-4 h-4 ml-2" /> عرض الاستفسارات
                  </Button>
                </div>
              </div>

              {/* Recent Inquiries */}
              {inquiries.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">آخر الاستفسارات</h2>
                  <div className="space-y-3">
                    {inquiries.slice(0, 3).map(inq => (
                      <div key={inq.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold shrink-0">
                          {inq.customerName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm">{inq.customerName}</p>
                          <p className="text-xs text-slate-500 truncate">{inq.message}</p>
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">{new Date(inq.createdAt).toLocaleDateString('ar-JO')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">إدارة الخدمات</h1>
                  <p className="text-slate-500 text-sm mt-1">{services.length} خدمة مسجلة</p>
                </div>
                <Button onClick={() => setServiceModal({ open: true })} className="bg-primary text-white shadow-lg shadow-primary/30">
                  <Plus className="w-4 h-4 ml-2" /> إضافة خدمة
                </Button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {services.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>لا توجد خدمات بعد</p>
                    <Button onClick={() => setServiceModal({ open: true })} className="mt-4 bg-primary text-white">إضافة أول خدمة</Button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {services.map(service => (
                      <div key={service.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900">{service.title}</p>
                          <p className="text-sm text-slate-500 truncate">{service.description}</p>
                        </div>
                        <Badge className="hidden md:flex" variant={service.category === "interior" ? "default" : "secondary"}>
                          {service.category === "interior" ? "داخلي" : service.category === "exterior" ? "خارجي" : "صيانة"}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {service.isActive ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-400" />}
                          <span className="text-xs text-slate-500 hidden sm:block">{service.isActive ? "نشط" : "متوقف"}</span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => setServiceModal({ open: true, data: service })}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteService(service.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Modal isOpen={serviceModal.open} onClose={() => setServiceModal({ open: false })} title={serviceModal.data ? "تعديل الخدمة" : "إضافة خدمة جديدة"}>
                <ServiceForm service={serviceModal.data} onSave={saveService} onClose={() => setServiceModal({ open: false })} />
              </Modal>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">إدارة المشاريع</h1>
                  <p className="text-slate-500 text-sm mt-1">{projects.length} مشروع مسجل</p>
                </div>
                <Button onClick={() => setProjectModal({ open: true })} className="bg-primary text-white shadow-lg shadow-primary/30">
                  <Plus className="w-4 h-4 ml-2" /> إضافة مشروع
                </Button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {projects.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <Building className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>لا توجد مشاريع بعد</p>
                    <Button onClick={() => setProjectModal({ open: true })} className="mt-4 bg-primary text-white">إضافة أول مشروع</Button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {projects.map(project => (
                      <div key={project.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                          <Building className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-900">{project.title}</p>
                            {project.isFeatured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <p className="text-sm text-slate-500">{project.location} · {project.area}</p>
                        </div>
                        <Badge variant="secondary" className="hidden md:flex">{project.category}</Badge>
                        <div className="flex items-center gap-1">
                          {project.isActive ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-400" />}
                          <span className="text-xs text-slate-500 hidden sm:block">{project.isActive ? "نشط" : "متوقف"}</span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => setProjectModal({ open: true, data: project })}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteProject(project.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Modal isOpen={projectModal.open} onClose={() => setProjectModal({ open: false })} title={projectModal.data ? "تعديل المشروع" : "إضافة مشروع جديد"}>
                <ProjectForm project={projectModal.data} onSave={saveProject} onClose={() => setProjectModal({ open: false })} />
              </Modal>
            </div>
          )}

          {/* Inquiries Tab */}
          {activeTab === "inquiries" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">سجل الاستفسارات</h1>
                  <p className="text-slate-500 text-sm mt-1">{inquiries.length} استفسار وارد</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {inquiries.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>لا توجد استفسارات واردة بعد</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {inquiries.map(inq => (
                      <div key={inq.id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                            {inq.customerName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-bold text-slate-900">{inq.customerName}</h3>
                              <Badge variant="secondary" className="text-xs">{inq.serviceTitle || inq.serviceType}</Badge>
                              <Badge variant={inq.status === "new" ? "default" : "secondary"} className="text-xs">
                                {inq.status === "new" ? "جديد" : "تمت المعالجة"}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{inq.message}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                              <span dir="ltr">📞 {inq.customerPhone}</span>
                              {inq.customerEmail && <span>✉️ {inq.customerEmail}</span>}
                              <span>📅 {new Date(inq.createdAt).toLocaleDateString('ar-JO')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </Layout>
  );
}

export default function Admin() {
  return (
    <AdminErrorBoundary>
      <AdminInner />
    </AdminErrorBoundary>
  );
}
