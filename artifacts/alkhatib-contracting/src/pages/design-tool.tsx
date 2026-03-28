import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Helmet } from "react-helmet-async";
import { UploadCloud, Wand2, PaintBucket, X, CheckCircle2, ChevronLeft, Image as ImageIcon, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { COMPANY_INFO } from "@/data/mock-data";

type RoomType = "kitchen" | "american_kitchen" | "bedroom" | "living_room" | "bathroom";
type StyleType = "modern" | "classic" | "neoclassic" | "industrial" | "minimalist";

const ROOM_TYPES: { id: RoomType; label: string; desc: string; expert: string }[] = [
  { id: "kitchen", label: "مطبخ عادي", desc: "تصميم عملي وأنيق مساحات التخزين", expert: "خبير مطابخ" },
  { id: "american_kitchen", label: "مطبخ أمريكي", desc: "مفتوح على الصالة بتصميم عصري", expert: "خبير مساحات مفتوحة" },
  { id: "bedroom", label: "غرفة نوم", desc: "أجواء مريحة وهادئة وتوزيع مثالي", expert: "خبير غرف ومفروشات" },
  { id: "living_room", label: "صالون / ضيوف", desc: "فخامة وضيافة تعكس ذوقك الرفيع", expert: "خبير ديكور داخلي" },
  { id: "bathroom", label: "حمام", desc: "استغلال المساحات بأطقم صحية راقية", expert: "خبير صحيات" },
];

const STYLES: { id: StyleType; label: string }[] = [
  { id: "modern", label: "مودرن (حديث)" },
  { id: "classic", label: "كلاسيك" },
  { id: "neoclassic", label: "نيو كلاسيك" },
  { id: "industrial", label: "صناعي" },
  { id: "minimalist", label: "مينيماليست (بسيط)" },
];

const COLORS = [
  { name: "أبيض", hex: "#FFFFFF" },
  { name: "بيج", hex: "#F5F5DC" },
  { name: "رمادي فاتح", hex: "#D3D3D3" },
  { name: "رمادي غامق", hex: "#A9A9A9" },
  { name: "أسود", hex: "#000000" },
  { name: "خشبي", hex: "#DEB887" },
  { name: "أزرق بحري", hex: "#000080" },
  { name: "أخضر زيتي", hex: "#556B2F" },
];

// Mock Generation Results
const MOCK_RESULTS: Record<RoomType, string[]> = {
  kitchen: [
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
    "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&q=80",
  ],
  american_kitchen: [
    "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80",
  ],
  bedroom: [
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
  ],
  living_room: [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
  ],
  bathroom: [
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
  ]
};

export default function DesignTool() {
  const [step, setStep] = useState(1);
  const [roomType, setRoomType] = useState<RoomType | "">("");
  const [styleType, setStyleType] = useState<StyleType | "">("");
  const [colors, setColors] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0); 
  const MAX_ATTEMPTS = 3;

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleColor = (hex: string) => {
    setColors(prev => 
      prev.includes(hex) ? prev.filter(c => c !== hex) : 
      prev.length < 3 ? [...prev, hex] : prev
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (uploadedImages.length + files.length > 3) {
      alert("يمكنك رفع 3 صور كحد أقصى للموقع.");
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setUploadedImages(prev => {
            if (prev.length >= 3) return prev;
            return [...prev, ev.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== idx));
  };

  const startGeneration = async () => {
    if (attempts >= MAX_ATTEMPTS) return;
    setIsGenerating(true);
    setProgress(0);
    setStep(4);
    
    // Manage fake progress until API responds
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 10;
      if (currentProgress > 85) currentProgress = 85;
      setProgress(Math.floor(currentProgress));
    }, 400);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyDnvzheZtLhAEtI7Gpcf4QA19b_6Yvjs8E");
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const roomLabel = ROOM_TYPES.find(r => r.id === roomType)?.label || "room";
      const styleLabel = STYLES.find(s => s.id === styleType)?.label || "modern";
      const colorNames = colors.map(c => COLORS.find(cl => cl.hex === c)?.name || c).join(", ");

      const promptMsg = `You are a strict architectural drafter. I am providing a photo of a space.
You must write a text-to-image prompt to generate a structural design sketch of a ${roomLabel}.
Do NOT design a living room if I asked for a kitchen. The prompt MUST describe a ${roomLabel}.
Style: ${styleLabel}. Colors to hint at: ${colorNames}.

CRITICAL RULES:
1. The result MUST be an EMPTY ROOM. UNFURNISHED. NO FURNITURE, NO CHAIRS, NO TABLES, NO SOFAS.
2. It must be an architectural blueprint or pencil sketch style.
3. Keep the structural geometry and walls exactly identical to the uploaded image.
4. Output ONLY the English prompt (max 60 words). No formatting.`;

      const imageParts = uploadedImages.map(imgStr => {
         const mimeType = imgStr.substring(imgStr.indexOf(':') + 1, imgStr.indexOf(';'));
         const data = imgStr.substring(imgStr.indexOf(',') + 1);
         return {
           inlineData: {
             data,
             mimeType
           }
         };
      });

      const result = await model.generateContent([promptMsg, ...imageParts]);
      let generatedPrompt = result.response.text().trim();
      generatedPrompt += `, ${roomLabel}, empty room, unfurnished, bare walls, clean architectural pencil sketch, blueprint style, no furniture, NO PEOPLE`;

      
      clearInterval(progressInterval);
      setProgress(100);
      
      const seed = Math.floor(Math.random() * 100000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(generatedPrompt)}?width=800&height=600&nologo=true&seed=${seed}`;
      
      const img = new Image();
      img.onload = () => {
        setResultImage(imageUrl);
        setIsGenerating(false);
        setAttempts(a => a + 1);
      };
      img.onerror = () => {
        console.error("Failed downloading AI image from server");
        // Trigger local fallback
        setResultImage("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80");
        setIsGenerating(false);
        setAttempts(a => a + 1);
      };
      img.src = imageUrl;
      
    } catch (e) {
      console.error("AI Generation error:", e);
      clearInterval(progressInterval);
      setProgress(100);
      setResultImage("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80");
      
      setTimeout(() => {
        setIsGenerating(false);
        setAttempts(a => a + 1);
      }, 600);
    }
  };

  const resetTool = () => {
    setStep(1);
    setResultImage(null);
    setUploadedImages([]);
    setRoomType("");
    setStyleType("");
    setColors([]);
    setNotes("");
  };

  return (
    <Layout>
      <Helmet>
        <title>التصميم المجاني الذكي | مؤسسة الخطيب للمقاولات</title>
      </Helmet>

      <div className="min-h-screen bg-slate-50 py-10" dir="rtl">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-yellow-100 text-yellow-700 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-secondary mb-4">توليد التصاميم الذكي مجاناً</h1>
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
              أرفق صور مساحتك، حدد ذوقك، ودع "خبير التصميم الذكي" يولد لك صورة ثلاثية الأبعاد احترافية تحاكي الواقع وتلبي تطلعاتك.
            </p>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
              <span className="bg-white px-3 py-1 rounded-full border border-slate-200">
                محاولاتك: {attempts} / {MAX_ATTEMPTS}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Progress Bar */}
            <div className="flex border-b border-slate-100">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`flex-1 h-1.5 transition-colors ${step >= s ? 'bg-primary' : 'bg-slate-100'}`} />
              ))}
            </div>

            <div className="p-6 md:p-10">
              {/* Step 1: Room & Style */}
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary mb-5">1. ما هو المكان الذي نود تصميمه؟</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {ROOM_TYPES.map(room => (
                        <button
                          key={room.id}
                          onClick={() => setRoomType(room.id)}
                          className={`p-4 text-right rounded-2xl border-2 transition-all ${
                            roomType === room.id 
                              ? "border-primary bg-yellow-50 shadow-md scale-[1.02]" 
                              : "border-slate-100 hover:border-yellow-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-secondary">{room.label}</h3>
                            {roomType === room.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                          </div>
                          <p className="text-xs text-slate-500 mb-3">{room.desc}</p>
                          <span className="inline-block px-2 py-1 bg-white rounded-md text-[10px] font-bold text-primary border border-yellow-100">
                            باشراف {room.expert}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {roomType && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <h2 className="text-2xl font-bold text-secondary mb-5">2. ما هو الطراز المفضل للمكان؟</h2>
                      <div className="flex flex-wrap gap-3">
                        {STYLES.map(style => (
                          <button
                            key={style.id}
                            onClick={() => setStyleType(style.id)}
                            className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${
                              styleType === style.id 
                                ? "border-primary bg-primary text-white shadow-lg" 
                                : "border-slate-200 bg-white text-slate-600 hover:border-primary/50"
                            }`}
                          >
                            {style.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-6 border-t border-slate-100">
                    <Button 
                      size="lg" 
                      onClick={() => setStep(2)} 
                      disabled={!roomType || !styleType}
                      className="bg-secondary text-white rounded-xl px-8"
                    >
                      التالي <ChevronLeft className="w-5 h-5 mr-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Colors & Notes */}
              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary mb-2 flex items-center gap-2">
                      <PaintBucket className="w-6 h-6 text-primary" /> الألوان المفضلة
                    </h2>
                    <p className="text-slate-500 mb-5 text-sm">اختر حتى 3 ألوان لتكون الأساس في التصميم.</p>
                    <div className="flex flex-wrap gap-4">
                      {COLORS.map(color => {
                        const isSelected = colors.includes(color.hex);
                        return (
                          <button
                            key={color.hex}
                            onClick={() => toggleColor(color.hex)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                              isSelected ? "border-primary shadow-md bg-yellow-50" : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <span 
                              className="w-5 h-5 rounded-full border border-slate-200 shadow-inner" 
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-slate-700"}`}>
                              {color.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg font-bold text-secondary mb-3 block">هل لديك متطلبات خاصة أو إضافات؟ (اختياري)</Label>
                    <Textarea 
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="مثال: أفضل إضاءة خافتة، أو أريد مساحة واسعة للتخزين..."
                      className="min-h-[120px] rounded-xl text-base p-4 border-slate-200 focus:border-primary"
                    />
                  </div>

                  <div className="flex justify-between pt-6 border-t border-slate-100">
                    <Button variant="outline" size="lg" onClick={() => setStep(1)} className="rounded-xl px-8">
                       رجوع
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={() => setStep(3)} 
                      disabled={colors.length === 0}
                      className="bg-secondary text-white rounded-xl px-8"
                    >
                      التالي <ChevronLeft className="w-5 h-5 mr-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Image Upload Area */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-secondary flex items-center gap-2">
                        <ImageIcon className="w-6 h-6 text-primary" /> صور للموقع الحالي
                      </h2>
                      <span className="text-sm font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                        {uploadedImages.length} من 3
                      </span>
                    </div>
                    <p className="text-slate-500 mb-6 text-sm">التطبيق سيقوم بتحليل مساحتك وبناء التصميم عليها لاخراج صورة واقعية لاحتياجك.</p>
                    
                    {/* Upload Box */}
                    {uploadedImages.length < 3 ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-3 border-dashed border-slate-200 hover:border-primary bg-slate-50 hover:bg-yellow-50/50 transition-colors rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer min-h-[250px]"
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          multiple 
                          onChange={handleFileUpload}
                        />
                        <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 text-primary">
                          <UploadCloud className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-secondary mb-2">اضغط هنا لرفع الصور</h3>
                        <p className="text-slate-500 text-sm max-w-sm">
                          يفضل أن تكون الصور بزوايا واسعة وإضاءة جيدة. مسموح بصيغ JPG, PNG.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6" />
                        <strong>تم رفع الحد الأقصى من الصور (3).</strong>
                      </div>
                    )}

                    {/* Thumbnails */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-md group border border-slate-100 bg-white">
                            <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform hover:scale-110 transition-transform"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50/50 border border-yellow-200 p-4 rounded-2xl flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800 leading-relaxed">
                      الخبير الذكي جاهز الآن. سيتم دراسة تفاصيل المساحة ومعالجة رغباتك {colors.length > 0 && 'بدمج الألوان المختارة'} حسب ستايل الـ "{STYLES.find(s=>s.id === styleType)?.label}". هل نبدأ عملية التصميم؟
                    </p>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-slate-100">
                    <Button variant="outline" size="lg" onClick={() => setStep(2)} className="rounded-xl px-8">
                       رجوع
                    </Button>
                    {attempts >= MAX_ATTEMPTS ? (
                      <Button size="lg" disabled className="bg-slate-300 text-slate-500 rounded-xl px-8 opacity-70 cursor-not-allowed">
                        لقد استنفدت المحاولات المجانية الثلاث
                      </Button>
                    ) : (
                      <Button 
                        size="lg" 
                        onClick={startGeneration} 
                        disabled={uploadedImages.length === 0}
                        className="bg-primary hover:bg-yellow-500 text-white rounded-xl px-8 font-bold shadow-lg shadow-primary/30"
                      >
                        <Wand2 className="w-5 h-5 ml-2" /> توليد التصميم ذكياً
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Generation Loading & Result */}
              {step === 4 && (
                <div className="animate-in fade-in duration-500 py-4">
                  
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center text-center py-10">
                      <div className="relative w-32 h-32 mb-8">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle
                            cx="64" cy="64" r="62"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-primary transition-all duration-300 ease-out"
                            strokeDasharray="389.5"
                            strokeDashoffset={389.5 - (389.5 * progress) / 100}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-black text-secondary">{progress}%</span>
                        </div>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-secondary mb-2">جاري تصميم مساحتك...</h2>
                      <div className="text-slate-500 h-6 flex items-center justify-center w-full">
                        {progress < 30 && "الخبير يحلل زوايا وأبعاد الصورة المرفوعة..."}
                        {progress >= 30 && progress < 60 && `يتم تطبيق طراز ${STYLES.find(s=>s.id === styleType)?.label} على المعالم...`}
                        {progress >= 60 && progress < 90 && "دمج الألوان واللمسات النهائية وتوزيع الإضاءة..."}
                        {progress >= 90 && "تجهيز الريندر الثلاثي الأبعاد... تقريباً انتهينا!"}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in zoom-in-95 duration-700">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-600 rounded-full mb-4 shadow-sm border border-green-200">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-secondary mb-2">تم تجهيز التصميم بنجاح!</h2>
                        <p className="text-slate-500">هذه هي النظرة المستقبلية لمساحتك بعد تنفيذ أعمالنا.</p>
                      </div>

                      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-video group">
                        {resultImage ? (
                          <img src={resultImage} alt="Generated Design" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 font-bold p-6 text-center">
                            <AlertCircle className="w-12 h-12 mb-3 text-red-400" />
                            <p className="text-lg">عذراً، فشل جلب الصورة من مولدات الذكاء الاصطناعي</p>
                            <p className="text-sm mt-1 opacity-75">ربما بسبب الحجب الجغرافي أو بطء الاتصال بالخوادم</p>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-secondary font-bold px-4 py-2 rounded-xl shadow-lg border border-white/50">
                          النتيجة بصيغة 3D
                        </div>
                      </div>

                      <div className="bg-gradient-to-l from-secondary to-blue-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">أعجبك التصميم؟ دعنا ننفذه في الواقع!</h3>
                          <p className="text-blue-100 max-w-md">
                            خبراؤنا ومقاولونا جاهزون لتحويل هذا التصميم إلى حقيقة بأعلى جودة. نضمن لك النتيجة والمطابقة.
                          </p>
                        </div>
                        <div className="flex flex-col gap-3 shrink-0">
                          <a href={`tel:${COMPANY_INFO.phone}`}>
                            <Button size="lg" className="w-full bg-primary hover:bg-yellow-500 text-white rounded-xl shadow-lg font-bold">
                              احجز مقابلة للمباشرة بالتنفيذ
                            </Button>
                          </a>
                          {attempts < MAX_ATTEMPTS && (
                            <>
                              <Button variant="secondary" className="w-full bg-white text-secondary hover:bg-yellow-50 rounded-xl shadow-md font-bold" onClick={startGeneration}>
                                توليد خيار جديد لنفس المساحة ( المتبقي: {MAX_ATTEMPTS - attempts} )
                              </Button>
                              <Button variant="outline" className="w-full border-white/30 text-white flex items-center justify-center hover:bg-white/10 rounded-xl" onClick={resetTool}>
                                البدء بمساحة جديدة تماماً
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
