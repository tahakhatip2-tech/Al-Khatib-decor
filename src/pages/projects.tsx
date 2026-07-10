import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { PROJECTS } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Users, CalendarDays, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Logo } from "@/components/logo";

export default function Projects() {
  const categories = [
    { id: "all", label: "الكل", count: PROJECTS.length },
    { id: "سكني", label: "سكني", count: PROJECTS.filter(p => p.category === "سكني").length },
    { id: "تجاري", label: "تجاري", count: PROJECTS.filter(p => p.category === "تجاري").length },
    { id: "ترميم", label: "ترميم وتجديد", count: PROJECTS.filter(p => p.category === "ترميم").length }
  ];

  return (
    <Layout>
      <Helmet>
        <title>مشاريعنا | مؤسسة الخطيب للمقاولات</title>
        <meta name="description" content="تصفح سجلنا الحافل من المشاريع المنجزة التي تجسد التزامنا بالجودة والاحترافية. مشاريع سكنية، تجارية، وأعمال ترميم في الأردن." />
        <meta property="og:title" content="معرض أعمال مؤسسة الخطيب للمقاولات" />
        <meta property="og:description" content="تصفح سجلنا الحافل من المشاريع المنجزة." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="مشاريع مقاولات, فلل, مجمعات سكنية, مكاتب تجارية, عمان, الأردن" />
        <link rel="canonical" href="https://alkhatib-contracting.com/projects" />
      </Helmet>

      <PageHero 
        title="معرض الأعمال"
        description="تصفح سجلنا الحافل من المشاريع المنجزة التي تجسد التزامنا بالجودة والاحترافية والاهتمام بأدق التفاصيل."
        bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "مشاريعنا" }
        ]}
      />

      {/* Stats Bar */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/20">
            <div className="flex flex-col items-center justify-center p-4">
              <Building2 className="w-10 h-10 mb-4 opacity-80" />
              <div className="text-4xl font-black mb-2">+150</div>
              <div className="text-lg font-bold">مشروع منجز</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <CalendarDays className="w-10 h-10 mb-4 opacity-80" />
              <div className="text-4xl font-black mb-2">+15</div>
              <div className="text-lg font-bold">عام من الخبرة</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <Users className="w-10 h-10 mb-4 opacity-80" />
              <div className="text-4xl font-black mb-2">100%</div>
              <div className="text-lg font-bold">عملاء راضون</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 min-h-[60vh]">
        <div className="container mx-auto px-4">
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
                  {PROJECTS
                    .filter(project => cat.id === "all" || project.category === cat.id)
                    .map((project, idx) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative rounded-3xl overflow-hidden shadow-lg bg-white flex flex-col border border-slate-100 hover:shadow-xl transition-all"
                      >
                        <Link href={`/projects/${project.id}`} className="block relative h-56 sm:h-64 overflow-hidden cursor-pointer">
                          <ImageWithWatermark 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full"
                            imgClassName="transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary font-bold text-xs px-3 py-1 rounded-full shadow-sm pointer-events-none">
                            {project.category}
                          </div>
                        </Link>
                        
                        <div className="p-6 flex flex-col flex-grow">
                          <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                            <h3 className="text-xl font-bold text-secondary mb-3">{project.title}</h3>
                          </Link>
                          <p className="text-slate-600 text-sm line-clamp-2 mb-6 flex-grow">{project.description}</p>
                          <Link href={`/projects/${project.id}`} className="mt-auto block">
                            <span className="w-full bg-slate-50 hover:bg-primary text-secondary hover:text-white border border-slate-100 hover:border-transparent rounded-xl transition-all duration-300 inline-flex items-center justify-center min-h-11 px-4 py-2 text-sm font-bold cursor-pointer group/btn shadow-sm">
                              تفاصيل المشروع 
                              <ArrowLeft className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform" />
                            </span>
                          </Link>
                        </div>
                      </motion.div>
                  ))}
                </motion.div>
                
                {PROJECTS.filter(project => cat.id === "all" || project.category === cat.id).length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-slate-500 text-lg">سيتم إضافة المشاريع قريباً.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-4xl font-black text-white mb-6">ابدأ مشروعك القادم معنا</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            نحن هنا لنحول رؤيتك إلى واقع. فريقنا من المهندسين والفنيين مستعد لتقديم أفضل الحلول التي تناسب ميزانيتك وطموحاتك.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-yellow-600 text-white px-10 py-6 text-xl font-bold rounded-xl shadow-xl hover:scale-105 transition-transform">
                تواصل معنا الآن
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="bg-transparent hover:bg-white/10 text-white border-white/30 px-10 py-6 text-xl rounded-xl">
                تصفح خدماتنا
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
