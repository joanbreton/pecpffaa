import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Shield, 
  Award, 
  Building2, 
  Mail, 
  Phone, 
  Download, 
  Send, 
  CheckCircle2, 
  Star,
  Quote,
  GraduationCap,
  Clock,
  Printer,
  Scale,
  Briefcase,
  UserCheck,
  Edit3
} from 'lucide-react';
import officialLogo from '../assets/images/programalogo.jpg';

export const DirectorModal: React.FC = () => {
  const { 
    isDirectorModalOpen, 
    setIsDirectorModalOpen, 
    directorData, 
    currentUser, 
    setActiveView, 
    showNotification 
  } = useApp();
  const [activeTab, setActiveTab] = useState<'biografia' | 'mensaje' | 'funciones' | 'marco-legal' | 'contacto'>('biografia');

  const isAdmin = currentUser?.role === 'Administrador';

  // Manejo de tecla ESC y bloqueo del scroll de fondo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDirectorModalOpen(false);
      }
    };
    if (isDirectorModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isDirectorModalOpen, setIsDirectorModalOpen]);

  if (!isDirectorModalOpen) return null;

  const handlePrintOrDownload = () => {
    showNotification('Generando documento oficial del Despacho del Director...', 'info');
    setTimeout(() => {
      window.print();
    }, 350);
  };

  const handleGoToContact = () => {
    setIsDirectorModalOpen(false);
    setTimeout(() => {
      const contactElem = document.querySelector('#contacto');
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleGoToCMS = () => {
    setIsDirectorModalOpen(false);
    setActiveView('dashboard');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsDirectorModalOpen(false);
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ogtic-director-modal-title"
    >
      <div className="relative bg-white rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* =========================================================================
            BARRA GUBERNAMENTAL SUPERIOR & MIGAS DE PAN (CLON ESTILO OGTIC / GOB.DO)
           ========================================================================= */}
        <div className="bg-[#003876] text-white px-5 sm:px-8 py-3 sm:py-3.5 border-b-4 border-[#CE1126] flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white p-0.5 border-2 border-white/90 shadow shrink-0 flex items-center justify-center overflow-hidden">
              <img 
                src={officialLogo} 
                alt="Escudo Oficial PECPFFAA" 
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-blue-100 font-medium tracking-wide">
                <span>Inicio</span>
                <span>/</span>
                <span>Sobre nosotros</span>
                <span>/</span>
                <span className="text-amber-300 font-bold">Despacho del Director</span>
              </div>
              <h2 id="ogtic-director-modal-title" className="text-base sm:text-xl font-extrabold tracking-tight text-white mt-0.5 font-sans">
                {directorData.title || 'Despacho del Director General'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleGoToCMS}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-sm transition-all cursor-pointer"
                title="Editar este contenido desde el Panel Administrativo CMS"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-900" />
                <span>Editar en CMS</span>
              </button>
            )}

            {/* Botón de Cierre */}
            <button
              onClick={() => setIsDirectorModalOpen(false)}
              aria-label="Cerrar ventana"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:rotate-90 duration-200 cursor-pointer border border-white/20 shrink-0 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            HEADER INTERNO & PESTAÑAS DE NAVEGACIÓN ESTILO OGTIC
           ========================================================================= */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-8 pt-4 pb-0 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-[#003876] border border-blue-200">
                <Shield className="w-3 h-3 text-[#CE1126]" />
                Órgano de Máxima Dirección Institucional
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Ministerio de Defensa de la República Dominicana • {directorData.institution || 'PECPFFAA'}
              </p>
            </div>

            {/* Acciones Rápidas */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintOrDownload}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                title="Imprimir o guardar ficha"
              >
                <Printer className="w-3.5 h-3.5 text-[#003876]" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>
              <button
                onClick={handleGoToContact}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#003876] hover:bg-blue-900 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>Contacto</span>
              </button>
            </div>
          </div>

          {/* Barra de Pestañas (Clonación de Estructura de Secciones OGTIC) */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none border-b border-transparent -mb-[1px]">
            {[
              { id: 'biografia', label: 'Biografía & Perfil', icon: UserCheck },
              { id: 'mensaje', label: 'Mensaje Oficial', icon: Quote },
              { id: 'funciones', label: 'Funciones del Despacho', icon: Briefcase },
              { id: 'marco-legal', label: 'Marco Legal', icon: Scale },
              { id: 'contacto', label: 'Atención & Canales', icon: Building2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'border-[#003876] text-[#003876] bg-white rounded-t-lg shadow-2xs' 
                      : 'border-transparent text-slate-600 hover:text-[#003876] hover:bg-slate-100/80 rounded-t-lg'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#CE1126]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            CUERPO DEL POPUP: 2 COLUMNAS (IZQUIERDA: PÁRRAFOS / DERECHA: FOTO 9:16)
           ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* ---------------------------------------------------------------------
                COLUMNA IZQUIERDA: PÁRRAFOS Y CONTENIDO PRINCIPAL (lg:col-span-7 xl:col-span-8)
               --------------------------------------------------------------------- */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-5 text-slate-700 order-2 lg:order-1">
              
              {/* TAB 1: BIOGRAFÍA & PERFIL PROFESIONAL */}
              {activeTab === 'biografia' && (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Encabezado Semblanza */}
                  <div className="border-b border-slate-200 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#CE1126]">
                      {directorData.bioSubtitle || 'Semblanza Oficial'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#003876] font-sans mt-0.5">
                      {directorData.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600">
                      {directorData.bioSummary || `${directorData.title} • Fuerzas Armadas de la República Dominicana`}
                    </p>
                  </div>

                  {/* Columna de Párrafos Biográficos Dinámicos */}
                  <div className="space-y-3.5 text-sm sm:text-[15px] leading-relaxed text-slate-700 text-justify">
                    {directorData.bioParagraphs && directorData.bioParagraphs.length > 0 ? (
                      directorData.bioParagraphs.map((parr, idx) => (
                        <p key={idx}>{parr}</p>
                      ))
                    ) : (
                      <p>Información biográfica del Director General en proceso de actualización.</p>
                    )}
                  </div>

                  {/* Formación Académica & Credenciales (Estilo Fichas OGTIC) */}
                  {directorData.academicDegrees && directorData.academicDegrees.length > 0 && (
                    <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#003876] flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-[#CE1126]" />
                        Formación Académica y Especializaciones
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        {directorData.academicDegrees.map((deg, idx) => (
                          <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-800 block">{deg.title}</span>
                              <span className="text-slate-500">{deg.institution}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Distinciones & Condecoraciones */}
                  {directorData.distinctions && directorData.distinctions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-bold text-slate-700">Distinciones Oficiales:</span>
                      {directorData.distinctions.map((dist, idx) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Award className="w-3 h-3 text-amber-600" />
                          {dist}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: MENSAJE OFICIAL / ALOCUCIÓN */}
              {activeTab === 'mensaje' && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Tarjeta de Cita Protocolar Estilo OGTIC */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-4 sm:p-5 rounded-xl border border-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#CE1126]" />
                    <div className="flex items-start gap-3">
                      <Quote className="w-8 h-8 text-[#003876]/30 shrink-0" />
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#003876]">
                          {directorData.messageSubtitle || 'Alocución del Director General • Ciclo 2026'}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 font-sans leading-snug mt-0.5">
                          "{directorData.messageQuote || 'Formar con disciplina, liderar con honor y servir a la Patria con excelencia técnica y moral.'}"
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Párrafos del Mensaje Dinámicos */}
                  <div className="space-y-3.5 text-sm sm:text-[15px] leading-relaxed text-slate-700 text-justify">
                    {directorData.messageParagraphs && directorData.messageParagraphs.length > 0 ? (
                      directorData.messageParagraphs.map((parr, idx) => (
                        <p key={idx}>{parr}</p>
                      ))
                    ) : (
                      <p>Mensaje oficial del Despacho del Director General en proceso de actualización.</p>
                    )}
                  </div>

                  {/* Bloque de Firma Oficial */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wider text-[#003876]">{directorData.name}</p>
                      <p className="text-sm font-bold text-slate-900">{directorData.title}</p>
                      <p className="text-xs text-slate-500">Ministerio de Defensa • República Dominicana</p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Firma Oficial Certificada
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: FUNCIONES PRINCIPALES DEL DESPACHO */}
              {activeTab === 'funciones' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#CE1126]">
                      Competencias y Facultades Institucionales
                    </span>
                    <h3 className="text-lg font-black text-[#003876]">
                      Funciones del Despacho del Director General
                    </h3>
                    <p className="text-xs text-slate-500">
                      Conforme al Reglamento Orgánico del Ministerio de Defensa y la normativa académica del {directorData.institution || 'PECPFFAA'}.
                    </p>
                  </div>

                  {/* Tarjetas de Funciones Dinámicas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {directorData.functions && directorData.functions.length > 0 ? (
                      directorData.functions.map((f, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-extrabold text-[#CE1126] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                              {f.num || `0${idx + 1}`}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Atribución</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 pt-1">{f.title}</h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{f.desc}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 col-span-2">No hay funciones registradas.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: MARCO LEGAL */}
              {activeTab === 'marco-legal' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#CE1126]">
                      Base Jurídica e Institucional
                    </span>
                    <h3 className="text-lg font-black text-[#003876]">
                      Marco Legal del Despacho y del PECPFFAA
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-700">
                    {directorData.legalFramework && directorData.legalFramework.length > 0 ? (
                      directorData.legalFramework.map((leg, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
                          <Scale className="w-4 h-4 text-[#003876] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 block">{leg.title}</span>
                            <span className="text-slate-600">{leg.desc}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">Marco legal en proceso de actualización.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: ATENCIÓN & CONTACTO */}
              {activeTab === 'contacto' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#CE1126]">
                      Canales Institucionales
                    </span>
                    <h3 className="text-lg font-black text-[#003876]">
                      Contacto Directo del Despacho del Director
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-[#003876]">
                        <Building2 className="w-3.5 h-3.5 text-[#CE1126]" />
                        Sede y Ubicación
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {directorData.address}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-[#003876]">
                        <Clock className="w-3.5 h-3.5 text-[#CE1126]" />
                        Horario de Atención
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {directorData.schedule}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-[#003876]">
                        <Phone className="w-3.5 h-3.5 text-[#CE1126]" />
                        Línea Telefónica Directa
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {directorData.phone} • {directorData.extension} (Secretaría del Despacho)
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-[#003876]">
                        <Mail className="w-3.5 h-3.5 text-[#CE1126]" />
                        Correspondencia Electrónica
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {directorData.email}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleGoToContact}
                      className="w-full py-2.5 rounded-xl bg-[#003876] hover:bg-blue-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>Ir al Formulario Oficial de Contacto</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* ---------------------------------------------------------------------
                COLUMNA DERECHA: FOTO OFICIAL EN PROPORCIÓN 9:16 (CLON ESTRUCTURA OGTIC)
                Utiliza reactivamente: directorData.photoUrl
               --------------------------------------------------------------------- */}
            <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2 flex flex-col items-center">
              
              <div className="w-full max-w-[310px] sm:max-w-[330px] bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
                
                {/* Cabecera de la Ficha Fotográfica (Estilo OGTIC) */}
                <div className="bg-[#003876] text-white px-3.5 py-2 text-center border-b-2 border-[#CE1126]">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block">
                    República Dominicana
                  </span>
                  <span className="text-xs font-bold block text-white">
                    {directorData.title}
                  </span>
                </div>

                {/* Marco de Imagen 9:16 con la Foto Dinámica del CMS */}
                <div className="p-3 bg-slate-50/70">
                  <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-slate-950 shadow-md group border border-slate-300">
                    
                    {/* Fotografía Oficial */}
                    <img
                      src={directorData.photoUrl || 'https://i.postimg.cc/V6vqjfQf/director-pecpffaa.jpg'}
                      alt={directorData.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                      loading="eager"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85';
                      }}
                    />

                    {/* Insignia Oficial 9:16 OGTIC */}
                    <div className="absolute top-2.5 right-2.5 bg-[#003876]/90 backdrop-blur-md text-white px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider shadow border border-white/20 flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5 text-amber-300" />
                      <span>OFICIAL 9:16</span>
                    </div>

                    {/* Faja Inferior Tricolor y Cargo */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-3 text-white text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="w-3 h-1.5 bg-[#003876] rounded-2xs inline-block"></span>
                        <span className="w-3 h-1.5 bg-[#ffffff] rounded-2xs inline-block"></span>
                        <span className="w-3 h-1.5 bg-[#CE1126] rounded-2xs inline-block"></span>
                      </div>
                      <p className="text-[10px] uppercase font-extrabold tracking-wider text-amber-300">
                        {directorData.title}
                      </p>
                      <p className="text-xs font-bold text-white leading-tight">
                        {directorData.name}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Ficha de Resumen & Datos de Despacho (Clon OGTIC) */}
                <div className="p-3.5 space-y-2.5 text-xs text-slate-700 bg-white">
                  
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500 text-[11px] font-medium">Institución:</span>
                    <span className="font-bold text-[#003876] text-[11px]">{directorData.institution}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500 text-[11px] font-medium">Rango:</span>
                    <span className="font-bold text-slate-800 text-[11px]">{directorData.name}</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500 text-[11px] font-medium">Extensión:</span>
                    <span className="font-mono font-bold text-[#CE1126] text-[11px]">{directorData.extension}</span>
                  </div>

                  <div className="flex items-center justify-between pb-1">
                    <span className="text-slate-500 text-[11px] font-medium">Correo:</span>
                    <span className="text-slate-700 text-[10px] font-mono font-semibold truncate max-w-[170px]" title={directorData.email}>
                      {directorData.email}
                    </span>
                  </div>

                  {/* Botones de Descarga en Barra Lateral */}
                  <div className="pt-2 flex flex-col gap-1.5">
                    <button
                      onClick={handlePrintOrDownload}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] flex items-center justify-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>Descargar Perfil Oficial</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>

        {/* =========================================================================
            PIE INFERIOR DEL MODAL CON CANALES GUBERNAMENTALES DE ATENCIÓN
           ========================================================================= */}
        <div className="bg-slate-100 px-5 sm:px-8 py-3 sm:py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-[#003876]" />
              {directorData.phone} {directorData.extension}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-[#CE1126]" />
              {directorData.email}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsDirectorModalOpen(false)}
              className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
