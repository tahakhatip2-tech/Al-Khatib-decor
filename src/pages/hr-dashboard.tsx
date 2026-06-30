import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SessionStore, EmployeeStore, TaskStore, AttendanceStore } from "@/data/hr-store";
import { 
  LogOut, ClipboardList, CheckCircle2, Clock, MapPin, AlertCircle, 
  User, CheckCircle, Timer, AlertOctagon, Edit3, X
} from "lucide-react";
import type { Task, AttendanceRecord, Employee } from "@/types/hr";

// ===========================
// Modal Component
// ===========================
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default function HRDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!SessionStore.isLoggedIn()) {
      setLocation("/hr");
      return;
    }
    const session = SessionStore.get();
    if (!session || (session.role === 'admin' && window.location.pathname !== '/hr/admin')) {
      // Admins should be in admin dashboard, but allow if they want to view employee dashboard
    }
    
    const emp = EmployeeStore.getById(session!.employeeId);
    if (emp) {
      setEmployee(emp);
      setTasks(TaskStore.getByEmployee(emp.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      
      const todayStr = new Date().toISOString().split('T')[0];
      const attendance = AttendanceStore.getByDate(todayStr).find(a => a.employeeId === emp.id);
      setTodayAttendance(attendance || null);
    }
  }, [setLocation]);

  const handleLogout = () => {
    SessionStore.clear();
    setLocation("/hr");
    toast({ title: "تم تسجيل الخروج بنجاح" });
  };

  const handleCheckIn = () => {
    if (!employee) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const dateString = now.toISOString().split('T')[0];
    
    // Auto status based on time (assuming 8 AM start)
    const hours = now.getHours();
    const status = hours > 8 ? 'late' : 'present';

    const record = AttendanceStore.upsert(employee.id, dateString, {
      checkIn: timeString,
      status: status
    });
    setTodayAttendance(record);
    toast({ title: "تم تسجيل الحضور بنجاح", description: `وقت الحضور: ${timeString}` });
  };

  const handleCheckOut = () => {
    if (!employee || !todayAttendance) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const dateString = now.toISOString().split('T')[0];
    
    const record = AttendanceStore.upsert(employee.id, dateString, {
      checkOut: timeString
    });
    setTodayAttendance(record);
    toast({ title: "تم تسجيل الانصراف بنجاح", description: `وقت الانصراف: ${timeString}` });
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    setIsUpdating(true);
    
    const updated = TaskStore.update(selectedTask.id, {
      employeeNotes: notes
    });
    
    if (updated) {
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
      toast({ title: "تم إضافة الملاحظات بنجاح" });
    }
    
    setIsUpdating(false);
    setSelectedTask(null);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    const updated = TaskStore.update(taskId, { status: newStatus });
    if (updated) {
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
      toast({ title: "تم تحديث حالة المهمة" });
    }
  };

  if (!employee) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityLabel = (p: string) => {
    switch(p) {
      case 'urgent': return 'عاجل جداً';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      default: return 'عادي';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary selection:text-white pb-20 md:pb-0" dir="rtl">
      <Helmet>
        <title>لوحة الموظف | مؤسسة الخطيب</title>
      </Helmet>

      {/* Header */}
      <header className="bg-secondary text-white sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary font-bold">
              {employee.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold">{employee.name}</h1>
              <p className="text-xs text-white/60">{employee.position}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Right Column - Attendance & Stats */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Attendance Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                تسجيل الحضور اليومي
              </h2>
              
              <div className="p-4 rounded-xl bg-slate-50 mb-4">
                <div className="text-sm text-slate-500 mb-1">{new Date().toLocaleDateString('ar-JO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div className="font-medium text-slate-800">
                  حالة اليوم: 
                  {todayAttendance?.checkIn 
                    ? <span className="text-green-600 mr-2 font-bold">حاضر</span> 
                    : <span className="text-slate-400 mr-2">لم يتم التسجيل</span>}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleCheckIn}
                  disabled={!!todayAttendance?.checkIn}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 ml-2" />
                  تسجيل الدخول
                </Button>
                <Button 
                  onClick={handleCheckOut}
                  disabled={!todayAttendance?.checkIn || !!todayAttendance?.checkOut}
                  className="flex-1 bg-slate-700 hover:bg-slate-800 text-white"
                >
                  <LogOut className="w-4 h-4 ml-2" />
                  انصراف
                </Button>
              </div>
              
              {todayAttendance?.checkIn && (
                <div className="mt-4 text-sm flex justify-between text-slate-600 border-t pt-3">
                  <span>الدخول: <strong dir="ltr">{todayAttendance.checkIn}</strong></span>
                  {todayAttendance.checkOut && (
                    <span>الخروج: <strong dir="ltr">{todayAttendance.checkOut}</strong></span>
                  )}
                </div>
              )}
            </div>
            
            {/* Stats Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                ملخص المهام
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                  <div className="text-3xl font-bold text-blue-700 mb-1">{pendingTasks.length}</div>
                  <div className="text-xs text-blue-600 font-medium">مهام قيد التنفيذ</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                  <div className="text-3xl font-bold text-green-700 mb-1">{completedTasks.length}</div>
                  <div className="text-xs text-green-600 font-medium">مهام منجزة</div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Left Column - Tasks List */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Active Tasks */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  المهام الحالية ({pendingTasks.length})
                </h2>
              </div>
              
              {pendingTasks.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">لا يوجد مهام حالية، أحسنت!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingTasks.map(task => (
                    <div key={task.id} className="border border-slate-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-slate-50/50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-800 text-lg">{task.title}</h3>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {getPriorityLabel(task.priority)}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed">{task.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 mb-4 text-xs font-medium text-slate-600">
                        {task.project && (
                          <div className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4 text-primary" />
                            المشروع: {task.project}
                          </div>
                        )}
                        {task.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            الموقع: {task.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Timer className="w-4 h-4 text-primary" />
                          المطلوب: {new Date(task.dueDate).toLocaleDateString('ar-JO')}
                        </div>
                      </div>
                      
                      {task.employeeNotes && (
                        <div className="mb-4 bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 border border-yellow-100">
                          <strong>ملاحظاتي:</strong> {task.employeeNotes}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200">
                        {task.status === 'pending' ? (
                          <Button 
                            onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}
                            className="bg-blue-600 hover:bg-blue-700 text-white h-9"
                          >
                            بدء التنفيذ
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                            className="bg-green-600 hover:bg-green-700 text-white h-9"
                          >
                            <CheckCircle className="w-4 h-4 ml-2" />
                            إنهاء المهمة
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline"
                          onClick={() => { setSelectedTask(task); setNotes(task.employeeNotes || ""); }}
                          className="h-9 border-slate-200"
                        >
                          <Edit3 className="w-4 h-4 ml-2" />
                          إضافة ملاحظة
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Tasks (Last 5) */}
            {completedTasks.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  آخر المهام المنجزة
                </h2>
                <div className="space-y-3">
                  {completedTasks.slice(0, 5).map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{task.title}</div>
                          <div className="text-xs text-slate-500">تم الإنجاز في: {task.completedAt ? new Date(task.completedAt).toLocaleDateString('ar-JO') : 'غير محدد'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </main>

      {/* Add Note Modal */}
      <Modal 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        title="إضافة ملاحظات للمهمة"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">ملاحظاتك / تقرير الإنجاز للمدير</label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="اكتب ما تم إنجازه، أو أي عوائق واجهتك..."
              className="min-h-[120px] bg-slate-50 focus:bg-white"
            />
          </div>
          <Button 
            onClick={handleUpdateTask} 
            disabled={isUpdating}
            className="w-full bg-primary hover:bg-yellow-600 text-white"
          >
            {isUpdating ? "جاري الحفظ..." : "حفظ الملاحظات"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
