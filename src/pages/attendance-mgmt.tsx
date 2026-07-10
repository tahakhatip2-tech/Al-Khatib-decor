import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SessionStore, EmployeeStore, AttendanceStore } from "@/data/hr-store";
import type { Employee, AttendanceRecord, AttendanceStatus } from "@/types/hr";
import { CheckCircle2, XCircle, Clock, CalendarDays, Sun, UserCheck, TrendingDown, AlertCircle, X, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  present: { label: "حاضر",   color: "text-green-700",  bg: "bg-green-100",  icon: <CheckCircle2 className="w-4 h-4" /> },
  absent:  { label: "غائب",   color: "text-red-700",    bg: "bg-red-100",    icon: <XCircle className="w-4 h-4" /> },
  late:    { label: "متأخر",  color: "text-amber-700",  bg: "bg-amber-100",  icon: <Clock className="w-4 h-4" /> },
  leave:   { label: "إجازة",  color: "text-blue-700",   bg: "bg-blue-100",   icon: <Sun className="w-4 h-4" /> },
  holiday: { label: "عطلة",   color: "text-purple-700", bg: "bg-purple-100", icon: <CalendarDays className="w-4 h-4" /> },
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function formatMonth(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('ar-JO', { year: 'numeric', month: 'long' });
}

export default function AttendanceMgmt() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isMarkingOpen, setIsMarkingOpen] = useState(false);
  const [markingData, setMarkingData] = useState<Record<string, AttendanceStatus>>({});
  const [viewMode, setViewMode] = useState<'month' | 'day'>('day');

  const refresh = () => {
    const emps = EmployeeStore.getAll().filter(e => e.role !== 'admin');
    setEmployees(emps);
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    const att = AttendanceStore.getAll().filter(r => r.date.startsWith(monthStr));
    setRecords(att);
  };

  useEffect(() => {
    if (!SessionStore.isLoggedIn()) { setLocation("/hr"); return; }
    const s = SessionStore.get();
    if (s?.role !== 'admin' && s?.role !== 'supervisor') { setLocation("/hr/dashboard"); return; }
    refresh();
  }, [year, month]);

  const daysInMonth = getDaysInMonth(year, month);
  const todayStr = today.toISOString().split('T')[0];

  const getRecord = (empId: string, date: string): AttendanceRecord | undefined =>
    records.find(r => r.employeeId === empId && r.date === date);

  const openMarking = (dayStr: string) => {
    setSelectedDay(dayStr);
    const init: Record<string, AttendanceStatus> = {};
    employees.forEach(emp => {
      const rec = getRecord(emp.id, dayStr);
      init[emp.id] = rec?.status || 'present';
    });
    setMarkingData(init);
    setIsMarkingOpen(true);
  };

  const handleSaveAttendance = () => {
    if (!selectedDay) return;
    Object.entries(markingData).forEach(([empId, status]) => {
      AttendanceStore.markAttendance(empId, selectedDay, status);
    });
    refresh();
    toast({ title: "تم حفظ الحضور بنجاح", description: `ليوم ${selectedDay}` });
    setIsMarkingOpen(false);
  };

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  // Monthly summary for each employee
  const getEmpMonthSummary = (empId: string) => {
    const empRecs = records.filter(r => r.employeeId === empId);
    return {
      present: empRecs.filter(r => r.status === 'present').length,
      absent:  empRecs.filter(r => r.status === 'absent').length,
      late:    empRecs.filter(r => r.status === 'late').length,
      leave:   empRecs.filter(r => r.status === 'leave').length,
    };
  };

  // Days array
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeek = new Date(year, month, d).getDay();
    return { d, dateStr, isWeekend: dayOfWeek === 5 || dayOfWeek === 6, isToday: dateStr === todayStr };
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      <Helmet><title>الحضور والغياب | مؤسسة الخطيب</title></Helmet>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <UserCheck className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-slate-900">الحضور والغياب</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            <button onClick={() => setViewMode('day')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'day' ? 'bg-white shadow-sm text-primary' : 'text-slate-600'}`}>يومي</button>
            <button onClick={() => setViewMode('month')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'month' ? 'bg-white shadow-sm text-primary' : 'text-slate-600'}`}>شهري</button>
          </div>
        </div>
      </div>

      {/* Month Navigator */}
      <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100"><ChevronRight className="w-5 h-5" /></button>
        <h2 className="text-lg font-bold text-slate-800">{formatMonth(year, month)}</h2>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100"><ChevronLeft className="w-5 h-5" /></button>
      </div>

      {/* Stats */}
      <div className="px-6 pt-4 grid grid-cols-4 gap-3">
        {employees.slice(0, 4).map(emp => {
          const s = getEmpMonthSummary(emp.id);
          return (
            <div key={emp.id} className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
              <div className="font-bold text-slate-800 text-sm mb-2 truncate">{emp.name}</div>
              <div className="flex gap-1 flex-wrap">
                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{s.present} ح</span>
                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">{s.absent} غ</span>
                <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">{s.late} ت</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{s.leave} إج</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily View */}
      {viewMode === 'day' && (
        <div className="px-6 py-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-right text-slate-600 font-medium w-32">الموظف</th>
                    {days.map(({ d, dateStr, isWeekend, isToday }) => (
                      <th key={dateStr} className={`px-1 py-3 text-center font-medium min-w-[2.5rem] ${isWeekend ? 'bg-slate-100/50' : ''} ${isToday ? 'bg-primary/5' : ''}`}>
                        <div className={`text-xs mb-0.5 ${isToday ? 'text-primary font-bold' : 'text-slate-500'}`}>{d}</div>
                        <button
                          onClick={() => openMarking(dateStr)}
                          className={`text-[10px] rounded px-1 py-0.5 transition-colors ${isWeekend ? 'text-slate-400' : 'text-slate-400 hover:text-primary hover:bg-primary/10'}`}
                        >
                          تسجيل
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2">
                        <div className="font-bold text-slate-800 text-sm">{emp.name}</div>
                        <div className="text-xs text-slate-400">{emp.position}</div>
                      </td>
                      {days.map(({ dateStr, isWeekend }) => {
                        const rec = getRecord(emp.id, dateStr);
                        const cfg = rec ? STATUS_CONFIG[rec.status] : null;
                        return (
                          <td key={dateStr} className={`px-1 py-2 text-center ${isWeekend ? 'bg-slate-50' : ''}`}>
                            {rec ? (
                              <span title={cfg!.label} className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${cfg!.bg} ${cfg!.color}`}>
                                {cfg!.icon}
                              </span>
                            ) : (
                              <span className="inline-block w-7 h-7 rounded-full bg-slate-100" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Legend */}
          <div className="flex gap-4 mt-3 text-xs text-slate-500 flex-wrap px-1">
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <span key={k} className={`flex items-center gap-1.5 ${v.color}`}>{v.icon} {v.label}</span>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Summary View */}
      {viewMode === 'month' && (
        <div className="px-6 py-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">الموظف</th>
                  <th className="px-4 py-3 font-medium text-slate-600">نوع الراتب</th>
                  <th className="px-4 py-3 font-medium text-green-700">أيام الحضور</th>
                  <th className="px-4 py-3 font-medium text-red-700">أيام الغياب</th>
                  <th className="px-4 py-3 font-medium text-amber-700">أيام التأخير</th>
                  <th className="px-4 py-3 font-medium text-blue-700">الإجازات</th>
                  <th className="px-4 py-3 font-medium text-slate-700">الأجر المستحق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {employees.map(emp => {
                  const s = getEmpMonthSummary(emp.id);
                  const earned = emp.salaryType === 'daily'
                    ? s.present * (emp.salaryAmount || 0)
                    : (emp.salaryAmount || 0);
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{emp.name}</div>
                        <div className="text-xs text-slate-400">{emp.position}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{emp.salaryType === 'monthly' ? 'شهري' : 'يومية'}</td>
                      <td className="px-4 py-3 text-center font-bold text-green-700">{s.present}</td>
                      <td className="px-4 py-3 text-center font-bold text-red-700">{s.absent}</td>
                      <td className="px-4 py-3 text-center font-bold text-amber-700">{s.late}</td>
                      <td className="px-4 py-3 text-center font-bold text-blue-700">{s.leave}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{earned.toLocaleString()} دينار</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mark Attendance Modal */}
      {isMarkingOpen && selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold">تسجيل الحضور ليوم {selectedDay}</h3>
              <button onClick={() => setIsMarkingOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {employees.map(emp => (
                <div key={emp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{emp.name}</div>
                    <div className="text-xs text-slate-400">{emp.position}</div>
                  </div>
                  <div className="flex gap-1">
                    {(Object.keys(STATUS_CONFIG) as AttendanceStatus[]).filter(s => s !== 'holiday').map(st => (
                      <button
                        key={st}
                        onClick={() => setMarkingData(prev => ({...prev, [emp.id]: st}))}
                        title={STATUS_CONFIG[st].label}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all ${markingData[emp.id] === st ? `${STATUS_CONFIG[st].bg} ${STATUS_CONFIG[st].color} ring-2 ring-offset-1 ring-current` : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-400'}`}
                      >
                        {STATUS_CONFIG[st].icon}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsMarkingOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveAttendance} className="bg-primary text-white">حفظ الحضور</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
