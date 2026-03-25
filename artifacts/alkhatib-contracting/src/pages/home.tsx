import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { ServiceCard } from "@/components/service-card";
import { InquiryModal } from "@/components/inquiry-modal";
import { SERVICES, PROJECTS, COMPANY_INFO } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, ChevronLeft, Building, HardHat, ShieldCheck, Trophy, ArrowRight, Clock } from "lucide-react";

export default function Home() {
  const [modalState, setModalState] = useState<{isOpen: boolean, serviceTitle?: string, category?: string}>({ isOpen: false });

  const openInquiry = (serviceTitle?: string, category?: string) => {
    setModalState({ isOpen: true, serviceTitle, category });
  };

  const featuredServices = SERVICES.slice(0, 6);
  const featuredProjects = PROJECTS.slice(0, 3);

  return (
    <Layout>
      <InquiryModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ isOpen: false })}
        defaultServiceTitle={modalState.serviceTitle}
        defaultServiceCategory={modalState.category}
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-transparent z-10"></div>
          {/* home hero construction building interior */}
          <img 
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=80" 
            alt="Hero Construction" 
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0 z-10 opacity-30"
            style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-pattern.png)`, backgroundSize: 'cover' }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-sm font-bold tracking-wider">الجودة والاحترافية عنواننا</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
            >
              نبني أحلامكم <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-orange-400">بأساس متين</span> وتصاميم عصرية
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl"
            >
              {COMPANY_INFO.name} تقدم كافة أعمال التشطيبات والديكور وصيانة المباني بلمسة احترافية تعكس شخصيتك، مع التزام تام بالمواعيد وأعلى معايير الجودة.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                onClick={() => openInquiry()}
                size="lg" 
                className="bg-primary hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
              >
                اطلب استشارة مجانية
              </Button>
              <Link href="/projects">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
                >
                  شاهد أعمالنا
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Stats */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden lg:flex absolute bottom-10 left-10 z-20 gap-4"
        >
          <div className="glass-card p-6 rounded-2xl">
            <div className="text-4xl font-black text-primary mb-1">+150</div>
            <div className="text-sm font-bold text-slate-700">مشروع منجز</div>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <div className="text-4xl font-black text-primary mb-1">+15</div>
            <div className="text-sm font-bold text-slate-700">عام من الخبرة</div>
          </div>
        </motion.div>

        {/* Wave separator */}
        <div className="absolute -bottom-1 left-0 w-full overflow-hidden leading-none z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-[60px]" style={{ transform: 'rotateY(180deg)' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,115.35,189.9,94.34C236.4,77.78,279.7,64.22,321.39,56.44Z" className="fill-background"></path>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-bold tracking-wider uppercase mb-2 block">خدماتنا المميزة</span>
            <h2 className="text-4xl font-black text-secondary mb-4">حلول متكاملة للبناء والتشطيب</h2>
            <p className="text-slate-600 text-lg">
              نقدم مجموعة واسعة من الخدمات التي تغطي كافة احتياجاتك من التصميم إلى التسليم المفتاحي، مع ضمان الجودة العالية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <ServiceCard 
                  {...service} 
                  onInquiry={() => openInquiry(service.title, service.category)} 
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" size="lg" className="rounded-xl border-2 border-secondary text-secondary hover:bg-secondary hover:text-white group">
                تصفح كافة الخدمات
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Why Us */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                {/* home interior construction process */}
                <img 
                  src="https://pixabay.com/get/g7eecc74e04386bc1b83919bd663a337032898b4f699f5004ac3a106281f3787495b7ff6a217fe67251ebfa5f13c5908d14eb602b21bf2082784a8adfbe7e841c_1280.jpg" 
                  alt="Why Choose Us" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-secondary text-white p-8 rounded-2xl shadow-xl z-20 hidden md:block max-w-xs">
                <div className="text-primary mb-4">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <h4 className="text-xl font-bold mb-2">ضمان حقيقي</h4>
                <p className="text-sm text-slate-300">نقدم ضمانات حقيقية على كافة أعمال التنفيذ والمواد المستخدمة لراحة بالك.</p>
              </div>
            </div>

            <div className="lg:w-1/2">
              <span className="text-primary font-bold tracking-wider uppercase mb-2 block">لماذا نحن؟</span>
              <h2 className="text-3xl md:text-4xl font-black text-secondary mb-6">نبني ثقتنا من خلال العمل المتقن والالتزام التام</h2>
              
              <div className="space-y-6 mt-8">
                {[
                  { icon: Trophy, title: "جودة لا تضاهى", desc: "نستخدم أفضل المواد وأحدث التقنيات لضمان مخرجات تفوق التوقعات." },
                  { icon: Clock, title: "التزام بالمواعيد", desc: "نحترم وقت عملائنا ونلتزم بجدول زمني صارم للتسليم." },
                  { icon: HardHat, title: "فريق هندسي متخصص", desc: "أعمالنا تحت إشراف نخبة من المهندسين والفنيين ذوي الخبرة الطويلة." },
                  { icon: Building, title: "حلول اقتصادية وذكية", desc: "نقدم أفضل الخيارات التي تناسب ميزانيتك دون المساومة على الجودة." }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-secondary mb-1">{item.title}</h4>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-2xl">
              <span className="text-primary font-bold tracking-wider uppercase mb-2 block">معرض الأعمال</span>
              <h2 className="text-4xl font-black text-secondary">مشاريع نفخر بها</h2>
            </div>
            <Link href="/projects">
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 group">
                عرض كل المشاريع
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] block"
              >
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <span className="text-primary font-bold text-sm mb-2">{project.category}</span>
                  <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                  <Link href={`/projects/${project.id}`}>
                    <Button variant="link" className="text-white p-0 h-auto font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      تفاصيل المشروع <ArrowLeft className="w-4 h-4 mr-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-gradient-primary rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-black mb-4">هل لديك مشروع قادم؟</h2>
              <p className="text-white/90 text-lg">
                دعنا نتحدث عن مشروعك. فريقنا مستعد لتقديم استشارة مجانية وتقديم أفضل العروض التي تناسب ميزانيتك وتطلعاتك.
              </p>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <Button 
                onClick={() => openInquiry("استفسار عام", "عام")}
                size="lg" 
                className="w-full md:w-auto bg-white text-primary hover:bg-slate-50 px-8 py-6 text-xl font-bold rounded-xl shadow-xl hover:scale-105 transition-transform"
              >
                تواصل معنا الآن
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
