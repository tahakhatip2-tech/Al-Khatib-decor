import { useState } from "react";
import { Layout } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { COMPANY_INFO } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitInquiry } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  customerName: z.string().min(2, "الاسم مطلوب"),
  customerPhone: z.string().min(8, "رقم الهاتف مطلوب"),
  customerEmail: z.string().email("بريد إلكتروني غير صالح").optional().or(z.literal("")),
  serviceType: z.literal("تواصل من صفحة الاتصال"),
  message: z.string().min(10, "يرجى كتابة رسالة واضحة (10 أحرف على الأقل)")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: submitInquiry, isPending } = useSubmitInquiry({
    mutation: {
      onSuccess: () => {
        setIsSuccess(true);
        form.reset();
        setTimeout(() => setIsSuccess(false), 5000);
      },
      onError: () => {
        toast({
          title: "حدث خطأ",
          description: "لم نتمكن من إرسال رسالتك. يرجى المحاولة مرة أخرى.",
          variant: "destructive"
        });
      }
    }
  });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      serviceType: "تواصل من صفحة الاتصال",
      message: ""
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    submitInquiry({ data });
  };

  return (
    <Layout>
      <PageHero 
        title="تواصل معنا"
        description="نحن هنا للاستماع إليك. تواصل معنا لأي استفسار أو لطلب استشارة مجانية لمشروعك."
        // contact phone customer service
        bgImage="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=1920&q=80"
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "اتصل بنا" }
        ]}
      />

      <section className="py-24 bg-slate-50 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
            
            {/* Contact Info */}
            <div className="lg:w-1/3 space-y-8">
              <div>
                <h2 className="text-3xl font-black text-secondary mb-2">معلومات الاتصال</h2>
                <p className="text-slate-600 mb-8">نسعد بتواصلكم معنا عبر القنوات التالية أو بزيارة مقرنا.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md border border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-lg mb-1">العنوان</h4>
                    <p className="text-slate-600">{COMPANY_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md border border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-lg mb-1">رقم الهاتف</h4>
                    <a href={`tel:${COMPANY_INFO.phone}`} className="text-slate-600 hover:text-primary transition-colors block" dir="ltr">
                      {COMPANY_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md border border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-lg mb-1">البريد الإلكتروني</h4>
                    <a href={`mailto:${COMPANY_INFO.email}`} className="text-slate-600 hover:text-primary transition-colors block">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md border border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-lg mb-1">أوقات العمل</h4>
                    <p className="text-slate-600">{COMPANY_INFO.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
                <h3 className="text-2xl font-black text-secondary mb-6 pb-4 border-b border-slate-100">أرسل لنا رسالة</h3>
                
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">تم الإرسال بنجاح!</h3>
                    <p className="text-slate-600 max-w-md mx-auto">شكراً لتواصلك معنا. استلمنا رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن.</p>
                  </div>
                ) : (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="customerName" className="text-right font-bold">الاسم الكريم <span className="text-red-500">*</span></Label>
                        <Input 
                          id="customerName" 
                          placeholder="أدخل اسمك" 
                          className="h-12 bg-slate-50 focus-visible:ring-primary rounded-xl"
                          {...form.register("customerName")} 
                        />
                        {form.formState.errors.customerName && (
                          <p className="text-xs text-red-500 font-medium">{form.formState.errors.customerName.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone" className="text-right font-bold">رقم الهاتف <span className="text-red-500">*</span></Label>
                        <Input 
                          id="customerPhone" 
                          placeholder="مثال: 0782633162" 
                          dir="ltr"
                          className="h-12 text-right bg-slate-50 focus-visible:ring-primary rounded-xl"
                          {...form.register("customerPhone")} 
                        />
                        {form.formState.errors.customerPhone && (
                          <p className="text-xs text-red-500 font-medium">{form.formState.errors.customerPhone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerEmail" className="text-right font-bold">البريد الإلكتروني (اختياري)</Label>
                      <Input 
                        id="customerEmail" 
                        type="email" 
                        dir="ltr"
                        className="h-12 text-right bg-slate-50 focus-visible:ring-primary rounded-xl"
                        placeholder="email@example.com" 
                        {...form.register("customerEmail")} 
                      />
                      {form.formState.errors.customerEmail && (
                        <p className="text-xs text-red-500 font-medium">{form.formState.errors.customerEmail.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-right font-bold">نص الرسالة <span className="text-red-500">*</span></Label>
                      <Textarea 
                        id="message" 
                        placeholder="اكتب رسالتك أو استفسارك هنا..." 
                        className="min-h-[160px] resize-none bg-slate-50 focus-visible:ring-primary rounded-xl p-4"
                        {...form.register("message")} 
                      />
                      {form.formState.errors.message && (
                        <p className="text-xs text-red-500 font-medium">{form.formState.errors.message.message}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isPending}
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg rounded-xl shadow-lg shadow-primary/20"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin ml-2" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          إرسال الرسالة
                          <Send className="w-5 h-5 mr-2" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] w-full bg-slate-200 relative">
        {/* Placeholder for actual Google Map */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">موقعنا على الخريطة</h3>
            <p>{COMPANY_INFO.address}</p>
            <p className="text-sm text-slate-400 mt-2">(هنا سيتم تضمين خريطة تفاعلية)</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
