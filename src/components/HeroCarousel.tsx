import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles,
  Pause,
  Play,
  Edit3,
  Shield
} from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const { slides, currentUser, setActiveView } = useApp();
  const activeSlides = slides.filter(s => s.active);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Touch swipe support for mobile and tablets
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      // Swiped left -> next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Auto-advance
  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSlides.length, isPaused]);

  // Guard against deleted index
  useEffect(() => {
    if (currentIdx >= activeSlides.length && activeSlides.length > 0) {
      setCurrentIdx(0);
    }
  }, [activeSlides.length, currentIdx]);

  if (activeSlides.length === 0) {
    return (
      <div className="w-full bg-slate-900 text-white py-16 sm:py-20 px-4 text-center">
        <p className="text-base sm:text-lg text-slate-300">No hay diapositivas activas en el carrusel.</p>
      </div>
    );
  }

  const currentSlide = activeSlides[currentIdx] || activeSlides[0];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
  };

  const handleScrollTo = (target: string) => {
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero-slider-section"
      className="relative w-full bg-slate-950 select-none overflow-hidden p-0 m-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Carrusel Institucional"
    >
      {/* 
        Carrusel 100% Ancho Completo (Full-Width Edge-to-Edge)
        - Altura 680px en pantallas grandes (Desktop), adaptativa en Tablet y Móvil
        - Imagen destacada con alto contraste, nitidez y realce visual
      */}
      <div 
        className="relative w-full h-[320px] xs:h-[380px] sm:h-[480px] md:h-[580px] lg:h-[680px] flex items-center overflow-hidden bg-slate-950 transition-all duration-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]"
      >

        {/* Slides loop */}
        {activeSlides.map((slide, idx) => {
          const isCurrent = idx === currentIdx;
          const hasCustomImage = Boolean(slide.image && slide.image.trim().length > 0);

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              style={{
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
              }}
            >
              {hasCustomImage ? (
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-slate-950">
                  {/* Imagen ocupando el 100% del ancho y 680px destacada con máxima nitidez */}
                  <img
                    src={slide.image}
                    alt={slide.title || 'Slide institucional'}
                    sizes="100vw"
                    className="w-full h-full object-cover object-center transition-all duration-700 ease-out select-none"
                    loading={idx === 0 ? "eager" : "lazy"}
                    fetchPriority={idx === 0 ? "high" : "low"}
                    decoding={idx === 0 ? "sync" : "async"}
                    draggable={false}
                    style={{
                      imageRendering: 'high-quality',
                      filter: 'contrast(1.05) saturate(1.06) brightness(1.02)',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden',
                    }}
                  />

                  {/* Sutil viñeta cinematográfica para dar profundidad y resaltar la imagen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 sm:bg-gradient-to-r sm:from-slate-950/45 sm:via-transparent sm:to-slate-950/20 pointer-events-none" />
                </div>
              ) : (
                /* Elegant Institutional Military Theme without external default images */
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#061836] via-[#0D3671] to-[#041126] overflow-hidden">
                  {/* Fine Geometric Point Matrix */}
                  <div 
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
                      backgroundSize: '30px 30px'
                    }}
                  />
                  
                  {/* Atmospheric Light Glows */}
                  <div className="absolute top-1/2 right-6 sm:right-12 -translate-y-1/2 w-72 sm:w-[420px] lg:w-[520px] h-72 sm:h-[420px] lg:h-[520px] bg-gradient-to-tr from-[#B91C1C]/15 via-[#0D3671]/40 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -top-16 -left-16 sm:-top-20 sm:-left-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

                  {/* Subtle Heraldic Watermark Silhouette */}
                  <div className="absolute right-6 sm:right-16 lg:right-28 top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none select-none">
                    <Shield className="w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 text-white" />
                  </div>

                  {/* Vignette Overlay for Crisp Liquid Glass Card Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/30 sm:bg-gradient-to-r sm:from-black/70 sm:via-black/30 sm:to-black/40 pointer-events-none" />
                </div>
              )}
            </div>
          );
        })}

        {/* Foreground Content: Liquid Glass Card centered vertically */}
        {Boolean(!currentSlide.image?.trim() ? currentSlide.showTextContainer !== false : currentSlide.showTextContainer === true) && (
          <div className="relative z-20 max-w-7xl mx-auto px-2 sm:px-6 md:px-10 w-full py-1.5 sm:py-3 md:py-4">
            <div 
              className="relative w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-2.5 sm:p-4 md:p-6 rounded-xl sm:rounded-3xl overflow-hidden backdrop-blur-2xl bg-white/[0.16] border border-white/40 border-t-white/80 border-l-white/60 border-b-white/20 border-r-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.85),inset_0_-1px_1px_rgba(255,255,255,0.2)] space-y-1 sm:space-y-2 md:space-y-3 animate-fadeIn"
              style={{
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                backdropFilter: 'blur(24px) saturate(180%)',
              }}
            >
              
              {/* Apple Crystal Glass Pure Specular Highlights */}
              <div className="pointer-events-none absolute -top-24 -left-24 w-60 h-60 rounded-full bg-white/25 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-white/[0.05] to-transparent rounded-xl sm:rounded-3xl" />

              {/* Tag / Badge */}
              <div className="relative z-10 inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-[#B91C1C] text-white text-[9px] sm:text-xs font-bold tracking-wider uppercase shadow-[0_2px_10px_rgba(185,28,28,0.4),inset_0_1px_1px_rgba(255,255,255,0.7)] border border-white/40">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 shrink-0" />
                <span>{currentSlide.tag || 'Formación de Excelencia'}</span>
              </div>

              {/* Title */}
              <h1 className="relative z-10 text-xs sm:text-base md:text-2xl lg:text-3xl font-black text-white uppercase leading-tight tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] font-sans line-clamp-1 sm:line-clamp-2">
                {currentSlide.title}
              </h1>

              {/* Subtitle */}
              <p className="relative z-10 text-[9px] sm:text-xs md:text-sm text-white/95 font-medium leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] line-clamp-1 sm:line-clamp-2">
                {currentSlide.subtitle}
              </p>

              {/* Accent Line */}
              <div className="relative z-10 w-8 sm:w-14 h-0.5 sm:h-1 bg-gradient-to-r from-[#B91C1C] via-red-500 to-amber-400 rounded-full shadow-[0_0_12px_rgba(220,38,38,0.8)]" />

              {/* CTA Buttons */}
              <div className="relative z-10 pt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <button
                  id="btn-hero-primary-cta"
                  onClick={() => handleScrollTo(currentSlide.ctaLink || '#servicios')}
                  className="bg-[#B91C1C] hover:bg-red-700 active:scale-95 text-white px-2.5 py-1 sm:px-4 sm:py-2.5 rounded-full font-bold uppercase tracking-wider text-[9px] sm:text-xs transition shadow-lg flex items-center gap-1 group cursor-pointer border border-red-400/50"
                >
                  <span>{currentSlide.ctaText || 'Explorar Carreras'}</span>
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="btn-hero-secondary-cta"
                  onClick={() => handleScrollTo(currentSlide.secondaryLink || '#admisiones')}
                  className="bg-white/20 hover:bg-white/35 active:scale-95 text-white border border-white/50 border-t-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] px-2.5 py-1 sm:px-4 sm:py-2.5 rounded-full font-bold uppercase tracking-wider text-[9px] sm:text-xs transition flex items-center gap-1 cursor-pointer"
                  style={{
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                  }}
                >
                  <span>{currentSlide.secondaryText || 'Admisiones 2026'}</span>
                </button>

                {currentUser && (
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[10px] border border-amber-400/40 backdrop-blur-md shadow-xs cursor-pointer"
                    title="Editar este carrusel en el CMS"
                  >
                    <Edit3 className="w-3 h-3" />
                    Editar Slider
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Carousel Navigation Arrows: Responsive hitboxes & Apple Crystal Glass styling */}
        {activeSlides.length > 1 && (
          <>
            <button
              id="btn-carousel-prev"
              onClick={handlePrev}
              aria-label="Slide anterior"
              className="absolute left-1.5 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2.5 md:p-3 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white border border-white/40 border-t-white/80 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:scale-110 cursor-pointer"
              style={{
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                backdropFilter: 'blur(16px) saturate(180%)',
              }}
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
            <button
              id="btn-carousel-next"
              onClick={handleNext}
              aria-label="Slide siguiente"
              className="absolute right-1.5 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2.5 md:p-3 rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white border border-white/40 border-t-white/80 transition-all shadow-[0_8px_24px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:scale-110 cursor-pointer"
              style={{
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                backdropFilter: 'blur(16px) saturate(180%)',
              }}
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators and Play/Pause control cleanly positioned at bottom-right in Apple Crystal Glass style */}
        <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 right-2 sm:right-6 md:right-8 z-30 flex items-center gap-1.5 sm:gap-3 pointer-events-auto">
          {/* Indicators */}
          <div 
            className="flex items-center space-x-1 sm:space-x-2 bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full border border-white/35 border-t-white/70 shadow-[0_8px_24px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.7)]"
            style={{
              WebkitBackdropFilter: 'blur(14px) saturate(180%)',
              backdropFilter: 'blur(14px) saturate(180%)',
            }}
          >
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
                className={`h-1 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIdx ? 'w-4 sm:w-8 bg-[#B91C1C]' : 'w-1 sm:w-2 bg-white/50 hover:bg-white/90'
                }`}
              />
            ))}
          </div>

          {/* Slide Number & Pause Button */}
          <div 
            className="hidden sm:flex items-center space-x-2.5 bg-white/20 px-3 py-1.5 rounded-full border border-white/35 border-t-white/70 text-xs text-white shadow-[0_8px_24px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.7)]"
            style={{
              WebkitBackdropFilter: 'blur(14px) saturate(180%)',
              backdropFilter: 'blur(14px) saturate(180%)',
            }}
          >
            <span className="font-mono font-bold text-amber-300">
              0{currentIdx + 1} <span className="text-white/70">/ 0{activeSlides.length}</span>
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
              title={isPaused ? 'Reanudar carrusel' : 'Pausar carrusel'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-amber-300" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

