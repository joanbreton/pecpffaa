import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles,
  Pause,
  Play,
  Edit3
} from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const { slides, currentUser, setActiveView } = useApp();
  const activeSlides = slides.filter(s => s.active);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      <div className="w-full bg-slate-900 text-white py-20 px-4 text-center">
        <p className="text-lg text-slate-300">No hay diapositivas activas en el carrusel.</p>
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
      className="relative w-full bg-slate-950 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Responsive Container: adapts naturally to widescreen proportions without stretching or over-cropping images */}
      <div className="relative w-full h-[440px] sm:h-[500px] md:h-[550px] lg:h-[600px] xl:h-[640px] flex items-end overflow-hidden">
        
        {/* Background Slide Image - crisp, properly scaled and adapted to container */}
        {activeSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              idx === currentIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Ambient soft background to prevent harsh borders on any non-standard image proportions */}
            <img
              src={slide.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-25 scale-110 pointer-events-none"
            />
            {/* Main high-resolution image adapting to container with sharp focus */}
            <img
              src={slide.image}
              alt={slide.title}
              className="relative w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out"
              loading="eager"
            />
          </div>
        ))}

        {/* Foreground Content: docked at bottom-left in a highly transparent Liquid Glass container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 w-full pb-14 sm:pb-16 pt-6">
          <div className="relative max-w-lg lg:max-w-xl p-5 sm:p-6 lg:p-7 rounded-3xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-white/[0.14] via-white/[0.03] to-black/[0.12] border border-white/40 border-t-white/75 border-l-white/55 border-b-white/20 shadow-[0_16px_45px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.75),inset_0_-1px_1px_rgba(255,255,255,0.15)] space-y-3.5 animate-fadeIn">
            
            {/* Liquid Glass Specular Shimmer Highlights */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-60 h-60 rounded-full bg-white/25 blur-2xl opacity-50" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-cyan-400/10 blur-3xl opacity-40" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-3xl" />

            {/* Tag / Badge en Cápsula Liquid Glass */}
            <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B91C1C]/90 backdrop-blur-md text-white text-xs font-bold tracking-wider uppercase shadow-[0_2px_10px_rgba(185,28,28,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)] border border-white/40">
              <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
              <span>{currentSlide.tag || 'Formación de Excelencia'}</span>
            </div>

            {/* Title with Sleek Typography & Strong Contrast Shadow */}
            <h1 className="relative z-10 text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white uppercase leading-snug tracking-tight line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] font-sans">
              {currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="relative z-10 text-xs sm:text-sm text-slate-100 font-medium leading-relaxed line-clamp-2 sm:line-clamp-3 drop-shadow-[0_1px_5px_rgba(0,0,0,0.9)]">
              {currentSlide.subtitle}
            </p>

            {/* Accent Line con Brillo Líquido */}
            <div className="relative z-10 w-14 sm:w-16 h-1 bg-gradient-to-r from-[#B91C1C] via-red-500 to-amber-400 rounded-full shadow-[0_0_12px_rgba(220,38,38,0.8)]"></div>

            {/* CTA Buttons */}
            <div className="relative z-10 pt-1 flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Primary CTA (#B91C1C) */}
              <button
                id="btn-hero-primary-cta"
                onClick={() => handleScrollTo(currentSlide.ctaLink || '#servicios')}
                className="bg-[#B91C1C] hover:bg-red-700 active:scale-95 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold uppercase tracking-wider text-xs transition shadow-lg flex items-center gap-1.5 group cursor-pointer border border-red-400/50"
              >
                <span>{currentSlide.ctaText || 'Explorar Carreras'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary CTA Liquid Glass Button */}
              <button
                id="btn-hero-secondary-cta"
                onClick={() => handleScrollTo(currentSlide.secondaryLink || '#admisiones')}
                className="bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur-xl text-white border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold uppercase tracking-wider text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentSlide.secondaryText || 'Admisiones 2026'}</span>
              </button>

              {/* Quick CMS slide edit helper for admins */}
              {currentUser && (
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[11px] border border-amber-400/40 backdrop-blur-md shadow-xs"
                  title="Editar este carrusel en el CMS"
                >
                  <Edit3 className="w-3 h-3" />
                  Editar Slider
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {activeSlides.length > 1 && (
          <>
            <button
              id="btn-carousel-prev"
              onClick={handlePrev}
              aria-label="Slide anterior"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-[#0D3671] text-white border border-white/20 backdrop-blur-sm transition-all shadow-lg hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              id="btn-carousel-next"
              onClick={handleNext}
              aria-label="Slide siguiente"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-[#0D3671] text-white border border-white/20 backdrop-blur-sm transition-all shadow-lg hover:scale-110"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators and Play/Pause control cleanly positioned at bottom-right */}
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 z-30 flex items-center gap-2.5 sm:gap-3 pointer-events-auto">
          {/* Indicators */}
          <div className="flex items-center space-x-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIdx ? 'w-8 bg-[#B91C1C]' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Slide Number & Pause Button */}
          <div className="hidden sm:flex items-center space-x-2.5 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-slate-300 shadow-lg">
            <span className="font-mono font-bold text-amber-400">
              0{currentIdx + 1} <span className="text-slate-500">/ 0{activeSlides.length}</span>
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
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
