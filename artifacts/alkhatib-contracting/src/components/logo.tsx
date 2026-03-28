import { COMPANY_INFO } from "@/data/mock-data";

interface LogoProps {
  variant?: "full" | "icon" | "white" | "watermark";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  xs: 24,
  sm: 32,
  md: 44,
  lg: 56,
  xl: 72,
};

export function LogoIcon({ size = 44 }: { size?: number }) {
  return (
    <img 
      src={`${import.meta.env.BASE_URL}images/logo.png`} 
      alt="الخطيب للمقاولات" 
      width={size} 
      height={size} 
      className="object-contain"
      style={{ borderRadius: '8px' }}
    />
  );
}

export function Logo({ variant = "full", size = "md", className = "" }: LogoProps) {
  const s = sizes[size];

  if (variant === "icon") {
    return <LogoIcon size={s} />;
  }

  if (variant === "watermark") {
    return (
      <div
        className={`flex items-center gap-1.5 bg-secondary/80 backdrop-blur-sm rounded-lg px-2 py-1 ${className}`}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
      >
        <LogoIcon size={20} />
      </div>
    );
  }

  if (variant === "white") {
    return (
      <div className={`flex items-center gap-3 ${className} bg-white/10 p-2 rounded-xl backdrop-blur-sm`}>
        <LogoIcon size={s} />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={s * 1.2} />
    </div>
  );
}

export function ImageWithWatermark({
  src,
  alt,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} className={`w-full h-full object-cover ${imgClassName}`} />
      <div className="absolute top-3 right-3 z-10">
        <Logo variant="watermark" />
      </div>
    </div>
  );
}
