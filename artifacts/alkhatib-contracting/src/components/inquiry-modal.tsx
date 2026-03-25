import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { useSubmitInquiry } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

const inquirySchema = z.object({
  customerName: z.string().min(2, "الاسم مطلوب"),
  customerPhone: z.string().min(8, "رقم الهاتف مطلوب"),
  customerEmail: z.string().email("البريد الإلكتروني غير صالح").optional().or(z.literal("")),
  serviceType: z.string().min(1, "نوع الخدمة مطلوب"),
  serviceTitle: z.string().optional(),
  message: z.string().min(5, "الرسالة مطلوبة (5 أحرف على الأقل)"),
  address: z.string().optional()
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultServiceTitle?: string;
  defaultServiceCategory?: string;
}

export function InquiryModal({ isOpen, onClose, defaultServiceTitle, defaultServiceCategory = "عام" }: InquiryModalProps) {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { mutate: submitInquiry, isPending } = useSubmitInquiry({
    mutation: {
      onSuccess: () => {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setTimeout(() => setIsSuccess(false), 300);
          form.reset();
        }, 3000);
      },
      onError: (error) => {
        toast({
          title: "حدث خطأ",
          description: "لم نتمكن من إرسال طلبك. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.",
          variant: "destructive"
        });
      }
    }
  });

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      serviceType: defaultServiceCategory,
      serviceTitle: defaultServiceTitle || "",
      message: "",
      address: ""
    }
  });

  useEffect(() => {
    if (isOpen && defaultServiceTitle) {
      form.setValue("serviceTitle", defaultServiceTitle);
      form.setValue("serviceType", defaultServiceCategory);
    }
  }, [isOpen, defaultServiceTitle, defaultServiceCategory, form]);

  const onSubmit = (data: InquiryFormValues) => {
    // API expects the payload to exactly match InquiryRequest
    submitInquiry({ data });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-slate-50 dark:bg-slate-800/50">
            <div>
              <h2 className="text-xl font-bold text-secondary">طلب استفسار جديد</h2>
              {defaultServiceTitle && (
                <p className="text-sm text-muted-foreground mt-1">بخصوص: <span className="font-semibold text-primary">{defaultServiceTitle}</span></p>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">تم الإرسال بنجاح!</h3>
                <p className="text-slate-600">شكراً لتواصلك معنا. سيقوم فريقنا بمراجعة طلبك والتواصل معك في أقرب وقت ممكن.</p>
              </motion.div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName" className="text-right">الاسم الكريم <span className="text-red-500">*</span></Label>
                    <Input 
                      id="customerName" 
                      placeholder="أدخل اسمك" 
                      className="focus-visible:ring-primary"
                      {...form.register("customerName")} 
                    />
                    {form.formState.errors.customerName && (
                      <p className="text-xs text-red-500">{form.formState.errors.customerName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone" className="text-right">رقم الهاتف <span className="text-red-500">*</span></Label>
                    <Input 
                      id="customerPhone" 
                      placeholder="مثال: 0782633162" 
                      dir="ltr"
                      className="text-right focus-visible:ring-primary"
                      {...form.register("customerPhone")} 
                    />
                    {form.formState.errors.customerPhone && (
                      <p className="text-xs text-red-500">{form.formState.errors.customerPhone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail" className="text-right">البريد الإلكتروني (اختياري)</Label>
                    <Input 
                      id="customerEmail" 
                      type="email" 
                      dir="ltr"
                      className="text-right focus-visible:ring-primary"
                      placeholder="email@example.com" 
                      {...form.register("customerEmail")} 
                    />
                    {form.formState.errors.customerEmail && (
                      <p className="text-xs text-red-500">{form.formState.errors.customerEmail.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-right">الموقع / العنوان (اختياري)</Label>
                    <Input 
                      id="address" 
                      placeholder="مثال: عمان، جبل الحسين" 
                      className="focus-visible:ring-primary"
                      {...form.register("address")} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-right">تفاصيل الاستفسار <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="message" 
                    placeholder="اكتب تفاصيل طلبك او استفسارك هنا..." 
                    className="min-h-[120px] resize-none focus-visible:ring-primary"
                    {...form.register("message")} 
                  />
                  {form.formState.errors.message && (
                    <p className="text-xs text-red-500">{form.formState.errors.message.message}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-border mt-6 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={onClose}>
                    إلغاء
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin ml-2" />
                        جاري الإرسال...
                      </>
                    ) : (
                      "إرسال الطلب"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
