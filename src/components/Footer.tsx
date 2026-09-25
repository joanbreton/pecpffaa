import React from 'react';
import { useApp } from '../context/AppContext';
import officialLogo from '../assets/images/programalogo.jpg';
import { 
  Lock, 
  ChevronRight, 
  GraduationCap, 
  Award 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setIsLoginModalOpen, currentUser } = useApp();

  const currentYear = new Date().getFullYear();

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0D3671] text-slate-200 border-t-4 border-[#B91C1C] text-xs">
      
      {/* Upper Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Crest */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-full bg-white p-1 flex items-center justify-center border-2 border-white/80 shadow shrink-0">
                <img 
                  src={officialLogo} 
                  alt="Escudo Oficial PECPFFAA" 
                  className="w-full h-full object-contain rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white font-serif tracking-wider">
                  PECPFFAA
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Programa de Educación y Capacitación Profesional de las FF.AA. Gran General Restaurador Gregorio Luperón.
            </p>
          </div>

          {/* Academic Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-white/20 pb-2 flex items-center justify-between">
              <span>Oferta Académica</span>
              <GraduationCap className="w-4 h-4 text-[#B91C1C]" />
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Maestría en Estrategia y Seguridad', href: '#servicios' },
                { label: 'Comando y Estado Mayor Conjunto', href: '#servicios' },
                { label: 'Diplomado en Ciberdefensa', href: '#servicios' },
                { label: 'Gestión de Riesgos y Desastres', href: '#servicios' },
                { label: 'Conferencias Magistrales', href: '#noticias' }
              ].map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1 text-slate-300"
                  >
                    <ChevronRight className="w-3 h-3 text-[#B91C1C]" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional & Transparency */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-white/20 pb-2 flex items-center justify-between">
              <span>Institucional</span>
              <Award className="w-4 h-4 text-amber-400" />
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="#institucion" onClick={(e) => { e.preventDefault(); handleNavClick('#institucion'); }} className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#B91C1C]" />
                  Misión, Visión y Valores
                </a>
              </li>
              <li>
                <a href="#institucion" onClick={(e) => { e.preventDefault(); handleNavClick('#institucion'); }} className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-[#B91C1C]" />
                  Doctrina Militar Conjunta
                </a>
              </li>
              <li>
                <span className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#B91C1C]" />
                  Reglamento de Posgrado
                </span>
              </li>
              <li>
                <span className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#B91C1C]" />
                  Directorio de Dependencias MIDE
                </span>
              </li>
            </ul>
          </div>

          {/* Direct Access & Administration (CMS) */}
          <div className="space-y-3 bg-[#092652] p-4 rounded-xl border border-white/10">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Gestión & CMS Interno
            </h4>
            <p className="text-[11px] text-slate-300">
              Panel administrativo para publicación de noticias, programas, carrusel y administración de roles.
            </p>

            <div className="pt-2 space-y-2">
              {currentUser ? (
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <span>Abrir Dashboard CMS</span>
                  <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.2 rounded font-mono">
                    {currentUser.role}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full py-2 bg-[#B91C1C] hover:bg-red-700 text-white rounded font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Acceso CMS</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Legal Sub-footer */}
      <div className="bg-slate-950 text-slate-400 py-4 px-4 sm:px-8 border-t border-slate-800 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            © {currentYear} <strong>PECPFFAA</strong> — Programa de Educación y Capacitación Profesional de las FF.AA. Todos los derechos reservados.
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-white cursor-pointer">Términos de Uso</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Políticas de Privacidad</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Mapa del Sitio</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
