import { Layout } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { CheckCircle2, Target, Eye, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <Layout>
      <PageHero 
        title="من نحن"
        description="تعرف على مسيرتنا ورؤيتنا في تقديم أفضل خدمات المقاولات والتشطيبات."
        // about us office team construction
        bgImage="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&q=80"
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "من نحن" }
        ]}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
            <div className="lg:w-1/2">
              <span className="text-primary font-bold tracking-wider uppercase mb-2 block">قصتنا</span>
              <h2 className="text-4xl font-black text-secondary mb-6 leading-tight">
                مؤسسة الخطيب.. اسم يثق به الكثيرون في عالم المقاولات والديكور
              </h2>
              <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                <p>
                  تأسست مؤسسة الخطيب للمقاولات في العاصمة الأردنية عمان، لتشكل علامة فارقة في مجال التشطيبات والديكور الداخلي والخارجي. على مدار سنوات من العمل الجاد، نجحنا في تنفيذ عشرات المشاريع التي تتحدث عن جودتها واحترافيتنا.
                </p>
                <p>
                  نؤمن بأن كل مساحة لها روحها الخاصة، ومهمتنا هي إبراز هذه الروح من خلال تصاميم مبتكرة وتنفيذ هندسي دقيق بأعلى المواصفات وأفضل الخامات المتوفرة في السوق.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <div className="text-4xl font-black text-primary mb-2">+150</div>
                  <div className="text-secondary font-bold">مشروع منجز</div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <div className="text-4xl font-black text-primary mb-2">100%</div>
                  <div className="text-secondary font-bold">رضا العملاء</div>
                </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "النزاهة والشفافية", desc: "نلتزم بالصدق في كافة تعاملاتنا وتقديم تسعيرات واضحة ومواصفات دقيقة." },
              { icon: CheckCircle2, title: "الجودة العالية", desc: "لا نساوم أبداً على جودة المواد المستخدمة أو دقة التنفيذ في كافة مشاريعنا." },
              { icon: Users, title: "العميل أولاً", desc: "نضع احتياجات ورضا العميل في قمة أولوياتنا ونعمل بشغف لتجاوز توقعاته." }
            ].map((val, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center hover:border-primary/30 transition-colors">
                <div className="w-20 h-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6 text-primary shadow-inner">
                  <val.icon className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-bold text-secondary mb-4">{val.title}</h4>
                <p className="text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
