import { useState } from "react";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { InquiryModal } from "@/components/inquiry-modal";
import { SERVICES } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle2, ArrowRight } from "lucide-react";
import NotFound from "./not-found";

export default function ServiceDetail() {
  const params = useParams();
  const service = SERVICES.find(s => s.id === params.id);
  const [modalOpen, setModalOpen] = useState(false);

  if (!service) return <NotFound />;

  // Get related services
  const relatedServices = SERVICES
    .filter(s => s.category === service.category && s.id !== service.id)
    .slice(0, 3);

  return (
    <Layout>
      <InquiryModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        defaultServiceTitle={service.title}
        defaultServiceCategory={service.category}
      />

      <PageHero 
        title={service.title}
        bgImage={service.image}
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "خدماتنا", href: "/services" },
          { label: service.title }
        ]}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 mb-8">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <service.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-primary mb-1 block uppercase tracking-wider">
                      {service.category === 'interior' ? 'ديكور داخلي' : service.category === 'exterior' ? 'أعمال خارجية' : 'صيانة'}
                    </span>
                    <h2 className="text-3xl font-black text-secondary">{service.title}</h2>
                  </div>
                </div>

                <div className="prose prose-lg prose-slate prose-headings:text-secondary max-w-none mb-10" dir="rtl">
                  <p className="text-xl leading-relaxed text-slate-700">
                    {service.description}
                  </p>
                  <p>
                    نقدم في مؤسسة الخطيب هذه الخدمة بأعلى معايير الجودة وبإشراف طاقم فني متخصص يمتلك خبرة طويلة في هذا المجال. نحرص دائماً على استخدام أفضل المواد الخام لضمان ديمومة العمل وجمالية المظهر.
                  </p>
                </div>

                <h3 className="text-2xl font-bold text-secondary mb-6">مميزات الخدمة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                      <span className="font-bold text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-secondary to-blue-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                  <div>
                    <h4 className="text-2xl font-bold mb-2">هل أنت مهتم بهذه الخدمة؟</h4>
                    <p className="text-blue-100">احصل على تسعيرة مجانية واستشارة فنية من خبرائنا.</p>
                  </div>
                  <Button 
                    onClick={() => setModalOpen(true)}
                    size="lg" 
                    className="bg-primary hover:bg-orange-600 text-white rounded-xl shadow-lg shrink-0"
                  >
                    طلب تسعيرة الآن
                    <MessageSquare className="w-5 h-5 mr-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-8">
              {/* Need Help Card */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h3 className="text-xl font-bold text-secondary mb-4">هل تحتاج مساعدة؟</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  فريقنا مستعد دائماً للإجابة على كافة استفساراتك وتقديم النصيحة الفنية المناسبة لمشروعك.
                </p>
                <Button 
                  onClick={() => setModalOpen(true)}
                  className="w-full bg-secondary hover:bg-blue-900 text-white rounded-xl mb-3"
                >
                  تواصل معنا
                </Button>
              </div>

              {/* Related Services */}
              {relatedServices.length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
                  <h3 className="text-xl font-bold text-secondary mb-6 pb-4 border-b border-slate-100">خدمات ذات صلة</h3>
                  <div className="space-y-4">
                    {relatedServices.map(rs => (
                      <Link key={rs.id} href={`/services/${rs.id}`} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                          <rs.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-secondary text-sm group-hover:text-primary transition-colors">{rs.title}</h4>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
