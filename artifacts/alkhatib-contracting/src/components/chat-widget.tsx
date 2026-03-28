import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Phone, Calendar, Loader2 } from "lucide-react";
import { COMPANY_INFO, SERVICES } from "@/data/mock-data";

// =============================================
// AI Knowledge Base
// =============================================
const KB = {
  company: `مؤسسة الخطيب للمقاولات - إحدى الشركات الرائدة في مجال المقاولات والتشطيبات في المنطقة. تأسست بهدف تقديم خدمات عالية الجودة في التشطيبات الداخلية والخارجية والصيانة. نخدم عملاءنا في عمان وجميع مناطق المملكة الأردنية الهاشمية.`,
  contact: `الهاتف: ${COMPANY_INFO.phone} | العنوان: ${COMPANY_INFO.address} | أوقات العمل: ${COMPANY_INFO.hours}`,
  services: SERVICES.map(s => s.title).join(", "),
  interior: "الجبس والديكور، الدهانات بكل أنواعها، بديل الرخام والخشب، التصميم الداخلي، جلي البلاط والرخام، المطابخ",
  exterior: "الدهان الخارجي، العزل المائي والحراري، القصارة الإسبانية، أرضيات التطبيع، صيانة الأرضيات",
  maintenance: "ترميم وتجديد المباني، صيانة شاملة، تجديد شبكات السباكة والكهرباء",
  prices: "تتنوع أسعارنا حسب المساحة والنوع والمواد. نقدم تسعيرات مجانية واستشارة فنية بدون أي التزام.",
  visit: "كشف الموقع مجاني! يتضمن تقييم شامل للمساحة واقتراح أفضل الخيارات وتقديم عرض سعر مفصل.",
  quality: "نستخدم أفضل الخامات والمواد من شركات موثوقة. طاقمنا من الفنيين المدربين يضمن تنفيذ المطلوب بأعلى المعايير.",
  warranty: "نقدم ضمان على جميع أعمالنا لضمان رضا العميل الكامل.",
};

const QUICK_REPLIES = [
  "ما هي خدماتكم؟",
  "كم يكلف الدهان؟",
  "أريد كشف موقع مجاني",
  "ما هو الجبس والديكور؟",
  "العزل المائي",
  "تواصل معنا",
];

// =============================================
// Smart Reply Engine
// =============================================
function generateReply(userMsg: string): string {
  const msg = userMsg.toLowerCase();

  if (msg.match(/خدم|ماذا تقدم|ما هي/)) {
    return `نقدم في مؤسسة الخطيب مجموعة شاملة من الخدمات:\n\n🏠 **داخلية:** ${KB.interior}\n\n🏗️ **خارجية:** ${KB.exterior}\n\n🔧 **صيانة:** ${KB.maintenance}\n\nأي خدمة تهمك أكثر؟ يسعدنا تقديم مزيد من التفاصيل!`;
  }

  if (msg.match(/دهان|طلاء|صباغ|لون/)) {
    return `نقدم خدمات الدهانات الشاملة:\n\n✅ دهانات داخلية (سادة، ديكورية، تأثيرية)\n✅ دهانات خارجية مقاومة للعوامل الجوية\n✅ دهانات بروفايل للواجهات\n✅ معالجة التشققات والرطوبة قبل الدهان\n✅ ألوان كمبيوتر دقيقة لأي لون تطلبه\n\n💡 **نصيحة خبيرنا:** اختيار نوع الدهان الصحيح يوفر عليك التكلفة على المدى الطويل. تواصل معنا لتقييم مجاني!`;
  }

  if (msg.match(/جبس|ديكور|سقف|بورد/)) {
    return `الجبس البورد من خدماتنا المميزة! 🌟\n\n✨ نصمم وننفذ:\n• أسقف جبسية بتصاميم عصرية وكلاسيكية\n• قواطع جبسية داخلية\n• إضاءة مخفية LED احترافية\n• شپيريس وأرابيسك\n• جبس حجر وخشب ثلاثي الأبعاد\n\nنتعامل مع جميع مساحات المشاريع من شقق صغيرة حتى فلل ضخمة. يمكننا إرسال نماذج تصاميم لك إذا أردت!`;
  }

  if (msg.match(/عزل|مائي|تسرب|رطوب/)) {
    return `العزل من أهم الأعمال لحماية منزلك! 💧\n\n🛡️ نقدم:\n• عزل أسطح بالرولات والمواد السائلة\n• عزل خزانات المياه\n• عزل حمامات ومطابخ\n• معالجة التسربات والتشققات\n• عزل حراري للتوفير في الكهرباء\n\n⚠️ **تحذير الخبير:** التأخر في معالجة التسربات يكلّف 5-10 أضعاف لاحقاً. احجز كشف مجاني الآن!`;
  }

  if (msg.match(/قصار|اسباني|واجهة/)) {
    return `القصارة الإسبانية هي التشطيب الخارجي الأكثر فخامة ومتانة! 🏡\n\n✨ مميزاتها:\n• مظهر حجر طبيعي فاخر\n• لا تحتاج دهاناً مستقبلياً\n• مقاومة عالية للأمطار والشمس\n• عزل إضافي للجدران\n• عمر افتراضي يتجاوز 20 سنة\n\nكثير من الزبائن يختارونها لأنها توفر تكاليف الصيانة الدورية طويل الأمد. هل تريد رؤية أمثلة على أعمالنا؟`;
  }

  if (msg.match(/رخام|جلي|تلميع|بلاط/)) {
    return `نتخصص في جلي وتلميع جميع أنواع الأرضيات! ✨\n\n🔮 خدمات الجلي:\n• جلي بالكريستال والألماس\n• إزالة البقع والخدوش العميقة\n• تلميع وحماية بالواكس\n• معالجة فواصل السيراميك\n• تلميع الرخام والجرانيت\n\nنحن نحول الأرضيات المتآكلة لأرضيات تبدو كالجديدة! هل أرضية منزلك تحتاج لعناية؟`;
  }

  if (msg.match(/سعر|كلف|تكلف|ميزانية|تسعير/)) {
    return `${KB.prices}\n\n📋 **عوامل التسعير:**\n• المساحة الإجمالية (بالمتر المربع)\n• نوع العمل المطلوب\n• جودة المواد المختارة\n• موقع المشروع\n\n🎁 **عرضنا الخاص:** كشف موقع مجاني + تسعيرة مفصلة بدون التزام!\n\nللحصول على سعر دقيق، احجز كشف الموقع المجاني الآن على الرقم: ${COMPANY_INFO.phone}`;
  }

  if (msg.match(/كشف|زيارة|فحص|معاينة/)) {
    return `رائع! كشف الموقع المجاني خطوتك الأولى نحو مشروعك الحلم! 🎯\n\n📋 **ماذا يشمل الكشف المجاني:**\n✅ تقييم شامل للمساحة والحالة الحالية\n✅ اقتراح أفضل الحلول والخيارات\n✅ تسعيرة مفصلة شفافة بدون أسعار مخفية\n✅ الإجابة على جميع أسئلتك\n✅ تواجد مهندس متخصص\n\n📞 للحجز الآن: **${COMPANY_INFO.phone}**\nأو تواصل معنا عبر واتساب`;
  }

  if (msg.match(/مطبخ|كابينت|خزانة/)) {
    return `نصمم ونصنع المطابخ بمواصفات احترافية عالية! 🍳\n\n🔨 **تخصصنا:**\n• مطابخ ألمنيوم عالية الجودة\n• مطابخ خشب طبيعي ومضغوط\n• تصاميم حديثة وكلاسيكية\n• إكسسوارات إيطالية فاخرة\n• حلول تخزين ذكية\n• توزيع مثالي لمناطق العمل\n\nنقدم تصميم 3D مجاني لترى مطبخك قبل التنفيذ!`;
  }

  if (msg.match(/صيانة|ترميم|تجديد|إصلاح/)) {
    return `خدمات الصيانة والترميم من أكثر خدماتنا طلباً! 🏗️\n\n🔧 **نتخصص في:**\n• ترميم المباني القديمة بالكامل\n• تجديد الشقق والفلل\n• إصلاح التشققات الإنشائية\n• تحديث شبكات السباكة والكهرباء\n• تعديل التوزيع الداخلي\n• تشطيبات متكاملة من الصفر\n\nحوّلنا مبانٍ عمرها عشرات السنين لتبدو كالجديدة! هل لديك مشروع ترميم تحتاج استشارة بشأنه؟`;
  }

  if (msg.match(/اتصل|تواصل|هاتف|رقم|واتس/)) {
    return `يسعدنا التواصل معك! 📞\n\n**معلومات التواصل:**\n📱 هاتف/واتساب: **${COMPANY_INFO.phone}**\n📍 العنوان: ${COMPANY_INFO.address}\n⏰ أوقات العمل: ${COMPANY_INFO.hours}\n\nيمكنك الآن الضغط على زر "احجز كشف مجاني" للتواصل المباشر مع فريقنا!`;
  }

  if (msg.match(/شكر|ممتاز|رائع|عظيم|حلو/)) {
    return `شكراً جزيلاً لك! 😊 نحن دائماً هنا لخدمتك.\n\nتذكر دائماً: **مؤسسة الخطيب** شريكك الموثوق في تحويل مساحتك إلى مكان مثالي.\n\nهل هناك شيء آخر يمكنني مساعدتك فيه؟`;
  }

  if (msg.match(/مرحبا|اهلا|السلام|هلا|مساء|صباح/)) {
    return `أهلاً وسهلاً بك في مؤسسة الخطيب للمقاولات! 🌟\n\nأنا مساعدك الذكي، خبير في مجال التشطيبات والمقاولات. يسعدني مساعدتك في:\n\n🏠 تشطيبات داخلية فاخرة\n🏗️ أعمال خارجية متميزة\n🔧 صيانة وترميم احترافية\n\nما الذي يمكنني مساعدتك فيه اليوم؟`;
  }

  // Default comprehensive response
  return `شكراً لتواصلك معنا! 🌟\n\nمؤسسة الخطيب للمقاولات تقدم:\n\n🏠 **تشطيبات داخلية:** جبس، دهانات، ديكور، مطابخ، جلي رخام\n🏗️ **أعمال خارجية:** قصارة إسبانية، عزل، دهان خارجي\n🔧 **صيانة:** ترميم مباني، تجديد شامل\n\n💡 **نصيحتي لك:** احجز **كشف موقع مجاني** الآن وسنقدم لك تسعيرة مفصلة وشفافة بدون أي التزام!\n\n📞 **${COMPANY_INFO.phone}**`;
}

// =============================================
// Message Types
// =============================================
interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  time: string;
}

function formatTime() {
  return new Date().toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" });
}

// =============================================
// Chat Bubble Component
// =============================================
function formatMessageText(text: string) {
  return text.split('\n').map((line, i) => {
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <p key={i} className={line === '' ? 'h-2' : ''} dangerouslySetInnerHTML={{ __html: bold }} />;
  });
}

// =============================================
// Main Chat Widget
// =============================================
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: `أهلاً بك! 👋 أنا مساعد مؤسسة الخطيب للمقاولات.\n\nيمكنني مساعدتك في تشطيباتك الداخلية والخارجية، وإجابة استفساراتك، وترتيب **كشف موقع مجاني** لك!\n\nكيف يمكنني خدمتك؟`,
      time: formatTime()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNew, setHasNew] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setHasNew(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim(), time: formatTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    const delay = 600 + Math.random() * 800;
    await new Promise(r => setTimeout(r, delay));

    const reply = generateReply(text);
    const botMsg: Message = { id: (Date.now() + 1).toString(), role: "bot", text: reply, time: formatTime() };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 left-4 right-4 sm:right-auto sm:left-6 z-[200] max-w-[380px] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          style={{ maxHeight: "min(500px, calc(100svh - 130px))" }}
          dir="rtl"
        >
          {/* Header */}
          <div className="bg-gradient-to-l from-secondary to-blue-900 text-white p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/40">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">مساعد الخطيب الذكي</p>
              <p className="text-blue-200 text-xs">خبير التشطيبات والمقاولات • متصل الآن</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white mt-1 ${
                  msg.role === "bot" ? "bg-secondary" : "bg-primary"
                }`}>
                  {msg.role === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed space-y-0.5 ${
                    msg.role === "bot"
                      ? "bg-white text-slate-800 rounded-tr-sm shadow-sm border border-slate-100"
                      : "bg-primary text-white rounded-tl-sm"
                  }`}>
                    {formatMessageText(msg.text)}
                  </div>
                  <span className="text-xs text-slate-400">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 items-end">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm border border-slate-100 flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="flex gap-2 overflow-x-auto px-4 py-2 bg-white border-t border-slate-100 scrollbar-hide">
            {QUICK_REPLIES.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="shrink-0 text-xs bg-slate-100 hover:bg-primary hover:text-white text-slate-700 px-3 py-1.5 rounded-full transition-colors font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* CTA Booking Button */}
          <div className="px-4 pb-2 bg-white">
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-l from-primary to-yellow-500 text-white py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all"
            >
              <Phone className="w-4 h-4" />
              احجز كشف موقع مجاني الآن
              <Calendar className="w-4 h-4" />
            </a>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-3 border-t border-slate-100 bg-white"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 text-sm bg-slate-100 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 border border-transparent focus:border-primary/30"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-yellow-600 disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-6 left-4 sm:left-6 z-[200] w-16 h-16 bg-gradient-to-br from-primary to-yellow-600 text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        aria-label="فتح المحادثة"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <>
            <MessageCircle className="w-7 h-7" />
            {hasNew && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                !
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}
