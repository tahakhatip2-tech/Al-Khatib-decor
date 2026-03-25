import { useState } from "react";
import { Layout } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { ServiceCard } from "@/components/service-card";
import { InquiryModal } from "@/components/inquiry-modal";
import { SERVICES } from "@/data/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Award, Clock, Lightbulb, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  const [modalState, setModalState] = useState<{isOpen: boolean, serviceTitle?: string, category?: string}>({ isOpen: false });

  const openInquiry = (serviceTitle?: string, category?: string) => {
    setModalState({ isOpen: true, serviceTitle, category });
  };

  const categories = [
    { id: "all", label: "الكل", count: SERVICES.length },
    { id: "interior", label: "ديكور داخلي", count: SERVICES.filter(s => s.category === 'interior').length },
    { id: "exterior", label: "أعمال خارجية", count: SERVICES.filter(s => s.category === 'exterior').length },
    { id: "maintenance", label: "صيانة وترميم", count: SERVICES.filter(s => s.category === 'maintenance').length }
  ];

  return (
    <Layout>
      <Helmet>
        <title>خدماتنا | مؤسسة الخطيب للمقاولات</title>
        <meta name="description" content="تعرف على خدماتنا المتكاملة في التشطيبات والديكور الداخلي والخارجي وصيانة المباني. نقدم حلولاً عصرية ومبتكرة بأسعار تنافسية في الأردن." />
        <meta property="og:title" content="خدمات مؤسسة الخطيب للمقاولات" />
        <meta property="og:description" content="خدمات متكاملة في عالم البناء والتشطيبات." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="خدمات مقاولات, تشطيبات داخلية, دهانات, ديكورات, جبس بورد, عمان, الأردن" />
        <link rel="canonical" href="https://alkhatib-contracting.com/services" />
      </Helmet>

      <InquiryModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ isOpen: false })}
        defaultServiceTitle={modalState.serviceTitle}
        defaultServiceCategory={modalState.category}
      />

      <PageHero 
        title="خدماتنا"
        description="نقدم باقة متكاملة من خدمات التشطيبات والديكور الداخلي والخارجي بأعلى معايير الجودة للقطاعين السكني والتجاري."
        bgImage="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80"
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "خدماتنا" }
        ]}
      />

      <section className="py-20 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4">
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-black text-secondary mb-4">حلول شاملة لكل مساحة</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              سواء كنت تبحث عن تشطيب شقة جديدة، أو تجديد مكتبك، أو ترميم واجهة مبنى، فإن فريقنا المتخصص يوفر لك أفضل الحلول التي تجمع بين الجمال، المتانة، والتكلفة المدروسة. تعرف على أقسام خدماتنا أدناه.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full" dir="rtl">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-white shadow-md p-1.5 h-auto rounded-2xl flex-wrap justify-center gap-2">
                {categories.map(cat => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="text-base px-6 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all"
                  >
                    {cat.label}
                    <span className="mr-2 inline-flex items-center justify-center bg-slate-100 text-slate-600 data-[state=active]:bg-white/20 data-[state=active]:text-white text-xs px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map(cat => (
              <TabsContent key={cat.id} value={cat.id} className="mt-0 outline-none">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {SERVICES
                    .filter(service => cat.id === "all" || service.category === cat.id)
                    .map(service => (
                      <div key={service.id} className="h-full">
                        <ServiceCard 
                          {...service} 
                          onInquiry={() => openInquiry(service.title, service.category)} 
                        />
                      </div>
                  ))}
                </motion.div>
                
                {SERVICES.filter(service => cat.id === "all" || service.category === cat.id).length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-slate-500 text-lg">لا توجد خدمات في هذا القسم حالياً.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-bold tracking-wider uppercase mb-2 block">لماذا تختارنا</span>
            <h2 className="text-3xl md:text-4xl font-black text-secondary">القيمة المضافة التي نقدمها</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CheckCircle2, title: "جودة مضمونة", desc: "نستخدم أفضل المواد وأحدث التقنيات لضمان نتائج تفوق توقعاتك وتدوم طويلاً." },
              { icon: Clock, title: "تسليم في الموعد", desc: "نحترم وقتك، لذلك نلتزم بجداول زمنية صارمة لتسليم المشاريع دون تأخير." },
              { icon: Award, title: "خبرة واسعة", desc: "فريق من المهندسين والفنيين المحترفين الذين يتمتعون بخبرة طويلة في السوق." },
              { icon: Lightbulb, title: "حلول مبتكرة", desc: "نقدم أفكاراً وتصاميم عصرية تناسب ذوقك وتلبي احتياجاتك الوظيفية." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100 hover:border-primary/30 transition-colors group"
              >
                <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center text-primary shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-black text-white mb-6">هل أنت مستعد لبدء مشروعك؟</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            فريقنا المتخصص بانتظارك لتقديم استشارة مجانية وتحويل أفكارك إلى واقع ملموس.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => openInquiry("استفسار عام", "عام")}
              className="bg-primary hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/30"
            >
              اطلب عرض سعر مجاني
            </Button>
            <Link href="/projects">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-6 text-lg rounded-xl"
              >
                شاهد سابقة أعمالنا
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
