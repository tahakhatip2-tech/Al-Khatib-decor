import { Paintbrush, Home, Scissors, PenTool, LayoutTemplate, Diamond, MountainSnow, ShieldAlert, Wrench, Building2, HardHat } from "lucide-react";

export const SERVICES = [
  {
    id: "gypsum-decor",
    category: "interior",
    title: "الجبس والديكور الداخلي",
    description: "أحدث تصاميم الجبس بورد والديكورات الداخلية التي تضفي لمسة من الفخامة والجمال على مساحاتك.",
    icon: LayoutTemplate,
    image: "/images/story-1.png",
    gallery: [
      "/images/story-1.png"
    ],
    features: ["تصاميم عصرية وكلاسيكية", "إضاءة مخفية احترافية", "مقاومة للرطوبة", "تنفيذ دقيق وسريع"]
  },
  {
    id: "marble-wood-alt",
    category: "interior",
    title: "بديل الرخام وبديل الخشب",
    description: "تكسيات جدارية عصرية ببديل الرخام والخشب تمنحك مظهر المواد الطبيعية بتكلفة أقل وعملية أكثر.",
    icon: Home,
    image: "/images/hero-3d.png",
    features: ["مقاوم للماء والحرارة", "سهولة التنظيف", "تشكيلة ألوان واسعة", "عمر افتراضي طويل"]
  },
  {
    id: "interior-design",
    category: "interior",
    title: "التصميم الداخلي",
    description: "نحول أفكارك إلى واقع ملموس من خلال تصاميم داخلية متكاملة تراعي الجمالية والوظيفية.",
    icon: PenTool,
    image: "/images/service-painting.png",
    features: ["تصاميم 3D واقعية", "استغلال أمثل للمساحات", "تنسيق الألوان والأثاث", "إشراف هندسي متكامل"]
  },
  {
    id: "all-painting",
    category: "interior",
    title: "الدهان بكل أنواعه",
    description: "تنفيذ كافة أعمال الدهانات الداخلية والخارجية بأفضل المواد لضمان ألوان زاهية وتغطية مثالية.",
    icon: Paintbrush,
    image: "/images/service-painting.png",
    features: ["دهانات سادة وديكورية", "معالجة التشققات والرطوبة", "مواد صديقة للبيئة", "ألوان كمبيوتر دقيقة"]
  },
  {
    id: "kitchens",
    category: "interior",
    title: "المطابخ",
    description: "تفصيل وتركيب أحدث تصاميم المطابخ بخامات عالية الجودة تضمن الاستدامة والعملية.",
    icon: Scissors,
    image: "/images/story-1.png",
    features: ["أخشاب وألمنيوم مقاوم", "إكسسوارات إيطالية", "تصاميم ذكية", "توزيع مثالي لمناطق العمل"]
  },
  {
    id: "floor-polishing",
    category: "interior",
    title: "جلي البلاط والرخام",
    description: "إعادة اللمعان والبريق لأرضياتك من خلال أحدث ماكينات الجلي والتلميع.",
    icon: Diamond,
    image: "/images/hero-3d.png",
    features: ["جلي بالكريستال والألماس", "إزالة البقع العميقة", "تلميع وحماية", "معالجة الفواصل"]
  },
  {
    id: "exterior-painting",
    category: "exterior",
    title: "الدهان الخارجي",
    description: "واجهات جذابة ومحمية من العوامل الجوية بأفضل أنواع الدهانات الخارجية المقاومة.",
    icon: Paintbrush,
    image: "/images/service-painting.png",
    features: ["دهانات بروفايل", "مقاومة للشمس والأمطار", "ثبات الألوان", "تنفيذ للمباني المرتفعة"]
  },
  {
    id: "insulation",
    category: "exterior",
    title: "العزل",
    description: "حلول عزل مائي وحراري متكاملة لحماية المباني من التسربات والحرارة المرتفعة.",
    icon: MountainSnow,
    image: "/images/hero-3d.png",
    features: ["عزل أسطح وخزانات", "استخدام رولات ومواد سائلة", "ضمان لسنوات", "توفير في استهلاك الطاقة"]
  },
  {
    id: "spanish-plaster",
    category: "exterior",
    title: "القصارة الاسبانية",
    description: "تشطيبات خارجية راقية باستخدام تقنية القصارة الإسبانية التي تمنح واجهتك مظهر الحجر الطبيعي.",
    icon: ShieldAlert,
    image: "/images/story-1.png",
    features: ["مظهر فخم ومميز", "مقاومة عالية للعوامل الجوية", "لا تحتاج لدهان مستقبلي", "عزل إضافي للجدران"]
  },
  {
    id: "normalization-floors",
    category: "exterior",
    title: "ارضيات التطبيع",
    description: "أرضيات خارجية صلبة ومزخرفة (خرسانة مطبوعة) للساحات والممرات والحدائق.",
    icon: Building2,
    image: "/images/hero-3d.png",
    features: ["صلابة ومقاومة للاحتكاك", "أشكال وألوان تحاكي الطبيعة", "سريعة التنفيذ", "عمر افتراضي طويل"]
  },
  {
    id: "floor-maintenance",
    category: "exterior",
    title: "صيانة الارضيات",
    description: "خدمات شاملة لصيانة وتجديد كافة أنواع الأرضيات الداخلية والخارجية وإصلاح العيوب.",
    icon: Wrench,
    image: "/images/service-painting.png",
    features: ["إصلاح التشققات والهبوط", "معالجة الرطوبة", "إعادة الترويب", "استبدال التالف"]
  },
  {
    id: "building-maintenance",
    category: "maintenance",
    title: "صيانة وترميم الابنية",
    description: "تجديد كامل للمباني القديمة وصيانتها هيكلياً ومعمارياً لتعود كأنها جديدة.",
    icon: HardHat,
    image: "/images/story-1.png",
    features: ["تدعيم إنشائي", "تحديث شبكات السباكة والكهرباء", "تعديل التوزيع الداخلي", "تشطيبات متكاملة للمفتاح"]
  }
];

export const PROJECTS = [
  {
    id: "proj-1",
    title: "فيلا عبدون - تشطيب سوبر ديلوكس",
    category: "سكني",
    image: "/images/story-1.png",
    gallery: [
      "/images/story-1.png"
    ],
    date: "2024-02-15",
    description: "تنفيذ كامل لأعمال التشطيبات الداخلية والخارجية لفيلا في منطقة عبدون، شملت أعمال الديكور الجبسي، الدهانات الإيطالية، والأرضيات الرخامية الفاخرة."
  },
  {
    id: "proj-2",
    title: "مكاتب شركة إيتيك - مكة مول",
    category: "تجاري",
    image: "/images/hero-3d.png",
    gallery: [
      "/images/hero-3d.png"
    ],
    date: "2023-11-10",
    description: "تصميم وتنفيذ مكاتب عصرية بنظام المساحات المفتوحة، مع تركيب قواطع زجاجية وأسقف مستعارة وأرضيات مرتفعة."
  },
  {
    id: "proj-3",
    title: "ترميم وتجديد شقة - جبل الحسين",
    category: "ترميم",
    image: "/images/service-painting.png",
    gallery: [
      "/images/service-painting.png"
    ],
    date: "2024-01-05",
    description: "عملية تجديد شاملة لشقة قديمة شملت تغيير البنية التحتية من سباكة وكهرباء، وإعادة تصميم الفراغات الداخلية بتشطيبات حديثة."
  }
];

export const BLOG_POSTS = [
  {
    id: "post-1",
    title: "أحدث صيحات الديكور الداخلي لعام 2024",
    excerpt: "تعرف على أبرز الألوان والخامات التي تتصدر مشهد التصميم الداخلي هذا العام وكيفية توظيفها في مساحتك.",
    image: "/images/story-1.png",
    date: "2024-03-01",
    content: "يعتبر عام 2024 عام العودة للطبيعة والألوان الدافئة في التصميم الداخلي. تبرز ألوان التراكوتا، والأخضر الزيتوني، والأزرق العميق كخيارات مفضلة للمصممين. كما أن استخدام بديل الخشب وبديل الرخام يشهد إقبالاً غير مسبوق نظراً لعمليته وجماليته..."
  },
  {
    id: "post-2",
    title: "أهمية العزل المائي قبل حلول فصل الشتاء",
    excerpt: "خطوات ضرورية لحماية منزلك من تسربات المياه والرطوبة وتوفير تكاليف الصيانة الباهظة.",
    image: "/images/hero-3d.png",
    date: "2023-10-15",
    content: "تعتبر مشاكل تسرب المياه من أخطر ما يهدد سلامة المباني ويشوه مظهرها. العزل المائي للأسطح ليس مجرد خيار رفاهية، بل هو ضرورة حتمية لإطالة عمر المبنى. في مؤسسة الخطيب نستخدم أحدث تقنيات العزل بالرولات والمواد البولي يوريثان لضمان حماية تمتد لسنوات طويلة..."
  },
  {
    id: "post-3",
    title: "كيف تختار الدهان المناسب لواجهة منزلك؟",
    excerpt: "دليلك الشامل لاختيار دهانات خارجية تصمد أمام العوامل الجوية وتحافظ على رونقها.",
    image: "/images/service-painting.png",
    date: "2024-01-20",
    content: "اختيار دهان الواجهات يختلف كلياً عن الدهانات الداخلية. يجب مراعاة عوامل مثل مقاومة الأشعة فوق البنفسجية، والعزل المائي، ومقاومة تراكم الأتربة. نوصي باستخدام الدهانات الأكريليكية عالية الجودة أو القصارة الإسبانية التي أثبتت جدارتها في مناخ منطقتنا..."
  }
];

export const COMPANY_INFO = {
  name: "مؤسسة الخطيب للمقاولات",
  phone: "0782633162",
  phoneDisplay: "078 263 3162",
  address: "عمان - جبل - حي عدن",
  hours: "من السبت للخميس من 8 صباحاً الى 6 مساءً",
  email: "info@alkhatib-contracting.com"
};
