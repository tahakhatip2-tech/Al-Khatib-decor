import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { PROJECTS } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Projects() {
  return (
    <Layout>
      <PageHero 
        title="معرض الأعمال"
        description="تصفح سجلنا الحافل من المشاريع المنجزة التي تجسد التزامنا بالجودة والاحترافية والاهتمام بأدق التفاصيل."
        // projects architecture modern building
        bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "مشاريعنا" }
        ]}
      />

      <section className="py-24 bg-slate-50 min-h-[60vh]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow flex flex-col group"
              >
                <Link href={`/projects/${project.id}`} className="block relative h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-secondary px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {project.category}
                  </div>
                </Link>
                
                <div className="p-6 flex flex-col flex-grow">
                  <Link href={`/projects/${project.id}`}>
                    <h3 className="text-2xl font-bold text-secondary mb-3 hover:text-primary transition-colors line-clamp-2">{project.title}</h3>
                  </Link>
                  <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {project.description}
                  </p>
                  
                  <Link href={`/projects/${project.id}`} className="mt-auto block">
                    <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary hover:text-white rounded-xl group/btn">
                      استعراض المشروع
                      <ArrowLeft className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {PROJECTS.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">سيتم إضافة المشاريع قريباً.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
