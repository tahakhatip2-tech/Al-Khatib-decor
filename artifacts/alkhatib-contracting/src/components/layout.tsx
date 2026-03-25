import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Phone, MapPin, Clock, Menu, X, ChevronLeft, Facebook, Instagram, Twitter } from "lucide-react";
import { COMPANY_INFO } from "@/data/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";

const NAV_LINKS = [
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
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
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
                  className={`text-base font-bold transition-all relative ${
                    isActive ? "text-primary" : "text-slate-700 hover:text-primary"
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
                      isActive ? "bg-primary/10 text-primary" : "text-slate-700 active:bg-slate-50"
                    }`}
                  >
                    {link.label}
                    <ChevronLeft className="w-4 h-4 opacity-50" />
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
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
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
            <p>تصميم وتطوير بكل ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
