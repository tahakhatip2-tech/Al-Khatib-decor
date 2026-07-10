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
      src={`${import.meta.env.BASE_URL}taha.png?v=2`} 
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

  // Use the circular yellow border style for all variants (watermark, full, white)
  return (
    <div className={`drop-shadow-sm ${className}`}>
      <div 
        className="rounded-full border-2 border-yellow-500 bg-white overflow-hidden flex items-center justify-center shadow-inner"
        style={{ width: s, height: s }}
      >
        <LogoIcon size={s - 8} className="object-contain" />
      </div>
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
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        <Logo variant="watermark" size="sm" />
      </div>
    </div>
  );
}
