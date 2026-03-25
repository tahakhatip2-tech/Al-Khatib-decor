import { useParams } from "wouter";
import { Layout } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { BLOG_POSTS } from "@/data/mock-data";
import { CalendarDays } from "lucide-react";
import NotFound from "./not-found";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

export default function BlogDetail() {
  const params = useParams();
  const post = BLOG_POSTS.find(p => p.id === params.id);

  if (!post) return <NotFound />;

  return (
    <Layout>
      <PageHero 
        title={post.title}
        bgImage={post.image}
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "المدونة", href: "/blog" },
          { label: "مقال" }
        ]}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex items-center gap-3 text-slate-500 mb-10 pb-6 border-b border-border">
              <CalendarDays className="w-5 h-5 text-primary" />
              <span className="font-medium" dir="ltr">
                {format(parseISO(post.date), 'dd MMMM yyyy', { locale: ar })}
              </span>
            </div>

            {/* Content */}
            <div className="prose prose-lg prose-slate prose-headings:text-secondary max-w-none" dir="rtl">
              <p className="text-xl leading-relaxed text-slate-700 font-medium mb-8">
                {post.excerpt}
              </p>
              
              <div className="text-slate-700 leading-loose space-y-6">
                {/* Simple render of text, ideally this would be markdown/html */}
                {post.content.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Share/Footer could go here */}
            <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
              <span className="font-bold text-secondary">شارك المقال:</span>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                  f
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                  in
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-primary hover:text-white flex items-center justify-center transition-colors">
                  x
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
