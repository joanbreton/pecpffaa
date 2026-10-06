import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Shield, 
  Award, 
  Building2, 
  Mail, 
  Phone, 
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
  Edit3,
  FileText,
  ArrowLeft
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
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  const isAdmin = currentUser?.role === 'Administrador';

  // Manejo de tecla ESC y bloqueo del scroll de fondo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPrintPreviewOpen) {
          setIsPrintPreviewOpen(false);
        } else {
          setIsDirectorModalOpen(false);
        }
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
  }, [isDirectorModalOpen, setIsDirectorModalOpen, isPrintPreviewOpen]);

  if (!isDirectorModalOpen) return null;

  const handleOpenPrintPreview = () => {
    setIsPrintPreviewOpen(true);
  };

  const handleExecutePrint = () => {
    showNotification('Abriendo diálogo de impresión del sistema...', 'info');
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleGoToContact = () => {
    setIsDirectorModalOpen(false);
    setIsPrintPreviewOpen(false);
    setTimeout(() => {
      const contactElem = document.querySelector('#contacto');
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleGoToCMS = () => {
    setIsDirectorModalOpen(false);
    setIsPrintPreviewOpen(false);
    setActiveView('dashboard');
  };

  // Fecha actual formateada para el documento oficial
  const todayFormatted = new Date().toLocaleDateString('es-DO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPrintPreviewOpen) {
          setIsDirectorModalOpen(false);
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ogtic-director-modal-title"
    >
      {/* Estilos para impresión limpia (oculta controles web e imprime solo el documento) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #director-printable-document, #director-printable-document * {
            visibility: visible !important;
          }
          #director-printable-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 1.5cm !important;
            background: white !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* =========================================================================
          MODO PREVISUALIZACIÓN DE IMPRESIÓN COMPLETA (BIOGRAFÍA, FOTO 1:1, FUNCIONES, DOCTRINA)
         ========================================================================= */}
      {isPrintPreviewOpen ? (
        <div className="relative bg-slate-100 rounded-2xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl border-2 border-slate-300 overflow-hidden my-auto animate-fadeIn">
          
          {/* Barra Superior de Control de la Previsualización */}
          <div className="no-print bg-[#003876] text-white px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3 border-b-4 border-[#CE1126] shrink-0 shadow-md">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPrintPreviewOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Volver a la vista interactiva"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Volver</span>
              </button>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-300" />
                  Previsualización de Impresión • Expediente Biográfico Oficial
                </h3>
                <p className="text-[11px] text-blue-100 hidden sm:block">
                  Documento institucional completo listo para imprimir o exportar a PDF
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExecutePrint}
                className="px-4 py-2 rounded-xl bg-[#CE1126] hover:bg-red-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar PDF</span>
              </button>

              <button
                onClick={() => setIsPrintPreviewOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Cerrar previsualización"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hoja de Impresión Institucional (Área Imprimible) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200/60 flex justify-center">
            
            <div 
              id="director-printable-document" 
              className="bg-white max-w-3xl w-full p-6 sm:p-10 shadow-lg rounded-xl border border-slate-300 text-slate-800 space-y-6 text-xs sm:text-[13px] leading-relaxed"
            >
              
              {/* Membrete Oficial Dominicano */}
              <div className="border-b-2 border-[#003876] pb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 border border-slate-300 flex items-center justify-center shrink-0">
                    <img 
                      src={officialLogo} 
                      alt="Escudo Oficial PECPFFAA" 
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CE1126] block">
                      República Dominicana • Ministerio de Defensa
                    </span>
                    <h1 className="text-base sm:text-lg font-black text-[#003876] uppercase tracking-tight font-serif">
                      Programa de Educación y Capacitación Profesional de las FF.AA.
                    </h1>
                    <p className="text-[11px] font-semibold text-slate-600">
                      "Gran General Restaurador Gregorio Luperón"
                    </p>
                    <span className="inline-block mt-1 font-bold text-[11px] uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      DESPACHO DEL DIRECTOR GENERAL
                    </span>
                  </div>
                </div>

                <div className="text-right hidden sm:block shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono block">Fecha de Expedición:</span>
                  <span className="text-xs font-bold text-slate-700 block">{todayFormatted}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                    ✓ Documento Oficial
                  </span>
                </div>
              </div>

              {/* Ficha Resumen con Fotografía 1:1 Completa */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                
                {/* Foto en proporción 1:1 Completa sin cortes */}
                <div className="w-36 h-36 sm:w-44 sm:h-44 aspect-square rounded-xl overflow-hidden bg-slate-900 border-2 border-[#003876] shadow-sm shrink-0 flex items-center justify-center p-0.5">
                  <img
                    src={directorData.photoUrl || 'https://i.postimg.cc/V6vqjfQf/director-pecpffaa.jpg'}
                    alt={directorData.name}
                    className="w-full h-full object-contain object-center"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>

                {/* Datos de Identificación Protocolar */}
                <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#CE1126] tracking-wider block">
                      Perfil del Titular
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-[#003876]">
                      {directorData.name}
                    </h2>
                    <p className="text-xs font-bold text-slate-700">
                      {directorData.title}
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium">
                      {directorData.institution} • Fuerzas Armadas
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 border-t border-slate-200 text-[11px]">
                    <div>
                      <span className="font-bold text-slate-700">Teléfono:</span> {directorData.phone} {directorData.extension}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Correo:</span> {directorData.email}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Horario:</span> {directorData.schedule}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Sede:</span> MIDE, Santo Domingo, D.N.
                    </div>
                  </div>
                </div>

              </div>

              {/* I. SEMBLANZA Y BIOGRAFÍA COMPLETA */}
              <div className="space-y-3 pt-2">
                <div className="border-b border-slate-200 pb-1 flex items-center justify-between">
                  <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-[#003876] flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#CE1126]" />
                    I. Semblanza Oficial y Trayectoria
                  </h3>
                  <span className="text-[10px] text-slate-500 font-semibold">{directorData.bioSubtitle}</span>
                </div>

                <div className="space-y-2.5 text-justify leading-relaxed text-slate-700">
                  {directorData.bioParagraphs?.map((parr, idx) => (
                    <p key={idx}>{parr}</p>
                  ))}
                </div>

                {/* Formación Académica */}
                {directorData.academicDegrees && directorData.academicDegrees.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 block mb-1.5">
                      Grados Académicos y Especializaciones:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {directorData.academicDegrees.map((deg, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200">
                          <span className="font-bold text-slate-800 block text-[11px]">• {deg.title}</span>
                          <span className="text-[10px] text-slate-500">{deg.institution}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Distinciones */}
                {directorData.distinctions && directorData.distinctions.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 block mb-1">
                      Condecoraciones y Distinciones Castrenses:
                    </span>
                    <p className="text-[11px] text-slate-700 font-medium">
                      {directorData.distinctions.join(' • ')}
                    </p>
                  </div>
                )}
              </div>

              {/* II. ALOCUCIÓN Y MENSAJE OFICIAL */}
              <div className="space-y-3 pt-3">
                <div className="border-b border-slate-200 pb-1">
                  <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-[#003876] flex items-center gap-1.5">
                    <Quote className="w-4 h-4 text-[#CE1126]" />
                    II. Alocución y Mensaje a la Comunidad Académica
                  </h3>
                </div>

                {/* Cita Destacada */}
                <div className="p-3 bg-blue-50/60 rounded-lg border-l-4 border-[#CE1126] text-slate-800 font-serif italic text-xs leading-relaxed">
                  "{directorData.messageQuote}"
                </div>

                <div className="space-y-2.5 text-justify leading-relaxed text-slate-700">
                  {directorData.messageParagraphs?.map((parr, idx) => (
                    <p key={idx}>{parr}</p>
                  ))}
                </div>
              </div>

              {/* III. FUNCIONES DEL DESPACHO */}
              {directorData.functions && directorData.functions.length > 0 && (
                <div className="space-y-2.5 pt-3">
                  <div className="border-b border-slate-200 pb-1">
                    <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-[#003876] flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-[#CE1126]" />
                      III. Funciones y Atribuciones del Despacho
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {directorData.functions.map((f, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200">
                        <span className="font-bold text-slate-900 block">{f.num}. {f.title}</span>
                        <span className="text-slate-600 block text-[10px] leading-snug">{f.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IV. MARCO LEGAL */}
              {directorData.legalFramework && directorData.legalFramework.length > 0 && (
                <div className="space-y-2 pt-3">
                  <div className="border-b border-slate-200 pb-1">
                    <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-[#003876] flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-[#CE1126]" />
                      IV. Marco Legal e Institucional
                    </h3>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    {directorData.legalFramework.map((leg, idx) => (
                      <div key={idx}>
                        <span className="font-bold text-slate-800">• {leg.title}:</span>{' '}
                        <span className="text-slate-600">{leg.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* V. FIRMA OFICIAL Y CIERRE INSTITUCIONAL */}
              <div className="pt-8 border-t-2 border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                <div>
                  <div className="w-48 h-0.5 bg-slate-400 mx-auto sm:mx-0 mb-2"></div>
                  <p className="font-black text-xs text-[#003876] uppercase tracking-wider">{directorData.name}</p>
                  <p className="text-[11px] font-bold text-slate-700">{directorData.title}</p>
                  <p className="text-[10px] text-slate-500">Ministerio de Defensa • República Dominicana</p>
                </div>

                <div className="text-center sm:text-right">
                  <span className="text-[11px] font-serif font-black tracking-widest text-[#003876] block">
                    DIOS • PATRIA • LIBERTAD
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                    Honor • Disciplina • Deber
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* =========================================================================
            VENTANA INTERACTIVA HABITUAL (POPUP CON TABS ESTILO OGTIC)
           ========================================================================= */
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
                  onClick={handleOpenPrintPreview}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                  title="Abrir previsualización de impresión de todo el contenido biográfico y foto"
                >
                  <Printer className="w-3.5 h-3.5 text-[#003876]" />
                  <span>Imprimir</span>
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
              CUERPO DEL POPUP: 2 COLUMNAS (IZQUIERDA: PÁRRAFOS / DERECHA: FOTO 1:1)
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
                    <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
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

                      <button
                        type="button"
                        onClick={handleOpenPrintPreview}
                        className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#003876] text-xs font-bold border border-blue-200 shadow-2xs transition-colors cursor-pointer shrink-0"
                        title="Abrir previsualización de impresión de todo el contenido biográfico y foto"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#CE1126]" />
                        <span>Imprimir Biografía</span>
                      </button>
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
                  COLUMNA DERECHA: FOTO OFICIAL EN TAMAÑO 1:1 COMPLETA
                  (Tamaño 1:1 que se pueda ver completa, sin botón de descargar perfil)
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

                  {/* Marco de Imagen 1:1 con la Foto Completa sin capas encima */}
                  <div className="p-3 bg-slate-50/70">
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-900 shadow-md border-2 border-slate-300 flex items-center justify-center group">
                      
                      {/* Fondo suave para complementar bordes si la imagen tiene margen */}
                      <img
                        src={directorData.photoUrl || 'https://i.postimg.cc/V6vqjfQf/director-pecpffaa.jpg'}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-md opacity-20 scale-110 pointer-events-none"
                      />

                      {/* Fotografía Oficial en Proporción 1:1 que se ve completa al 100% */}
                      <img
                        src={directorData.photoUrl || 'https://i.postimg.cc/V6vqjfQf/director-pecpffaa.jpg'}
                        alt={directorData.name}
                        className="relative z-10 w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.01]"
                        referrerPolicy="no-referrer"
                        loading="eager"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85';
                        }}
                      />

                      {/* Insignia Oficial 1:1 en esquina */}
                      <div className="absolute top-2.5 right-2.5 z-20 bg-[#003876]/90 backdrop-blur-md text-white px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider shadow border border-white/20 flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5 text-amber-300" />
                        <span>FOTO 1:1</span>
                      </div>

                    </div>

                    {/* Cinta institucional bajo la foto (sin superponerse a la imagen) */}
                    <div className="mt-2.5 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="w-4 h-1 bg-[#003876] rounded-2xs inline-block"></span>
                        <span className="w-4 h-1 bg-[#ffffff] border border-slate-300 rounded-2xs inline-block"></span>
                        <span className="w-4 h-1 bg-[#CE1126] rounded-2xs inline-block"></span>
                      </div>
                      <p className="text-[10px] uppercase font-extrabold tracking-wider text-[#CE1126]">
                        {directorData.title}
                      </p>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {directorData.name}
                      </p>
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

                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500 text-[11px] font-medium">Correo:</span>
                      <span className="text-slate-700 text-[10px] font-mono font-semibold truncate max-w-[170px]" title={directorData.email}>
                        {directorData.email}
                      </span>
                    </div>

                    {/* Botón Imprimir Biografía & Foto (abre la previsualización de impresión) */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleOpenPrintPreview}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#003876] hover:bg-blue-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                        title="Abrir previsualización de impresión de todo el contenido biográfico y foto"
                      >
                        <Printer className="w-4 h-4 text-amber-300" />
                        <span>Imprimir Biografía & Foto</span>
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
                onClick={handleOpenPrintPreview}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                title="Abrir previsualización de impresión"
              >
                <Printer className="w-3.5 h-3.5 text-[#003876]" />
                <span>Imprimir Expediente</span>
              </button>

              <button
                onClick={() => setIsDirectorModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
