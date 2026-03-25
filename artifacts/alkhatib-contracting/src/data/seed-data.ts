export async function seedDatabase() {
  const services = [
    { title: "الجبس والديكور", category: "interior", description: "أحدث تصاميم الجبس بورد والديكورات الداخلية", icon: "LayoutTemplate", images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"], features: ["تصاميم عصرية", "تنفيذ دقيق"], isActive: true, sortOrder: 1 },
    { title: "الدهان الداخلي", category: "interior", description: "تنفيذ كافة أعمال الدهانات الداخلية", icon: "Paintbrush", images: ["https://images.unsplash.com/photo-1562259929-b7e181d8f000?w=800&q=80"], features: ["ألوان كمبيوتر", "معالجة الرطوبة"], isActive: true, sortOrder: 2 },
    { title: "بديل الرخام", category: "interior", description: "تكسيات جدارية عصرية ببديل الرخام", icon: "Home", images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"], features: ["مقاوم للماء", "سهولة التنظيف"], isActive: true, sortOrder: 3 },
    { title: "المطابخ", category: "interior", description: "تفصيل وتركيب أحدث تصاميم المطابخ", icon: "Scissors", images: ["https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80"], features: ["أخشاب وألمنيوم", "إكسسوارات عالية الجودة"], isActive: true, sortOrder: 4 },
    { title: "جلي البلاط", category: "interior", description: "إعادة اللمعان لأرضياتك", icon: "Diamond", images: ["https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&q=80"], features: ["جلي كريستال", "تلميع وحماية"], isActive: true, sortOrder: 5 },
    { title: "التصميم الداخلي", category: "interior", description: "تصاميم داخلية متكاملة 3D", icon: "PenTool", images: ["https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80"], features: ["تصاميم 3D", "تنسيق الألوان"], isActive: true, sortOrder: 6 },
    { title: "الدهان الخارجي", category: "exterior", description: "دهانات خارجية مقاومة", icon: "Paintbrush", images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"], features: ["مقاومة للشمس", "ثبات الألوان"], isActive: true, sortOrder: 7 },
    { title: "العزل", category: "exterior", description: "حلول عزل مائي وحراري", icon: "MountainSnow", images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"], features: ["عزل أسطح", "ضمان لسنوات"], isActive: true, sortOrder: 8 },
    { title: "القصارة الاسبانية", category: "exterior", description: "تشطيبات خارجية راقية", icon: "ShieldAlert", images: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"], features: ["مظهر فخم", "مقاومة للعوامل الجوية"], isActive: true, sortOrder: 9 },
    { title: "ارضيات التطبيع", category: "exterior", description: "أرضيات خارجية صلبة ومزخرفة", icon: "Building2", images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80"], features: ["صلابة ومقاومة", "أشكال طبيعية"], isActive: true, sortOrder: 10 },
    { title: "صيانة وترميم الابنية", category: "maintenance", description: "تجديد كامل للمباني القديمة وصيانتها", icon: "HardHat", images: ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80"], features: ["تدعيم إنشائي", "تحديث شبكات"], isActive: true, sortOrder: 11 }
  ];

  const projects = [
    { title: "مشروع فيلا حي الرابية", category: "سكني", description: "تنفيذ كامل لأعمال التشطيبات للفيلا", location: "عمان, الرابية", completionDate: "2024-03-01", area: "450 متر مربع", images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"], features: ["تشطيبات فاخرة"], isActive: true, isFeatured: true, sortOrder: 1 },
    { title: "مشروع برج عمان التجاري", category: "تجاري", description: "تصميم وتنفيذ مكاتب عصرية", location: "عمان", completionDate: "2023-11-15", area: "1200 متر مربع", images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"], features: ["مساحات مفتوحة", "قواطع زجاجية"], isActive: true, isFeatured: true, sortOrder: 2 },
    { title: "فيلا ديكور ديلوكس", category: "سكني", description: "أعمال الديكور الداخلي والجبس", location: "عمان, عبدون", completionDate: "2024-01-20", area: "600 متر مربع", images: ["https://images.unsplash.com/photo-1600607687931-cebf66711515?w=800&q=80"], features: ["إضاءة مخفية"], isActive: true, isFeatured: true, sortOrder: 3 },
    { title: "مشروع مجمع النرجس السكني", category: "سكني", description: "دهانات خارجية وعزل للمجمع", location: "عمان, الجبيهة", completionDate: "2023-09-10", area: "2500 متر مربع", images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"], features: ["دهانات بروفايل"], isActive: true, isFeatured: false, sortOrder: 4 },
    { title: "إعادة تأهيل مبنى حكومي", category: "ترميم", description: "تجديد كامل وصيانة المبنى", location: "عمان", completionDate: "2024-02-05", area: "800 متر مربع", images: ["https://images.unsplash.com/photo-1504307651254-35680f356fce?w=800&q=80"], features: ["تحديث السباكة والكهرباء"], isActive: true, isFeatured: true, sortOrder: 5 }
  ];

  for (const s of services) {
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s)
    });
  }

  for (const p of projects) {
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
  }
}
