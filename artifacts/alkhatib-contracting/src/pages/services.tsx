import { useState } from "react";
import { Layout } from "@/components/layout";
import { PageHero } from "@/components/page-hero";
import { ServiceCard } from "@/components/service-card";
import { InquiryModal } from "@/components/inquiry-modal";
import { SERVICES } from "@/data/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function Services() {
  const [modalState, setModalState] = useState<{isOpen: boolean, serviceTitle?: string, category?: string}>({ isOpen: false });

  const openInquiry = (serviceTitle?: string, category?: string) => {
    setModalState({ isOpen: true, serviceTitle, category });
  };

  const categories = [
    { id: "all", label: "الكل" },
    { id: "interior", label: "ديكور داخلي" },
    { id: "exterior", label: "أعمال خارجية" },
    { id: "maintenance", label: "صيانة وترميم" }
  ];

  return (
    <Layout>
      <InquiryModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ isOpen: false })}
        defaultServiceTitle={modalState.serviceTitle}
        defaultServiceCategory={modalState.category}
      />

      <PageHero 
        title="خدماتنا"
        description="نقدم باقة متكاملة من خدمات التشطيبات والديكور الداخلي والخارجي بأعلى معايير الجودة للقطاعين السكني والتجاري."
        // services hero interior luxury
        bgImage="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80"
        breadcrumbs={[
          { label: "الرئيسية", href: "/" },
          { label: "خدماتنا" }
        ]}
      />

      <section className="py-20 bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4">
          
          <Tabs defaultValue="all" className="w-full" dir="rtl">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-white shadow-md p-1 h-auto rounded-xl flex-wrap justify-center">
                {categories.map(cat => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="text-base px-6 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-bold"
                  >
                    {cat.label}
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
                  {SERVICES
                    .filter(service => cat.id === "all" || service.category === cat.id)
                    .map(service => (
                      <ServiceCard 
                        key={service.id}
                        {...service} 
                        onInquiry={() => openInquiry(service.title, service.category)} 
                      />
                  ))}
                </motion.div>
                
                {SERVICES.filter(service => cat.id === "all" || service.category === cat.id).length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-slate-500 text-lg">لا توجد خدمات في هذا القسم حالياً.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

        </div>
      </section>
    </Layout>
  );
}
