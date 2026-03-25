import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { BLOG_POSTS } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

export default function Blog() {
  return (
    <Layout>
      <PageHero 
        title="المدونة"
        description="نشاركك أحدث الأفكار، النصائح، والاتجاهات في عالم البناء والديكور والتشطيبات."
        // blog interior design ideas
        bgImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80"
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "المدونة" }
        ]}
      />

      <section className="py-24 bg-slate-50 min-h-[60vh]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map(post => (
              <article key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col group">
                <Link href={`/blog/${post.id}`} className="block relative h-56 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
                    <CalendarDays className="w-4 h-4" />
                    <span dir="ltr">{format(parseISO(post.date), 'dd MMM yyyy', { locale: ar })}</span>
                  </div>
                </Link>
                
                <div className="p-8 flex flex-col flex-grow">
                  <Link href={`/blog/${post.id}`}>
                    <h3 className="text-2xl font-bold text-secondary mb-4 hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-slate-600 mb-8 leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <Link href={`/blog/${post.id}`} className="mt-auto block">
                    <Button variant="ghost" className="w-full text-secondary hover:text-primary hover:bg-primary/5 group/btn">
                      اقرأ المزيد
                      <ArrowLeft className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
