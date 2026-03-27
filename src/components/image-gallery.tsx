import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, X, ZoomIn, Image } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  title?: string;
}

export function ImageGallery({ images, title = "" }: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const validImages = images.filter(Boolean);

  const handleError = (idx: number) => {
    setImageErrors(prev => ({ ...prev, [idx]: true }));
  };

  const prev = () => setActiveIdx(i => (i === 0 ? validImages.length - 1 : i - 1));
  const next = () => setActiveIdx(i => (i === validImages.length - 1 ? 0 : i + 1));

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") prev();
      if (e.key === "ArrowLeft") next();
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  if (validImages.length === 0) {
    return (
      <div className="w-full h-72 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
        <div className="text-center">
          <Image className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">لا توجد صور</p>
        </div>
      </div>
    );
  }

  const mainImage = validImages[activeIdx];
  const hasError = imageErrors[activeIdx];

  return (
    <>
      {/* Main Display */}
      <div className="space-y-3">
        {/* Primary Image */}
        <div className="relative group overflow-hidden rounded-2xl bg-slate-100 aspect-[4/3]">
          {!hasError ? (
            <img
              src={mainImage}
              alt={`${title} - صورة ${activeIdx + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => handleError(activeIdx)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <Image className="w-16 h-16" />
            </div>
          )}

          {/* Zoom Button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-3 left-3 bg-black/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            title="تكبير الصورة"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          {/* Counter Badge */}
          {validImages.length > 1 && (
            <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {activeIdx + 1} / {validImages.length}
            </div>
          )}

          {/* Nav Arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 text-slate-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 text-slate-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails Strip */}
        {validImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {validImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  activeIdx === idx
                    ? "border-primary shadow-md scale-105"
                    : "border-slate-200 hover:border-primary/50 opacity-70 hover:opacity-100"
                }`}
              >
                {!imageErrors[idx] ? (
                  <img
                    src={img}
                    alt={`صورة ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleError(idx)}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <Image className="w-6 h-6 text-slate-300" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors z-10"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          <button
            onClick={e => { e.stopPropagation(); next(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          <img
            src={mainImage}
            alt={title}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          {/* Lightbox Thumbnails */}
          {validImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {validImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={e => { e.stopPropagation(); setActiveIdx(idx); }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeIdx === idx ? "bg-primary scale-125" : "bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
