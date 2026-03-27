import { useState } from "react";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { InquiryModal } from "@/components/inquiry-modal";
import { ImageGallery } from "@/components/image-gallery";
import { PROJECTS, COMPANY_INFO } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, MapPin, Ruler, MessageSquare, Phone, ArrowRight } from "lucide-react";
import NotFound from "./not-found";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

export default function ProjectDetail() {
  const params = useParams();
  const project = PROJECTS.find(p => p.id === params.id);
  const [modalOpen, setModalOpen] = useState(false);

  if (!project) return <NotFound />;

  // Build full gallery from main image + gallery array
  const allImages = [project.image, ...(project.gallery || [])].filter(Boolean);

  const relatedProjects = PROJECTS
    .filter(p => p.category === project.category && p.id !== project.id)
    .slice(0, 2);

  return (
    <Layout>
      <InquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultServiceTitle={`${project.category} - ${project.title}`}
        defaultServiceCategory="maintenance"
      />

      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 right-0 left-0 p-8" dir="rtl">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
              <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link href="/projects" className="hover:text-white transition-colors">مشاريعنا</Link>
              <span>/</span>
              <span className="text-white">{project.title}</span>
            </div>
            <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-bold mb-2 inline-block">
              {project.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white">{project.title}</h1>
          </div>
        </div>
      </div>

      <section className="py-14 bg-background" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── Main Content ── */}
            <div className="lg:w-2/3 space-y-8">

              {/* Gallery Section - Product Style */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-700 mb-4">معرض صور المشروع</h2>
                <ImageGallery images={allImages} title={project.title} />
              </div>

              {/* Project Info */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-black text-secondary mb-6">تفاصيل المشروع</h2>

                {/* Meta Chips */}
                <div className="flex flex-wrap gap-3 mb-7">
                  <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold">
                    <Tag className="w-4 h-4" /> {project.category}
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full font-semibold">
                    <Calendar className="w-4 h-4" />
                    <span dir="ltr">{format(parseISO(project.date), "MMMM yyyy", { locale: ar })}</span>
                  </div>
                  {project.gallery?.length > 0 && (
                    <div className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-4 py-2 rounded-full font-semibold">
                      📸 {allImages.length} صورة
                    </div>
                  )}
                </div>

                <div className="prose prose-lg prose-slate max-w-none mb-8" dir="rtl">
                  <p className="text-xl leading-relaxed text-slate-700">{project.description}</p>
                  <p className="leading-relaxed">
                    قامت مؤسسة الخطيب بتسخير كافة طاقاتها الهندسية والفنية لإنجاز هذا المشروع وفقاً لأعلى المواصفات القياسية. تم التركيز على أدق التفاصيل لضمان توافق النتيجة النهائية مع تطلعات العميل، مع الالتزام التام بالجدول الزمني المحدد والميزانية المرصودة.
                  </p>
                </div>

                {/* CTA Banner */}
                <div className="bg-gradient-to-l from-primary to-yellow-500 rounded-2xl p-7 text-white flex flex-col md:flex-row items-center justify-between gap-5">
                  <div>
                    <h4 className="text-xl font-bold mb-1">أعجبك هذا المشروع؟</h4>
                    <p className="text-yellow-100 text-sm">ننفذ لك مشروعاً مماثلاً بنفس الجودة أو أفضل!</p>
                  </div>
                  <div className="flex gap-3 shrink-0 flex-wrap justify-center">
                    <Button onClick={() => setModalOpen(true)} size="lg" className="bg-white text-primary hover:bg-yellow-50 rounded-xl font-bold shadow-lg">
                      <MessageSquare className="w-5 h-5 ml-2" /> طلب تسعيرة
                    </Button>
                    <a href={`tel:${COMPANY_INFO.phone}`}>
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-xl">
                        <Phone className="w-5 h-5 ml-2" /> اتصل الآن
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:w-1/3 space-y-6">
              {/* Contact Widget */}
              <div className="bg-gradient-to-br from-secondary to-blue-900 text-white rounded-3xl p-7">
                <h3 className="text-lg font-bold mb-2">هل تريد مشروعاً مشابهاً؟</h3>
                <p className="text-blue-200 text-sm mb-5 leading-relaxed">
                  تواصل معنا الآن وسنرسل خبيرنا لكشف وتقييم موقعك مجاناً دون أي التزام.
                </p>
                <Button onClick={() => setModalOpen(true)} className="w-full bg-primary hover:bg-yellow-600 text-white rounded-xl font-bold mb-3">
                  <MessageSquare className="w-4 h-4 ml-2" /> احجز كشف مجاني
                </Button>
                <a href={`tel:${COMPANY_INFO.phone}`} className="block">
                  <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 rounded-xl">
                    <Phone className="w-4 h-4 ml-2" /> {COMPANY_INFO.phoneDisplay}
                  </Button>
                </a>
              </div>

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-secondary mb-4 pb-3 border-b border-slate-100">مشاريع مشابهة</h3>
                  <div className="space-y-3">
                    {relatedProjects.map(rp => (
                      <Link key={rp.id} href={`/projects/${rp.id}`} className="group flex gap-3 items-center p-2 rounded-xl hover:bg-slate-50 transition-colors">
                        <img
                          src={rp.image}
                          alt={rp.title}
                          className="w-16 h-14 rounded-xl object-cover flex-shrink-0"
                          onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/64x56?text=..."; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm line-clamp-2">{rp.title}</p>
                          <p className="text-xs text-slate-400 mt-1">{rp.category}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                  <Link href="/projects" className="block mt-4 text-center text-sm text-primary font-semibold hover:underline">
                    عرض جميع المشاريع ←
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
}
