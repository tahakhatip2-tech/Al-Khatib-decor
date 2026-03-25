import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  description?: string;
  bgImage?: string;
  breadcrumbs: { label: string; href?: string }[];
}

export function PageHero({ 
  title, 
  description, 
  bgImage = "https://images.unsplash.com/photo-1541888086925-0c770c4013fd?w=1920&q=80", 
  breadcrumbs 
}: PageHeroProps) {
  return (
    <div className="relative py-24 lg:py-32 overflow-hidden flex items-center min-h-[300px] lg:min-h-[400px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt={title}
          className="w-full h-full object-cover object-center"
        />
        {/* Dual gradient overlay for readability and branding */}
        <div className="absolute inset-0 bg-secondary/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent"></div>
        {/* Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/hero-pattern.png)`, backgroundSize: 'cover' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-white">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm md:text-base font-medium text-white/70 mb-6">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <div key={index} className="flex items-center gap-2">
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-primary transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-primary">{crumb.label}</span>
                  )}
                  {!isLast && <ChevronLeft className="w-4 h-4" />}
                </div>
              );
            })}
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight text-white">
            {title}
          </h1>
          
          {description && (
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl border-r-4 border-primary pr-4">
              {description}
            </p>
          )}
        </motion.div>
      </div>

      {/* Decorative bottom curve */}
      <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none z-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-[40px] md:h-[60px]" style={{ transform: 'rotateY(180deg)' }}>
          <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="fill-background"></path>
        </svg>
      </div>
    </div>
  );
}
