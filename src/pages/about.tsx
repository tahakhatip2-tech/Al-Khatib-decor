import { Layout } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { CheckCircle2, Target, Eye, ShieldCheck, Users, Trophy, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export default function About() {
  const timeline = [
    { year: "2008", title: "التأسيس والانطلاقة", desc: "بدأنا برؤية طموحة لتقديم خدمات مقاولات متميزة في عمان." },
    { year: "2012", title: "توسيع الخدمات", desc: "أضفنا خدمات التصميم الداخلي والديكور لتوفير حلول متكاملة." },
    { year: "2016", title: "مشاريع كبرى", desc: "تنفيذ أول مشروع تجاري ضخم وبناء شراكات استراتيجية." },
    { year: "2020", title: "التحول الرقمي", desc: "اعتماد أحدث التقنيات الهندسية وبرامج التصميم 3D." },
    { year: "2024", title: "الريادة محلياً", desc: "نفتخر بكوننا من رواد قطاع المقاولات والتشطيبات في الأردن." }
  ];

  return (
    <Layout>
      <Helmet>
        <title>من نحن | مؤسسة الخطيب للمقاولات</title>
        <meta name="description" content="تعرف على مؤسسة الخطيب للمقاولات، رحلتنا، رؤيتنا، وقيمنا في تقديم أفضل خدمات البناء والتشطيبات والديكور في الأردن." />
        <meta property="og:title" content="من نحن - مؤسسة الخطيب للمقاولات" />
        <meta property="og:description" content="قصة نجاحنا ورؤيتنا في عالم المقاولات والتشطيبات." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="عن مؤسسة الخطيب, مقاولات, تاريخ الشركة, فريق العمل, عمان, الأردن" />
        <link rel="canonical" href="https://alkhatib-contracting.com/about" />
      </Helmet>

      <PageHero 
        title="من نحن"
        description="تعرف على مسيرتنا ورؤيتنا في تقديم أفضل خدمات المقاولات والتشطيبات."
        bgImage="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&q=80"
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "من نحن" }
        ]}
      />

      {/* Stats Bar */}
      <section className="bg-primary text-white py-10 relative z-20 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-2xl shadow-xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-x-reverse divide-white/20">
            <div>
              <div className="text-4xl font-black mb-2">+150</div>
              <div className="text-sm font-bold opacity-80">مشروع منجز</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">+15</div>
              <div className="text-sm font-bold opacity-80">عام من الخبرة</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">100%</div>
              <div className="text-sm font-bold opacity-80">رضا العملاء</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">+40</div>
              <div className="text-sm font-bold opacity-80">خبير ومهندس</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background pt-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
            <div className="lg:w-1/2">
              <span className="text-primary font-bold tracking-wider uppercase mb-2 block">قصتنا</span>
              <h2 className="text-4xl font-black text-secondary mb-6 leading-tight">
                مؤسسة الخطيب.. اسم يثق به الكثيرون في عالم المقاولات والديكور
              </h2>
              <div className="space-y-4 text-lg text-slate-600 leading-relaxed border-r-4 border-primary pr-4 bg-slate-50 p-6 rounded-l-2xl">
                <p>
                  تأسست مؤسسة الخطيب للمقاولات في العاصمة الأردنية عمان، لتشكل علامة فارقة في مجال التشطيبات والديكور الداخلي والخارجي. على مدار سنوات من العمل الجاد، نجحنا في تنفيذ عشرات المشاريع التي تتحدث عن جودتها واحترافيتنا.
                </p>
                <p>
                  نؤمن بأن كل مساحة لها روحها الخاصة، ومهمتنا هي إبراز هذه الروح من خلال تصاميم مبتكرة وتنفيذ هندسي دقيق بأعلى المواصفات وأفضل الخامات المتوفرة في السوق.
                </p>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=800&q=80" 
                  alt="فريق العمل" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-secondary/10"></div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary rounded-3xl -z-10 blur-2xl opacity-20"></div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-black text-secondary mb-4">مسيرة التطور والنجاح</h2>
              <p className="text-slate-600 text-lg">محطات رئيسية شكلت هويتنا وخبرتنا عبر السنين</p>
            </div>
            
            <div className="relative border-r-4 border-primary/20 pr-8 md:pr-0 md:border-r-0 max-w-4xl mx-auto">
              {/* Desktop Center Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-primary/20 transform -translate-x-1/2"></div>
              
              <div className="space-y-12">
                {timeline.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Node Dot */}
                    <div className="absolute right-[-21px] md:static md:right-auto md:left-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white shadow-md transform md:-translate-x-1/2 z-10 flex-shrink-0"></div>
                    
                    {/* Content */}
                    <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'} bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow`}>
                      <span className="text-3xl font-black text-slate-200 block mb-2">{item.year}</span>
                      <h4 className="text-xl font-bold text-secondary mb-2">{item.title}</h4>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-secondary text-white p-10 rounded-3xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 text-white/5">
                <Eye className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-black mb-4">رؤيتنا</h3>
                <p className="text-lg text-slate-300 leading-relaxed">
                  أن نكون الخيار الأول والرائد في تقديم خدمات التشطيبات والديكور في الأردن، من خلال الارتقاء بمعايير الجودة وتقديم تصاميم تدمج بين الجمال والوظيفية.
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-primary text-white p-10 rounded-3xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 text-black/5">
                <Target className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black mb-4">رسالتنا</h3>
                <p className="text-lg text-white/90 leading-relaxed">
                  تحويل رؤية عملائنا إلى واقع ملموس بدقة عالية واحترافية لا تضاهى، مع توفير بيئة عمل آمنة لفريقنا والالتزام بمسؤولياتنا تجاه المجتمع.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Values */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-bold tracking-wider uppercase mb-2 block">قيمنا الأساسية</span>
            <h2 className="text-4xl font-black text-secondary">المبادئ التي تقود عملنا</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {[
              { icon: ShieldCheck, title: "الجودة", desc: "لا نساوم أبداً على جودة المواد أو دقة التنفيذ." },
              { icon: CheckCircle2, title: "الأمانة", desc: "نلتزم بالشفافية والصدق في كافة تعاملاتنا." },
              { icon: Award, title: "الابتكار", desc: "نقدم حلولاً وتصاميم إبداعية تواكب العصر." },
              { icon: Clock, title: "الالتزام", desc: "نحترم الوقت ونلتزم بجدول زمني دقيق للإنجاز." }
            ].map((val, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center hover:border-primary/30 hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-sm border border-slate-100">
                  <val.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-secondary mb-3">{val.title}</h4>
                <p className="text-slate-600 text-sm">{val.desc}</p>
              </div>
            ))}
          </div>
          
          {/* Team Grid */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-bold tracking-wider uppercase mb-2 block">فريق العمل</span>
            <h2 className="text-4xl font-black text-secondary">كوادر هندسية وفنية محترفة</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {[
              { name: "م. طارق الخطيب", role: "المدير العام", exp: "+20 سنة خبرة" },
              { name: "م. سارة العلي", role: "مديرة التصميم الداخلي", exp: "+10 سنوات خبرة" },
              { name: "خالد حسن", role: "مدير المشاريع", exp: "+15 سنة خبرة" },
              { name: "م. رامي سعد", role: "مهندس تنفيذي", exp: "+8 سنوات خبرة" }
            ].map((member, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-3xl bg-slate-100 aspect-[3/4]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-secondary/90 z-10"></div>
                <div className="absolute inset-0 bg-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                  <Users className="w-20 h-20 text-slate-400" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">{member.exp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Certifications and Awards */}
          <div className="bg-slate-50 rounded-3xl p-10 md:p-16 text-center border border-slate-100">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-secondary mb-6">الاعتمادات والشهادات</h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-10 text-lg">
              حاصلون على تصنيفات واعتمادات محلية في قطاع المقاولات، وملتزمون بتطبيق معايير السلامة والجودة العالمية (ISO) في جميع مشاريعنا لضمان تقديم مخرجات موثوقة ومستدامة.
            </p>
            <div className="flex flex-wrap justify-center gap-6 opacity-70 grayscale">
              <div className="h-16 w-40 bg-slate-200 rounded flex items-center justify-center font-bold text-slate-500">ISO 9001</div>
              <div className="h-16 w-40 bg-slate-200 rounded flex items-center justify-center font-bold text-slate-500">نقابة المقاولين</div>
              <div className="h-16 w-40 bg-slate-200 rounded flex items-center justify-center font-bold text-slate-500">الأمن والسلامة</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
