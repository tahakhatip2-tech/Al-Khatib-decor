import { useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { EmployeeStore, SessionStore } from "@/data/hr-store";
import { HardHat, LogIn, Loader2, Eye, EyeOff, XCircle, Users } from "lucide-react";
import { Logo } from "@/components/logo";
import { Link } from "wouter";

export default function HRPortal() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if already logged in
  if (SessionStore.isLoggedIn()) {
    const session = SessionStore.get();
    if (session?.role === 'admin' || session?.role === 'supervisor') {
      setLocation("/hr/admin");
    } else {
      setLocation("/hr/dashboard");
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    const emp = EmployeeStore.login(username, password);

    if (emp) {
      SessionStore.set(emp);
      toast({ title: `مرحباً بك يا ${emp.name}!`, description: "تم تسجيل الدخول بنجاح" });
      if (emp.role === 'admin' || emp.role === 'supervisor') {
        setLocation("/hr/admin");
      } else {
        setLocation("/hr/dashboard");
      }
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة، أو الحساب غير نشط");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-primary selection:text-white" dir="rtl">
      <Helmet>
        <title>بوابة الموظفين | مؤسسة الخطيب للمقاولات</title>
      </Helmet>

      {/* Simple Header */}
      <header className="bg-white py-4 border-b border-slate-100 px-4 md:px-8 flex justify-between items-center">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <Logo variant="full" size="sm" />
        </Link>
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
          <Users className="w-5 h-5 text-primary" />
          <span>نظام إدارة الموارد البشرية</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100">
            <div className="text-center mb-8">
              <div className="inline-flex w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
                <HardHat className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">بوابة الموظفين</h1>
              <p className="text-slate-500 mt-2 text-sm">أدخل بيانات الدخول للوصول إلى لوحة التحكم الخاصة بك</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="text-slate-700 mb-2 block">اسم المستخدم</Label>
                <Input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="مثال: ahmed.s"
                  required
                  className="bg-slate-50 border-slate-200 h-12 focus:bg-white text-left"
                  dir="ltr"
                />
              </div>
              
              <div>
                <Label className="text-slate-700 mb-2 block">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-slate-50 border-slate-200 h-12 focus:bg-white pl-12 text-left"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 text-sm animate-in fade-in zoom-in-95 duration-200">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-secondary hover:bg-blue-900 text-white font-bold text-base rounded-xl mt-4 shadow-lg shadow-secondary/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : <LogIn className="w-5 h-5 ml-2" />}
                {isLoading ? "جاري التحقق..." : "تسجيل الدخول"}
              </Button>
            </form>
          </div>
          
          <div className="text-center mt-8 text-slate-500 text-sm">
            <p>هل نسيت كلمة المرور؟ يرجى مراجعة إدارة الموارد البشرية.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
