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
      {/* Responsive Aspect Ratio Container with ample tablet clearance */}
      <div className="relative w-full aspect-auto lg:aspect-[21/9] xl:aspect-[16/7] min-h-[560px] sm:min-h-[640px] md:min-h-[660px] lg:min-h-[600px] xl:min-h-[620px] flex items-center">
        
        {/* Background Slide Image with dark gradient overlay */}
        {activeSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
              loading="eager"
            />
            {/* Background Slide Image with 16:9 aspect ratio and dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D3671] via-slate-900/90 to-transparent opacity-90 z-[5]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 z-[6]" />
            
            {/* Decorative Subtle Grid overlay */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none z-[7]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px'
              }}
            />
          </div>
        ))}

        {/* Foreground Content with High-Contrast Typography & Dynamic CTAs */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 w-full pt-8 pb-20 sm:pt-10 sm:pb-28 md:pt-12 md:pb-36 lg:pt-14 lg:pb-24">
          <div className="max-w-2xl lg:max-w-3xl space-y-3 sm:space-y-4 md:space-y-5">
            
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B91C1C] text-white text-xs sm:text-sm font-bold tracking-wider uppercase shadow-lg border border-red-400/40 backdrop-blur-sm animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{currentSlide.tag || 'Formación de Excelencia'}</span>
            </div>

            {/* Title with Sleek Typography and Bold Contrast (Scaled for Mobile, Tablet & Desktop) */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase leading-tight tracking-tight drop-shadow-md">
              {currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl drop-shadow line-clamp-3 sm:line-clamp-none">
              {currentSlide.subtitle}
            </p>

            {/* Accent Line (#B91C1C) */}
            <div className="w-20 sm:w-24 h-1.5 bg-[#B91C1C] rounded-full shadow"></div>

            {/* CTA Buttons (Pill-shaped, perfectly accessible on Tablet & Mobile) */}
            <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-2.5 sm:gap-3.5">
              {/* Primary CTA (#B91C1C) */}
              <button
                id="btn-hero-primary-cta"
                onClick={() => handleScrollTo(currentSlide.ctaLink || '#servicios')}
                className="bg-[#B91C1C] hover:bg-red-700 active:scale-95 text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold uppercase tracking-wider text-xs sm:text-sm transition shadow-lg flex items-center gap-2 group cursor-pointer border border-red-500/40"
              >
                <span>{currentSlide.ctaText || 'Explorar Carreras'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary CTA */}
              <button
                id="btn-hero-secondary-cta"
                onClick={() => handleScrollTo(currentSlide.secondaryLink || '#admisiones')}
                className="bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-md text-white border border-white/30 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold uppercase tracking-wider text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>{currentSlide.secondaryText || 'Admisiones 2026'}</span>
              </button>

              {/* Quick CMS slide edit helper for admins */}
              {currentUser && (
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs border border-amber-400/30 backdrop-blur-sm"
                  title="Editar este carrusel en el CMS"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Editar Slider en CMS
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

        {/* Slide Indicators and Play/Pause control */}
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-8 pointer-events-none">
          {/* Indicators */}
          <div className="flex items-center space-x-2 pointer-events-auto bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIdx ? 'w-8 bg-[#B91C1C]' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Slide Number & Pause Button */}
          <div className="hidden sm:flex items-center space-x-3 pointer-events-auto bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-slate-300">
            <span className="font-mono font-bold text-amber-400">
              0{currentIdx + 1} <span className="text-slate-500">/ 0{activeSlides.length}</span>
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-slate-400 hover:text-white transition-colors"
              title={isPaused ? 'Reanudar carrusel' : 'Pausar carrusel'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
