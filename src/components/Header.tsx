import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import officialLogo from '../assets/images/programalogo.jpg';
import { 
  Shield, 
  Menu, 
  X, 
  Lock, 
  Sliders, 
  Phone, 
  Mail, 
  ChevronRight, 
  ChevronDown,
  Building2,
  Sparkles,
  LogOut 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    currentUser, 
    setIsLoginModalOpen, 
    setIsDirectorModalOpen,
    logout 
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nosotrosDropdownOpen, setNosotrosDropdownOpen] = useState(false);
  const [mobileNosotrosOpen, setMobileNosotrosOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNosotrosDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Oferta Académica', href: '#servicios' },
    { label: 'Noticias & Eventos', href: '#noticias' },
    { label: 'Admisiones', href: '#admisiones' },
    { label: 'Contacto', href: '#contacto' },
  ];

  const handleNavClick = (href: string) => {
    if (activeView !== 'portal') {
      setActiveView('portal');
    }
    setMobileMenuOpen(false);
    
    // Smooth scroll
    setTimeout(() => {
      const elem = document.querySelector(href);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header id="inicio" className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Governmental & Contact Bar (#0D3671) */}
      <div className="bg-[#0D3671] text-white text-xs py-2 sm:py-2 px-4 sm:px-8 border-b border-[#092652]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <span className="flex items-center gap-1.5 font-medium text-amber-300 text-xs text-center sm:text-left">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              Ministerio de Defensa • República Dominicana
            </span>
            <span className="hidden md:inline-block text-white/30">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-100">
              <Phone className="w-3.5 h-3.5 text-red-400" />
              (809) 530-5149 ext. 3899
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 text-slate-100">
              <Mail className="w-3.5 h-3.5 text-red-400" />
              admisiones@pecpffaa.edu.do
            </span>
          </div>

          <div className="flex items-center flex-wrap justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Botón ADMISIÓN  2026 */}
            <a 
              id="badge-admision"
              href="#admisiones"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#admisiones');
              }}
              className="bg-[#B91C1C] hover:bg-red-700 active:scale-95 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 xl:px-4 xl:py-1 rounded-md sm:rounded-lg text-xs sm:text-sm xl:text-xs font-bold shadow-md tracking-wide flex items-center justify-center text-center cursor-pointer select-none border border-red-400/40 transition-all hover:-translate-y-0.5"
            >
              ADMISIÓN  2026
            </a>

            {/* Botón Panel Administrativo - Oculto en Mobile y Tablet, visible en Desktop (xl:) */}
            {currentUser ? (
              <div className="hidden xl:flex items-center gap-2">
                <button
                  id="btn-topbar-dashboard"
                  onClick={() => setActiveView(activeView === 'dashboard' ? 'portal' : 'dashboard')}
                  className={`px-3 py-1 rounded-md font-bold text-xs transition-all flex items-center gap-2 border shadow-md cursor-pointer ${
                    activeView === 'dashboard' 
                      ? 'bg-amber-400 text-slate-900 border-amber-300 hover:bg-amber-300' 
                      : 'bg-white/20 hover:bg-white/30 text-white border-white/40'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{activeView === 'dashboard' ? 'Ver Portal' : 'Panel Administrativo'}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currentUser.role === 'Administrador' ? 'bg-[#B91C1C] text-white' : 'bg-slate-800 text-amber-300'
                  }`}>
                    {currentUser.role}
                  </span>
                </button>

                <button
                  id="btn-topbar-logout"
                  onClick={logout}
                  title="Cerrar Sesión"
                  className="p-1.5 rounded-md bg-red-950/80 hover:bg-red-800 text-red-200 border border-red-700/60 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-topbar-login-cms"
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden xl:inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold text-xs border border-white/40 transition-all shadow-md hover:border-amber-300 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Panel Administrativo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation Bar (#ffffff) */}
      <div className="bg-[#ffffff] text-slate-900 border-b-2 border-[#B91C1C] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          
          {/* Institutional Crest & Logo */}
          <div 
            onClick={() => handleNavClick('#inicio')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
            id="brand-logo-pecpffaa"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 shadow-md flex items-center justify-center border-2 border-[#0D3671] group-hover:scale-105 transition-transform duration-200 shrink-0">
              <img 
                src={officialLogo} 
                alt="Escudo Oficial PECPFFAA - Gran General Restaurador Gregorio Luperón"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-[#B91C1C] rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl sm:text-3xl tracking-wider text-[#0D3671] font-serif">
                  PECPFFAA
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 tracking-tight font-medium line-clamp-1 max-w-[260px] sm:max-w-md">
                Programa de Educación y Capacitación Profesional de las FF.AA.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-6 text-sm font-medium">
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#inicio');
              }}
              className="text-slate-700 hover:text-[#B91C1C] font-semibold transition-colors duration-150 relative py-1"
            >
              Inicio
            </a>

            {/* NOSOTROS Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setNosotrosDropdownOpen(true)}
              onMouseLeave={() => setNosotrosDropdownOpen(false)}
            >
              <button
                id="nav-dropdown-nosotros"
                onClick={() => setNosotrosDropdownOpen(!nosotrosDropdownOpen)}
                className={`flex items-center gap-1.5 font-semibold text-sm transition-colors py-1 cursor-pointer ${
                  nosotrosDropdownOpen ? 'text-[#B91C1C]' : 'text-slate-700 hover:text-[#B91C1C]'
                }`}
                aria-expanded={nosotrosDropdownOpen}
                aria-haspopup="true"
              >
                <span className="tracking-wide">Nosotros</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${nosotrosDropdownOpen ? 'rotate-180 text-[#B91C1C]' : 'text-slate-400'}`} />
              </button>

              {/* Dropdown Menu Card */}
              {nosotrosDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-80 z-50 animate-fadeIn">
                  <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#0D3671]/20 py-2.5 overflow-hidden">
                    
                    {/* Header inside dropdown */}
                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0D3671]">
                        Institucional • MIDE
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        PECPFFAA
                      </span>
                    </div>

                    {/* Primary Highlighted Option: DESPACHO DEL DIRECTOR */}
                    <div className="p-2">
                      <button
                        id="btn-nav-despacho-director"
                        onClick={() => {
                          setIsDirectorModalOpen(true);
                          setNosotrosDropdownOpen(false);
                        }}
                        className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/40 hover:from-blue-100 hover:to-indigo-100/60 border border-blue-200/80 transition-all flex items-start gap-3 group cursor-pointer shadow-xs hover:shadow-sm"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#0D3671] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 group-hover:bg-[#B91C1C] transition-all">
                          <Building2 className="w-5 h-5 text-amber-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-black uppercase tracking-wider text-[#0D3671] group-hover:text-[#B91C1C] transition-colors">
                              DESPACHO DEL DIRECTOR
                            </span>
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#B91C1C] text-white shadow-xs">
                              POPUP
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 font-medium">
                            Alocución oficial y perfil del Director General
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Secondary Institutional Options */}
                    <div className="px-2 pt-1 pb-1 space-y-1">
                      <button
                        onClick={() => {
                          handleNavClick('#institucion');
                          setNosotrosDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-[#0D3671] flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>Nuestra Institución & Misión</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => {
                          handleNavClick('#institucion');
                          setNosotrosDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-[#0D3671] flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>Ideario del Gran General Luperón</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Remaining Nav Links */}
            {navLinks.filter(l => l.label !== 'Inicio').map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-slate-700 hover:text-[#B91C1C] font-semibold transition-colors duration-150 relative py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex xl:hidden items-center gap-2">
            {currentUser && (
              <button
                onClick={() => setActiveView(activeView === 'dashboard' ? 'portal' : 'dashboard')}
                className="px-2.5 py-1.5 rounded bg-amber-400 text-slate-900 text-xs font-bold flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                {activeView === 'dashboard' ? 'Portal' : 'CMS'}
              </button>
            )}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menú"
              className="p-2 rounded-md bg-slate-100 text-[#0D3671] hover:bg-slate-200 border border-slate-300 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 animate-fadeIn shadow-lg">
            <div className="space-y-2 pb-3 border-b border-slate-200">
              <button
                onClick={() => handleNavClick('#inicio')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Inicio</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Mobile NOSOTROS collapsible */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/70">
                <button
                  onClick={() => setMobileNosotrosOpen(!mobileNosotrosOpen)}
                  className="w-full text-left px-3.5 py-2.5 bg-slate-100/90 font-bold text-xs uppercase tracking-wider text-[#0D3671] flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#B91C1C]" />
                    NOSOTROS
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileNosotrosOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileNosotrosOpen && (
                  <div className="p-2 space-y-1.5 bg-white border-t border-slate-200">
                    <button
                      id="btn-mobile-despacho-director"
                      onClick={() => {
                        setIsDirectorModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-blue-50/70 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-[#0D3671] flex items-center justify-between shadow-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#0D3671] text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
                          <Building2 className="w-4 h-4 text-amber-300" />
                        </div>
                        <div>
                          <span className="block font-black text-[#0D3671]">DESPACHO DEL DIRECTOR</span>
                          <span className="text-[10px] text-slate-500 font-normal">Alocución oficial y perfil</span>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-[#B91C1C] text-white">
                        Popup
                      </span>
                    </button>

                    <button
                      onClick={() => handleNavClick('#institucion')}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                    >
                      <span>Nuestra Institución & Misión</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>

              {navLinks.filter(l => l.label !== 'Inicio').map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0D3671] flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              {currentUser ? (
                <>
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-100 rounded text-xs text-slate-700">
                    <span className="font-semibold">{currentUser.name}</span>
                    <span className="bg-[#B91C1C] text-white px-2 py-0.5 rounded font-bold">{currentUser.role}</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveView(activeView === 'dashboard' ? 'portal' : 'dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-amber-400 text-slate-900 rounded font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Sliders className="w-4 h-4" />
                    {activeView === 'dashboard' ? 'Ir al Portal Público' : 'Administrar en Panel CMS'}
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 bg-red-50 text-[#B91C1C] border border-red-200 rounded font-semibold text-xs hover:bg-red-100"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-[#0D3671] text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  Panel Administrativo (Acceso CMS)
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
