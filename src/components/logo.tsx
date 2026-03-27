interface LogoProps {
  variant?: "full" | "icon" | "white" | "watermark";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  xs: { icon: 24, text1: 12, text2: 8 },
  sm: { icon: 32, text1: 14, text2: 9 },
  md: { icon: 44, text1: 18, text2: 10 },
  lg: { icon: 56, text1: 22, text2: 12 },
  xl: { icon: 72, text1: 28, text2: 14 },
};

export function LogoIcon({ size = 44, white = false }: { size?: number; white?: boolean }) {
  const yellow = white ? "#ffffff" : "#EAB308";
  const blue = white ? "rgba(255,255,255,0.15)" : "#1E40AF";
  const blueAccent = white ? "rgba(255,255,255,0.6)" : "#2563EB";
  const yellowLight = white ? "#ffffff" : "#FDE047";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm"
    >
      <defs>
        <linearGradient id={`${white ? 'w-' : ''}blueGrad`} x1="0" y1="0" x2="100" y2="100">
          <stop stopColor={blueAccent} />
          <stop offset="1" stopColor={blue} />
        </linearGradient>
        <linearGradient id={`${white ? 'w-' : ''}yellowGrad`} x1="0" y1="100" x2="100" y2="0">
          <stop stopColor={yellow} />
          <stop offset="1" stopColor={yellowLight} />
        </linearGradient>
        <filter id="f1" x="0" y="0" width="150%" height="150%">
          <feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>

      {/* Hexagonal Base / 3D Foundation */}
      <path
        d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z"
        fill={`url(#${white ? 'w-' : ''}blueGrad)`}
        className="opacity-90"
      />

      {/* Building Structure Left (The 'A' side) */}
      <path
        d="M25 40 L48 20 L48 85 L25 85 Z"
        fill="white"
        fillOpacity="0.1"
      />
      
      {/* 3D Geometric Initials 'AK' stylized into building shapes */}
      {/* Letter A (left building) */}
      <path
        d="M20 75 L45 20 L55 20 L80 75 L65 75 L50 45 L35 75 Z"
        fill={`url(#${white ? 'w-' : ''}yellowGrad)`}
      />
      
      {/* Central Building Spine */}
      <rect x="46" y="15" width="8" height="75" fill={white ? "white" : "#1E3A8A"} fillOpacity={white ? "0.2" : "0.8"} />

      {/* Intersection Building (The 'K' side) */}
      <path
        d="M50 45 L75 25 L85 35 L55 55 L90 85 L75 85 L50 55 Z"
        fill={`url(#${white ? 'w-' : ''}yellowGrad)`}
      />

      {/* Highlights for 3D effect */}
      <path d="M45 20 L55 20 L50 15 Z" fill="#ffffff" fillOpacity="0.5" />
      <path d="M50 95 L46 90 L54 90 Z" fill="#000000" fillOpacity="0.2" />
    </svg>
  );
}

export function Logo({ variant = "full", size = "md", className = "" }: LogoProps) {
  const s = sizes[size];

  if (variant === "icon") {
    return <LogoIcon size={s.icon} />;
  }

  if (variant === "watermark") {
    return (
      <div
        className={`flex items-center gap-1.5 bg-secondary/80 backdrop-blur-sm rounded-lg px-2 py-1 ${className}`}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
      >
        <LogoIcon size={20} white />
        <div className="flex flex-col leading-none">
          <span className="text-white font-black" style={{ fontSize: 9, letterSpacing: 0.5 }}>
            الخطيب
          </span>
          <span className="text-yellow-400 font-bold" style={{ fontSize: 7 }}>
            للمقاولات
          </span>
        </div>
      </div>
    );
  }

  if (variant === "white") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <LogoIcon size={s.icon} white />
        <div className="flex flex-col leading-tight">
          <span className="font-black text-white" style={{ fontSize: s.text1 }}>
            مؤسسة الخطيب
          </span>
          <span className="font-semibold text-yellow-400 uppercase tracking-widest" style={{ fontSize: s.text2 }}>
            للمقاولات والديكور
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={s.icon} />
      <div className="flex flex-col leading-tight">
        <span className="font-black text-secondary" style={{ fontSize: s.text1 }}>
          مؤسسة الخطيب
        </span>
        <span className="font-semibold text-primary uppercase tracking-widest" style={{ fontSize: s.text2 }}>
          للمقاولات والديكور
        </span>
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
      <div className="absolute top-3 right-3 z-10">
        <Logo variant="watermark" />
      </div>
    </div>
  );
}
