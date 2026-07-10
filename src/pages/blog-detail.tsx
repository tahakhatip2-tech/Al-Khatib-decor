import { useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { BLOG_POSTS, COMPANY_INFO } from "@/data/mock-data";
import { CalendarDays, Clock, Tag, ArrowRight } from "lucide-react";
import NotFound from "./not-found";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { Link } from "wouter";
import { ShareButtons } from "@/components/share-buttons";

const SITE_URL = "https://alkhatib-decor.vercel.app";
const LOGO_URL = `${SITE_URL}/taha.png?v=3`;

export default function BlogDetail() {
  const params = useParams();
  const post = BLOG_POSTS.find(p => p.id === params.id);

  if (!post) return <NotFound />;

  const pageUrl = `${SITE_URL}/blog/${post.id}`;
  const imageUrl = post.image.startsWith("http") ? post.image : LOGO_URL;

  // Related posts (other posts except the current)
  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 2);

  // Estimated reading time
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <Layout>
      {/* ─── Dynamic Open Graph Meta Tags ─── */}
      <Helmet>
        <title>{post.title} | {COMPANY_INFO.name}</title>
        <meta name="description" content={post.excerpt} />

        {/* Open Graph (Facebook / WhatsApp) */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={`${post.title} | ${COMPANY_INFO.name}`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={LOGO_URL} />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:alt" content={COMPANY_INFO.name} />
        <meta property="og:site_name" content={COMPANY_INFO.name} />
        <meta property="og:locale" content="ar_AR" />
        <meta property="article:published_time" content={post.date} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={`${post.title} | ${COMPANY_INFO.name}`} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={LOGO_URL} />
      </Helmet>

      <PageHero
        title={post.title}
        bgImage={post.image}
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "المدونة", href: "/blog" },
          { label: "مقال" }
        ]}
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">

            {/* ─── Main Article ─── */}
            <article className="flex-1 min-w-0">

              {/* Article Header Card */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
                  <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
                    <Tag className="w-3.5 h-3.5" />
                    مقال تقني
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <span dir="ltr">{format(parseISO(post.date), 'dd MMMM yyyy', { locale: ar })}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" />
                    {readingTime} دقيقة للقراءة
                  </span>
                </div>

                {/* Featured Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/7] mb-8 bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Logo watermark on article image */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md flex items-center gap-2 pr-4">
                    <img src="/taha.png" alt={COMPANY_INFO.name} className="w-8 h-8 rounded-full border border-yellow-400 object-contain" />
                    <span className="text-xs font-bold text-secondary">{COMPANY_INFO.name}</span>
                  </div>
                </div>

                {/* Excerpt highlight */}
                <blockquote className="border-r-4 border-primary bg-primary/5 rounded-xl px-6 py-4 mb-8" dir="rtl">
                  <p className="text-lg leading-relaxed text-secondary font-semibold italic">
                    {post.excerpt}
                  </p>
                </blockquote>

                {/* Article content */}
                <div className="prose prose-lg prose-slate prose-headings:text-secondary max-w-none" dir="rtl">
                  <div className="text-slate-700 leading-[2] space-y-6 text-lg">
                    {post.content.split('\n').map((paragraph, idx) => (
                      paragraph.trim() && <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* ─── Share Section ─── */}
              <div className="bg-gradient-to-br from-secondary to-blue-900 rounded-3xl p-8 shadow-lg" dir="rtl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Logo branding */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3 text-white text-center">
                    <div className="w-20 h-20 rounded-full border-3 border-yellow-400 overflow-hidden bg-white shadow-lg flex items-center justify-center">
                      <img src="/taha.png" alt={COMPANY_INFO.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-yellow-400 font-black text-sm leading-tight text-center max-w-24">
                      {COMPANY_INFO.name}
                    </span>
                  </div>

                  {/* Share content */}
                  <div className="flex-1 text-white">
                    <h3 className="text-xl font-black mb-1">أعجبك المقال؟</h3>
                    <p className="text-blue-200 text-sm mb-5">
                      شاركه مع أصدقائك وساعدنا في نشر المعرفة 🙌
                    </p>
                    <ShareButtons
                      url={pageUrl}
                      title={post.title}
                      description={post.excerpt}
                    />
                  </div>
                </div>
              </div>
            </article>

            {/* ─── Sidebar ─── */}
            <aside className="lg:w-72 flex-shrink-0 space-y-6" dir="rtl">

              {/* Company Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="w-20 h-20 rounded-full border-2 border-yellow-400 overflow-hidden mx-auto mb-4 bg-white shadow-md flex items-center justify-center">
                  <img src="/taha.png" alt={COMPANY_INFO.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="font-black text-secondary text-lg mb-1">{COMPANY_INFO.name}</h3>
                <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                  خبراء في أعمال المقاولات والتشطيبات والديكور بجودة عالية واحترافية تامة.
                </p>
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="block w-full bg-primary hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
                >
                  📞 {COMPANY_INFO.phoneDisplay}
                </a>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-black text-secondary mb-5 pb-3 border-b border-slate-100">
                    مقالات ذات صلة
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map(rp => (
                      <Link
                        key={rp.id}
                        href={`/blog/${rp.id}`}
                        className="group flex gap-3 items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                          <img
                            src={rp.image}
                            alt={rp.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {rp.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {format(parseISO(rp.date), 'dd MMM yyyy', { locale: ar })}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:-translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/blog"
                    className="block mt-4 text-center text-sm text-primary font-bold hover:underline"
                  >
                    عرض كل المقالات ←
                  </Link>
                </div>
              )}
            </aside>

          </div>
        </div>
      </section>
    </Layout>
  );
}
