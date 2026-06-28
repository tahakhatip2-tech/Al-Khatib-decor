import { COMPANY_INFO } from "@/data/mock-data";

interface LogoProps {
  variant?: "full" | "icon" | "white" | "watermark";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  xs: 32,
  sm: 48,
  md: 64,
  lg: 96,
  xl: 128,
};

export function LogoIcon({ size = 64, className = "" }: { size?: number, className?: string }) {
  return (
    <img 
      src={`${import.meta.env.BASE_URL}images/logo.png`} 
      alt="الخطيب للمقاولات الديكور" 
      width={size} 
      height={size} 
      className={`object-contain ${className}`}
    />
  );
}

export function Logo({ variant = "full", size = "md", className = "" }: LogoProps) {
  const s = sizes[size];

  if (variant === "icon") {
    return <LogoIcon size={s} className={className} />;
  }

  if (variant === "watermark") {
    return (
      <div className={`opacity-80 mix-blend-multiply ${className}`}>
        <LogoIcon size={s} />
      </div>
    );
  }

  if (variant === "white") {
    return (
      <div className={`flex items-center justify-center ${className} bg-white/80 p-2 rounded-xl backdrop-blur-sm shadow-sm`} style={{ mixBlendMode: 'normal' }}>
        <LogoIcon size={s} />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LogoIcon size={s} />
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
        <Logo variant="watermark" size="md" />
      </div>
    </div>
  );
}
