import { useState } from "react";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { InquiryModal } from "@/components/inquiry-modal";
import { ImageGallery } from "@/components/image-gallery";
import { SERVICES } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { MessageSquare, CheckCircle2, ArrowRight, Phone, Tag } from "lucide-react";
import NotFound from "./not-found";
import { COMPANY_INFO } from "@/data/mock-data";

export default function ServiceDetail() {
  const params = useParams();
  const service = SERVICES.find(s => s.id === params.id);
  const [modalOpen, setModalOpen] = useState(false);

  if (!service) return <NotFound />;

  const relatedServices = SERVICES
    .filter(s => s.category === service.category && s.id !== service.id)
    .slice(0, 3);

  const categoryLabel =
    service.category === "interior" ? "ديكور داخلي" :
    service.category === "exterior" ? "أعمال خارجية" : "صيانة";

  // Build gallery: combine main image + any additional images
  const galleryImages = [service.image].filter(Boolean);

  return (
    <Layout>
      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultServiceTitle={service.title}
        defaultServiceCategory={service.category}
      />

      {/* Page Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 right-0 left-0 p-8" dir="rtl">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
              <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-white transition-colors">خدماتنا</Link>
              <span>/</span>
              <span className="text-white">{service.title}</span>
            </div>
            <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-bold mb-2 inline-block">
              {categoryLabel}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white">{service.title}</h1>
          </div>
        </div>
      </div>

      <section className="py-14 bg-background" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── Left: Gallery + Content ── */}
            <div className="lg:w-2/3 space-y-8">

              {/* Gallery */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" /> صور الخدمة
                </h2>
                <ImageGallery images={galleryImages} title={service.title} />
              </div>

              {/* Description */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <service.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary mb-1 block uppercase tracking-wider">{categoryLabel}</span>
                    <h2 className="text-2xl font-black text-secondary">{service.title}</h2>
                  </div>
                </div>

                <div className="prose prose-lg prose-slate max-w-none mb-8" dir="rtl">
                  <p className="text-xl leading-relaxed text-slate-700">{service.description}</p>
                  <p className="leading-relaxed">
                    نقدم في مؤسسة الخطيب هذه الخدمة بأعلى معايير الجودة وبإشراف طاقم فني متخصص يمتلك خبرة طويلة في هذا المجال. نحرص دائماً على استخدام أفضل المواد الخام لضمان ديمومة العمل وجمالية المظهر.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-secondary mb-5">مميزات الخدمة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="font-semibold text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Banner */}
                <div className="bg-gradient-to-l from-secondary to-blue-900 rounded-2xl p-7 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg">
                  <div>
                    <h4 className="text-xl font-bold mb-1">هل أنت مهتم بهذه الخدمة؟</h4>
                    <p className="text-blue-100 text-sm">احصل على تسعيرة مجانية واستشارة فنية من خبرائنا.</p>
                  </div>
                  <div className="flex gap-3 shrink-0 flex-wrap justify-center">
                    <Button
                      onClick={() => setModalOpen(true)}
                      size="lg"
                      className="bg-primary hover:bg-yellow-600 text-white rounded-xl shadow-lg"
                    >
                      <MessageSquare className="w-5 h-5 ml-2" />
                      طلب تسعيرة
                    </Button>
                    <a href={`tel:${COMPANY_INFO.phone}`}>
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary rounded-xl">
                        <Phone className="w-5 h-5 ml-2" />
                        اتصل الآن
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Sidebar ── */}
            <div className="lg:w-1/3 space-y-6">
              {/* Quick Contact */}
              <div className="bg-gradient-to-br from-primary/5 to-yellow-50 rounded-3xl p-7 border border-yellow-100">
                <h3 className="text-xl font-bold text-secondary mb-2">هل تحتاج مساعدة؟</h3>
                <p className="text-slate-600 mb-5 text-sm leading-relaxed">
                  فريقنا مستعد دائماً للإجابة على كافة استفساراتك وتقديم النصيحة الفنية المناسبة لمشروعك.
                </p>
                <Button onClick={() => setModalOpen(true)} className="w-full bg-primary text-white rounded-xl mb-3">
                  <MessageSquare className="w-4 h-4 ml-2" /> إرسال استفسار
                </Button>
                <a href={`tel:${COMPANY_INFO.phone}`} className="block">
                  <Button variant="outline" className="w-full rounded-xl">
                    <Phone className="w-4 h-4 ml-2" /> {COMPANY_INFO.phoneDisplay}
                  </Button>
                </a>
              </div>

              {/* Free Visit CTA */}
              <div className="bg-secondary text-white rounded-3xl p-7 text-center">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">كشف موقع مجاني!</h3>
                <p className="text-blue-200 text-sm mb-5">
                  احجز زيارة مجانية لموقعك ونقيّم احتياجاتك ونقدم لك أفضل الحلول بتسعيرة شفافة.
                </p>
                <Button onClick={() => setModalOpen(true)} className="w-full bg-primary hover:bg-yellow-600 text-white rounded-xl font-bold">
                  احجز الآن مجاناً
                </Button>
              </div>

              {/* Related Services */}
              {relatedServices.length > 0 && (
                <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-secondary mb-5 pb-4 border-b border-slate-100">خدمات ذات صلة</h3>
                  <div className="space-y-3">
                    {relatedServices.map(rs => (
                      <Link key={rs.id} href={`/services/${rs.id}`} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                          <rs.icon className="w-5 h-5" />
                        </div>
                        <span className="flex-1 font-semibold text-slate-700 text-sm">{rs.title}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
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
