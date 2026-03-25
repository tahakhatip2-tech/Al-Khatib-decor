import { useParams } from "wouter";
import { Layout } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { PROJECTS } from "@/data/mock-data";
import { Calendar, Tag } from "lucide-react";
import NotFound from "./not-found";
import { format, parseISO } from "date-fns";

export default function ProjectDetail() {
  const params = useParams();
  const project = PROJECTS.find(p => p.id === params.id);

  if (!project) return <NotFound />;

  return (
    <Layout>
      <PageHero 
        title={project.title}
        bgImage={project.image}
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "مشاريعنا", href: "/projects" },
          { label: project.title }
        ]}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-700">
                <Tag className="w-5 h-5 text-primary" />
                <span className="font-bold">التصنيف:</span>
                <span>{project.category}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-bold">تاريخ الإنجاز:</span>
                <span dir="ltr">{format(parseISO(project.date), 'MMMM yyyy')}</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg prose-slate max-w-none mb-16" dir="rtl">
              <h2 className="text-3xl font-black text-secondary mb-6">تفاصيل المشروع</h2>
              <p className="text-xl leading-relaxed text-slate-700 mb-8">
                {project.description}
              </p>
              <p className="leading-relaxed">
                قامت مؤسسة الخطيب بتسخير كافة طاقاتها الهندسية والفنية لإنجاز هذا المشروع وفقاً لأعلى المواصفات القياسية. تم التركيز على أدق التفاصيل لضمان توافق النتيجة النهائية مع تطلعات العميل، مع الالتزام التام بالجدول الزمني المحدد والميزانية المرصودة.
              </p>
            </div>

            {/* Gallery */}
            <div>
              <h3 className="text-2xl font-black text-secondary mb-8 pb-4 border-b border-slate-100">معرض صور المشروع</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <img 
                    src={project.gallery[0]} 
                    alt="صورة المشروع الرئيسية" 
                    className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
                  />
                </div>
                {project.gallery.slice(1).map((img, idx) => (
                  <div key={idx}>
                    <img 
                      src={img} 
                      alt={`صورة مشروع ${idx + 2}`} 
                      className="w-full h-64 object-cover rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </Layout>
  );
}
