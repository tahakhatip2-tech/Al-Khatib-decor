import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Helmet } from "react-helmet-async";
import { 
  getServices, createService, updateService, deleteService,
  getProjects, createProject, updateProject, deleteProject,
  getInquiries
} from "@workspace/api-client-react";
import type { ServiceRequest, ProjectRequest } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { seedDatabase } from "@/data/seed-data";
import { LayoutDashboard, Briefcase, Building, MessageSquare, Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

// Service Form Component
function ServiceFormModal({ service, onClose }: { service?: any, onClose: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const form = useForm<ServiceRequest>({
    defaultValues: service ? {
      title: service.title,
      description: service.description,
      category: service.category as any,
      icon: service.icon,
      images: service.images || [""],
      features: service.features || [""],
      isActive: service.isActive,
      sortOrder: service.sortOrder
    } : {
      title: "",
      description: "",
      category: "interior",
      icon: "Paintbrush",
      images: [""],
      features: [""],
      isActive: true,
      sortOrder: 0
    }
  });

  const createMut = useMutation({
    mutationFn: (data: ServiceRequest) => createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({ title: "تم الإضافة بنجاح" });
      onClose();
    },
    onError: () => {
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  });

  const updateMut = useMutation({
    mutationFn: (data: ServiceRequest) => updateService(service.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({ title: "تم التعديل بنجاح" });
      onClose();
    },
    onError: () => {
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  });

  const onSubmit = (data: ServiceRequest) => {
    // Basic array cleanup
    if (!data.images || data.images.length === 0) data.images = [""];
    if (!data.features || data.features.length === 0) data.features = [""];
    
    if (service) updateMut.mutate(data);
    else createMut.mutate(data);
  };

  const isLoading = createMut.isPending || updateMut.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>العنوان</Label>
          <Input {...form.register("title")} required />
        </div>
        <div className="space-y-2">
          <Label>القسم</Label>
          <Select 
            defaultValue={form.getValues("category")} 
            onValueChange={(val: any) => form.setValue("category", val)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="interior">داخلي</SelectItem>
              <SelectItem value="exterior">خارجي</SelectItem>
              <SelectItem value="maintenance">صيانة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>الوصف</Label>
        <Textarea {...form.register("description")} required />
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          checked={form.watch("isActive")}
          onCheckedChange={(val) => form.setValue("isActive", val)}
        />
        <Label>مفعل</Label>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          حفظ
        </Button>
      </DialogFooter>
    </form>
  );
}

// Project Form Component
function ProjectFormModal({ project, onClose }: { project?: any, onClose: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const form = useForm<ProjectRequest>({
    defaultValues: project ? {
      title: project.title,
      description: project.description,
      category: project.category,
      location: project.location,
      completionDate: project.completionDate,
      area: project.area,
      images: project.images || [""],
      features: project.features || [""],
      isActive: project.isActive,
      isFeatured: project.isFeatured,
      sortOrder: project.sortOrder
    } : {
      title: "",
      description: "",
      category: "سكني",
      location: "",
      completionDate: "",
      area: "",
      images: [""],
      features: [""],
      isActive: true,
      isFeatured: false,
      sortOrder: 0
    }
  });

  const createMut = useMutation({
    mutationFn: (data: ProjectRequest) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: "تم الإضافة بنجاح" });
      onClose();
    },
    onError: () => {
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  });

  const updateMut = useMutation({
    mutationFn: (data: ProjectRequest) => updateProject(project.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: "تم التعديل بنجاح" });
      onClose();
    },
    onError: () => {
      toast({ title: "حدث خطأ", variant: "destructive" });
    }
  });

  const onSubmit = (data: ProjectRequest) => {
    if (!data.images || data.images.length === 0) data.images = [""];
    if (!data.features || data.features.length === 0) data.features = [""];

    if (project) updateMut.mutate(data);
    else createMut.mutate(data);
  };

  const isLoading = createMut.isPending || updateMut.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>العنوان</Label>
          <Input {...form.register("title")} required />
        </div>
        <div className="space-y-2">
          <Label>القسم</Label>
          <Input {...form.register("category")} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>الوصف</Label>
        <Textarea {...form.register("description")} required />
      </div>
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Switch 
            checked={form.watch("isActive")}
            onCheckedChange={(val) => form.setValue("isActive", val)}
          />
          <Label>مفعل</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch 
            checked={form.watch("isFeatured")}
            onCheckedChange={(val) => form.setValue("isFeatured", val)}
          />
          <Label>مميز</Label>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          حفظ
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSeeding, setIsSeeding] = useState(false);
  const [serviceModal, setServiceModal] = useState<{isOpen: boolean, service?: any}>({isOpen: false});
  const [projectModal, setProjectModal] = useState<{isOpen: boolean, project?: any}>({isOpen: false});

  // Queries
  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['/api/services'],
    queryFn: () => getServices()
  });

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: () => getProjects()
  });

  const { data: inquiries = [], isLoading: isLoadingInquiries } = useQuery({
    queryKey: ['/api/inquiries'],
    queryFn: () => getInquiries()
  });

  // Mutations
  const delService = useMutation({
    mutationFn: (id: number) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({ title: "تم الحذف بنجاح" });
    }
  });

  const delProject = useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: "تم الحذف بنجاح" });
    }
  });

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      toast({ title: "تمت العملية بنجاح", description: "تم إضافة البيانات التجريبية" });
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    } catch (e) {
      toast({ title: "خطأ", description: "فشل إضافة البيانات التجريبية", variant: "destructive" });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>لوحة التحكم | مؤسسة الخطيب للمقاولات</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex min-h-[80vh] bg-slate-50" dir="rtl">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 text-white p-6 shadow-xl hidden md:flex flex-col rounded-l-3xl">
          <div className="mb-8 pb-4 border-b border-slate-700">
            <h2 className="text-xl font-bold">لوحة التحكم</h2>
          </div>
          <nav className="space-y-2">
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "الرئيسية" },
              { id: "services", icon: Briefcase, label: "الخدمات" },
              { id: "projects", icon: Building, label: "المشاريع" },
              { id: "inquiries", icon: MessageSquare, label: "الاستفسارات" }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id ? "bg-primary text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="mt-auto pt-10">
            <Button 
              onClick={handleSeed} 
              disabled={isSeeding}
              variant="outline" 
              className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 bg-transparent"
            >
              {isSeeding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              بيانات تجريبية
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold text-slate-900">نظرة عامة</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">إجمالي الخدمات</p>
                    <h3 className="text-3xl font-bold text-slate-900">{services.length}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                    <Building className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">إجمالي المشاريع</p>
                    <h3 className="text-3xl font-bold text-slate-900">{projects.length}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">الاستفسارات</p>
                    <h3 className="text-3xl font-bold text-slate-900">{inquiries.length}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">إدارة الخدمات</h1>
                <Button onClick={() => setServiceModal({isOpen: true})} className="bg-primary text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة خدمة
                </Button>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="text-right">العنوان</TableHead>
                      <TableHead className="text-right">القسم</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingServices ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8">جاري التحميل...</TableCell></TableRow>
                    ) : services.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8">لا توجد خدمات</TableCell></TableRow>
                    ) : (
                      services.map(service => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.title}</TableCell>
                          <TableCell>{service.category}</TableCell>
                          <TableCell>
                            <Badge variant={service.isActive ? "default" : "secondary"}>
                              {service.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => setServiceModal({isOpen: true, service})}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-600" onClick={() => {
                                if (confirm('هل أنت متأكد من الحذف؟')) delService.mutate(service.id);
                              }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <Dialog open={serviceModal.isOpen} onOpenChange={(open) => !open && setServiceModal({isOpen: false})}>
                <DialogContent dir="rtl">
                  <DialogHeader>
                    <DialogTitle>{serviceModal.service ? "تعديل خدمة" : "إضافة خدمة"}</DialogTitle>
                  </DialogHeader>
                  <ServiceFormModal service={serviceModal.service} onClose={() => setServiceModal({isOpen: false})} />
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">إدارة المشاريع</h1>
                <Button onClick={() => setProjectModal({isOpen: true})} className="bg-primary text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة مشروع
                </Button>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="text-right">عنوان المشروع</TableHead>
                      <TableHead className="text-right">التصنيف</TableHead>
                      <TableHead className="text-right">مميز</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingProjects ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8">جاري التحميل...</TableCell></TableRow>
                    ) : projects.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8">لا توجد مشاريع</TableCell></TableRow>
                    ) : (
                      projects.map(project => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>{project.category}</TableCell>
                          <TableCell>
                            <Badge variant={project.isFeatured ? "default" : "secondary"}>
                              {project.isFeatured ? "نعم" : "لا"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" className="text-blue-600" onClick={() => setProjectModal({isOpen: true, project})}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-600" onClick={() => {
                                if (confirm('هل أنت متأكد من الحذف؟')) delProject.mutate(project.id);
                              }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <Dialog open={projectModal.isOpen} onOpenChange={(open) => !open && setProjectModal({isOpen: false})}>
                <DialogContent dir="rtl">
                  <DialogHeader>
                    <DialogTitle>{projectModal.project ? "تعديل مشروع" : "إضافة مشروع"}</DialogTitle>
                  </DialogHeader>
                  <ProjectFormModal project={projectModal.project} onClose={() => setProjectModal({isOpen: false})} />
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === "inquiries" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">سجل الاستفسارات</h1>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">الهاتف</TableHead>
                      <TableHead className="text-right">الخدمة / الرسالة</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingInquiries ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8">جاري التحميل...</TableCell></TableRow>
                    ) : inquiries.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8">لا توجد استفسارات</TableCell></TableRow>
                    ) : (
                      inquiries.map(inq => (
                        <TableRow key={inq.id}>
                          <TableCell className="font-medium whitespace-nowrap">{inq.customerName}</TableCell>
                          <TableCell dir="ltr" className="text-right whitespace-nowrap">{inq.customerPhone}</TableCell>
                          <TableCell>
                            <p className="font-semibold text-sm mb-1">{inq.serviceTitle || inq.serviceType}</p>
                            <p className="text-xs text-slate-500 line-clamp-1">{inq.message}</p>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{new Date(inq.createdAt).toLocaleDateString('ar-JO')}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
