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
  const orange = white ? "#ffffff" : "#F97316";
  const blue = white ? "rgba(255,255,255,0.15)" : "#1E40AF";
  const blueAccent = white ? "rgba(255,255,255,0.6)" : "#2563EB";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background square with rounded corners */}
      <rect width="80" height="80" rx="16" fill={blue} />

      {/* Building / skyline silhouette */}
      {/* Main building center */}
      <rect x="30" y="22" width="20" height="34" rx="2" fill={blueAccent} />
      {/* Left tower */}
      <rect x="14" y="33" width="14" height="23" rx="2" fill={blueAccent} />
      {/* Right tower */}
      <rect x="52" y="29" width="14" height="27" rx="2" fill={blueAccent} />

      {/* Ground line */}
      <rect x="10" y="55" width="60" height="3" rx="1.5" fill={orange} />

      {/* Windows on center building */}
      <rect x="35" y="27" width="5" height="5" rx="1" fill={orange} />
      <rect x="43" y="27" width="5" height="5" rx="1" fill={orange} />
      <rect x="35" y="36" width="5" height="5" rx="1" fill={orange} />
      <rect x="43" y="36" width="5" height="5" rx="1" fill={orange} />

      {/* Windows on left tower */}
      <rect x="18" y="38" width="4" height="4" rx="1" fill={orange} />
      <rect x="24" y="38" width="4" height="4" rx="1" fill={orange} />
      <rect x="18" y="45" width="4" height="4" rx="1" fill={orange} />
      <rect x="24" y="45" width="4" height="4" rx="1" fill={orange} />

      {/* Windows on right tower */}
      <rect x="55" y="34" width="4" height="4" rx="1" fill={orange} />
      <rect x="61" y="34" width="4" height="4" rx="1" fill={orange} />
      <rect x="55" y="42" width="4" height="4" rx="1" fill={orange} />
      <rect x="61" y="42" width="4" height="4" rx="1" fill={orange} />

      {/* Orange accent arc at top of center building - like a crown */}
      <path
        d="M30 22 Q40 14 50 22"
        stroke={orange}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Door */}
      <rect x="36" y="46" width="8" height="9" rx="1" fill={orange} opacity="0.9" />
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
          <span className="text-orange-400 font-bold" style={{ fontSize: 7 }}>
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
          <span className="font-semibold text-orange-400 uppercase tracking-widest" style={{ fontSize: s.text2 }}>
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
