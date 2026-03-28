import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Phone, MapPin, Clock, Menu, X, ChevronLeft, ShieldCheck, Wand2 } from "lucide-react";

// Social icons as inline SVGs (removed from lucide-react in newer versions)
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 5.932zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
import { COMPANY_INFO } from "@/data/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";
import { ChatWidget } from "@/components/chat-widget";

const NAV_LINKS: { href: string; label: string; highlight?: boolean }[] = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "خدماتنا" },
  { href: "/projects", label: "مشاريعنا" },
  { href: "/blog", label: "المدونة" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "اتصل بنا" }
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-white" dir="rtl">
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden md:flex bg-secondary text-white/90 text-sm py-2 px-4 justify-between items-center z-50 relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span dir="ltr">{COMPANY_INFO.phoneDisplay}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{COMPANY_INFO.hours}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{COMPANY_INFO.address}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3"
            : "bg-white py-5"
          }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="group hover:opacity-90 transition-opacity">
            <Logo variant="full" size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-bold transition-all relative ${isActive ? "text-primary" : "text-slate-700 hover:text-primary"
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="bg-secondary hover:bg-blue-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4" />
              <span dir="ltr">{COMPANY_INFO.phoneDisplay}</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-secondary bg-slate-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-[72px] left-0 right-0 bg-white shadow-xl z-30 border-t border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {NAV_LINKS.map((link) => {
                const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`p-3 rounded-xl flex items-center justify-between font-bold ${
                      link.highlight 
                        ? "bg-primary text-white shadow-md mb-2" 
                        : isActive ? "bg-primary/10 text-primary" : "text-slate-700 active:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.highlight && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span>}
                      {link.label}
                    </span>
                    <ChevronLeft className={`w-4 h-4 ${link.highlight ? "opacity-100" : "opacity-50"}`} />
                  </Link>
                );
              })}
              <div className="pt-4 mt-2 border-t border-slate-100">
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="w-full bg-primary text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  اتصل بنا الآن
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-slate-300 pt-16 pb-8 border-t-[8px] border-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="space-y-6">
              <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
                <Logo variant="white" size="md" />
              </Link>
              <p className="text-sm leading-relaxed">
                مؤسسة رائدة في مجال المقاولات والتشطيبات والديكور الداخلي والخارجي، نقدم خدمات متكاملة بأعلى معايير الجودة والاحترافية لتلبية طموحات عملائنا.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <TwitterXIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">روابط سريعة</h3>
              <ul className="space-y-3">
                {NAV_LINKS.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="flex items-center gap-2 hover:text-primary transition-colors group">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">أبرز خدماتنا</h3>
              <ul className="space-y-3">
                <li><Link href="/services/gypsum-decor" className="hover:text-primary transition-colors">الجبس والديكور الداخلي</Link></li>
                <li><Link href="/services/marble-wood-alt" className="hover:text-primary transition-colors">بديل الرخام والخشب</Link></li>
                <li><Link href="/services/all-painting" className="hover:text-primary transition-colors">أعمال الدهانات</Link></li>
                <li><Link href="/services/floor-polishing" className="hover:text-primary transition-colors">جلي البلاط والرخام</Link></li>
                <li><Link href="/services/building-maintenance" className="hover:text-primary transition-colors">صيانة وترميم الأبنية</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white text-lg font-bold mb-6 border-b border-white/10 pb-2 inline-block">تواصل معنا</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{COMPANY_INFO.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-primary transition-colors" dir="ltr">{COMPANY_INFO.phoneDisplay}</a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{COMPANY_INFO.hours}</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© {new Date().getFullYear()} مؤسسة الخطيب للمقاولات. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="hover:text-primary transition-colors opacity-50 hover:opacity-100 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                لوحة التحكم
              </Link>
              <p>تصميم وتطوير بكل ❤️</p>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <ChatWidget />
      
      {/* Floating Design Tool Drop/FAB */}
      {location !== '/design' && (
        <Link 
          href="/design"
          className="fixed bottom-6 right-4 sm:right-6 z-[200] group flex items-center gap-3 bg-secondary text-white rounded-full shadow-xl shadow-secondary/30 hover:-translate-y-1 transition-all overflow-hidden"
          title="صمم مساحتك مجاناً"
        >
          <div className="flex items-center gap-2 pl-4 pr-1 py-1">
            <span className="font-bold text-sm lg:text-base hidden sm:block whitespace-nowrap opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all text-yellow-400">
              صمم مساحتك بالذكاء الاصطناعي مجاناً
            </span>
            <div className="w-14 h-14 bg-gradient-to-r from-primary to-yellow-500 rounded-full flex items-center justify-center shrink-0">
              <Wand2 className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
