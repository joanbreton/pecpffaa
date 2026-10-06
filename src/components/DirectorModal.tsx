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
  FileText, 
  Send, 
  CheckCircle2, 
  Star,
  Quote,
  ChevronRight,
  GraduationCap,
  Calendar,
  MapPin,
  Clock,
  Printer,
  Scale,
  Briefcase,
  UserCheck,
  ExternalLink
} from 'lucide-react';
import officialLogo from '../assets/images/programalogo.jpg';

export const DirectorModal: React.FC = () => {
  const { isDirectorModalOpen, setIsDirectorModalOpen, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState<'biografia' | 'mensaje' | 'funciones' | 'marco-legal' | 'contacto'>('biografia');

  // URL oficial provista por el usuario para la foto en proporción 9:16
  const DIRECTOR_PHOTO_URL = 'https://i.postimg.cc/V6vqjfQf/director-pecpffaa.jpg';

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
                Despacho del Director General
              </h2>
            </div>
          </div>

          {/* Botón de Cierre */}
          <button
            onClick={() => setIsDirectorModalOpen(false)}
            aria-label="Cerrar ventana"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:rotate-90 duration-200 cursor-pointer border border-white/20 shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
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
                Ministerio de Defensa de la República Dominicana • Programa de Educación y Capacitación Profesional de las FF.AA.
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
                      Semblanza Oficial
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#003876] font-sans mt-0.5">
                      Mayor General, ERD
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600">
                      Director General del PECPFFAA • Fuerzas Armadas de la República Dominicana
                    </p>
                  </div>

                  {/* Columna de Párrafos Biográficos */}
                  <div className="space-y-3.5 text-sm sm:text-[15px] leading-relaxed text-slate-700 text-justify">
                    <p>
                      El <strong>Director General del Programa de Educación y Capacitación Profesional de las Fuerzas Armadas (PECPFFAA)</strong> cuenta con una dilatada y distinguida trayectoria militar, académica e institucional de más de 28 años al servicio de la República Dominicana, caracterizada por su consagración a la defensa nacional, la docencia superior y la excelencia operativa.
                    </p>

                    <p>
                      Egresado con honores de la Academia Militar Batalla de las Carreras, ha desempeñado funciones neurálgicas en el Estado Mayor Conjunto del Ministerio de Defensa (MIDE), en el Comando de Operaciones Especiales y en la dirección de planes tácticos y formativos de las escuelas de graduados de las Fuerzas Armadas.
                    </p>

                    <p>
                      Bajo su liderazgo directivo en el PECPFFAA, ha impulsado la modernización curricular hacia estándares de acreditación internacional, incorporando metodologías de aprendizaje por competencias, simuladores avanzados y laboratorios de ciberseguridad, inteligencia estratégica y gestión del riesgo ante desastres naturales.
                    </p>
                  </div>

                  {/* Formación Académica & Credenciales (Estilo Fichas OGTIC) */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#003876] flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#CE1126]" />
                      Formación Académica y Especializaciones
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 block">Maestría en Seguridad y Defensa</span>
                          <span className="text-slate-500">Instituto Superior para la Defensa (INSUDE)</span>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 block">Comando y Estado Mayor Conjunto</span>
                          <span className="text-slate-500">Escuela de Graduados de Doctrina Conjunta</span>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 block">Licenciatura en Ciencias Militares</span>
                          <span className="text-slate-500">Academia Militar Batalla de las Carreras</span>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start gap-2 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 block">Diplomado en Gestión Estratégica</span>
                          <span className="text-slate-500">Centro de Altos Estudios Estratégicos</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Distinciones & Condecoraciones */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-slate-700">Distinciones Oficiales:</span>
                    <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-600" />
                      Orden al Mérito Militar
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#003876]" />
                      Gran Cruz Placa de Plata
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold">
                      Encomio Especial del MIDE
                    </span>
                  </div>

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
                          Alocución del Director General • Ciclo 2026
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 font-sans leading-snug mt-0.5">
                          "Formar con disciplina, liderar con honor y servir a la Patria con excelencia técnica y moral."
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Párrafos del Mensaje */}
                  <div className="space-y-3.5 text-sm sm:text-[15px] leading-relaxed text-slate-700 text-justify">
                    <p>
                      Distinguidos miembros de las Fuerzas Armadas, respetada comunidad docente, cadetes y conciudadanos:
                    </p>
                    <p>
                      Desde el Despacho de la Dirección General del PECPFFAA, renovamos nuestro compromiso sagrado con la formación integral de los hombres y mujeres que conforman el brazo protector y productivo de la nación dominicana. Guiados por el ejemplo inmortal del <em>Gran General Restaurador Gregorio Luperón</em>, consolidamos un sistema educativo castrense y civil basado en el mérito, la innovación y la rectitud.
                    </p>
                    <p>
                      En este nuevo ciclo académico, reforzamos nuestra oferta formativa con programas de vanguardia en ciberdefensa, logística militar, idiomas, gestión ambiental y tecnología aplicada. La educación es la base fundamental sobre la que se edifica la soberanía y la paz social de nuestro pueblo.
                    </p>
                    <p className="font-semibold text-slate-800">
                      Exhorto a cada cursante y oficial a asumir con pasión este desafío formativo. Las puertas de este Despacho están siempre abiertas al diálogo constructivo, al servicio honesto y al engrandecimiento de la patria dominicana.
                    </p>
                  </div>

                  {/* Bloque de Firma Oficial */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wider text-[#003876]">Mayor General, ERD</p>
                      <p className="text-sm font-bold text-slate-900">Director General del PECPFFAA</p>
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
                      Conforme al Reglamento Orgánico del Ministerio de Defensa y la normativa académica del PECPFFAA.
                    </p>
                  </div>

                  {/* Tarjetas de Funciones (Diseño Clon OGTIC) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {[
                      {
                        num: '01',
                        title: 'Dirección Estratégica',
                        desc: 'Planificar, coordinar y dirigir la ejecución del plan estratégico institucional y el modelo curricular de educación militar y técnica.'
                      },
                      {
                        num: '02',
                        title: 'Rectoría Académica',
                        desc: 'Velar por la pertinencia, calidad docente y actualización constante de los programas de grado, posgrado y formación técnica continua.'
                      },
                      {
                        num: '03',
                        title: 'Representación Oficial',
                        desc: 'Ejercer la representación legal e institucional del PECPFFAA ante el Ministerio de Defensa y organismos nacionales e internacionales.'
                      },
                      {
                        num: '04',
                        title: 'Gestión de Recursos',
                        desc: 'Administrar con estricta transparencia los recursos humanos, tecnológicos y de infraestructura asignados a la labor docente.'
                      },
                      {
                        num: '05',
                        title: 'Innovación y Ciberdefensa',
                        desc: 'Fomentar la adopción de nuevas tecnologías, simuladores avanzados y doctrinas de ciberseguridad en el ámbito de la defensa nacional.'
                      },
                      {
                        num: '06',
                        title: 'Vinculación Social',
                        desc: 'Estrechar la colaboración con las instituciones del Estado, academias aliadas y la sociedad civil para el desarrollo técnico de la nación.'
                      }
                    ].map((f) => (
                      <div key={f.num} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-xs transition-all space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-extrabold text-[#CE1126] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            {f.num}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Atribución</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 pt-1">{f.title}</h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{f.desc}</p>
                      </div>
                    ))}
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
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
                      <Scale className="w-4 h-4 text-[#003876] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">Constitución de la República Dominicana</span>
                        <span className="text-slate-600">Artículos 252 al 254 sobre el régimen, misión y formación de las Fuerzas Armadas de la Nación.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
                      <Scale className="w-4 h-4 text-[#003876] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">Ley Orgánica de las Fuerzas Armadas (Ley No. 139-13)</span>
                        <span className="text-slate-600">Normativa general que rige el sistema educativo militar, jerarquías, deberes y atribuciones castrenses.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
                      <Scale className="w-4 h-4 text-[#003876] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">Decretos de Creación y Estructura Docente</span>
                        <span className="text-slate-600">Disposiciones del Poder Ejecutivo que consolidan el PECPFFAA como órgano formativo de excelencia.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
                      <Scale className="w-4 h-4 text-[#003876] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">Reglamento Interno de Régimen y Docencia PECPFFAA</span>
                        <span className="text-slate-600">Normas disciplinarias, planes de estudio y deberes académicos de cadetes y estudiantes.</span>
                      </div>
                    </div>
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
                        Edificio Principal MIDE, Ave. 27 de Febrero esq. Ave. Gregorio Luperón, Santo Domingo, D.N.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-[#003876]">
                        <Clock className="w-3.5 h-3.5 text-[#CE1126]" />
                        Horario de Atención
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Lunes a Viernes: 8:00 AM – 4:00 PM (Previa Cita o Audiencia Oficial)
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-[#003876]">
                        <Phone className="w-3.5 h-3.5 text-[#CE1126]" />
                        Línea Telefónica Directa
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        (809) 530-5149 • Extensiones: 3899 / 3900 (Secretaría del Despacho)
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs text-[#003876]">
                        <Mail className="w-3.5 h-3.5 text-[#CE1126]" />
                        Correspondencia Electrónica
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        despacho@pecpffaa.edu.do • direccion@pecpffaa.edu.do
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
                Utiliza exactamente: https://i.postimg.cc/V6vqjfQf/director-pecpffaa.jpg
               --------------------------------------------------------------------- */}
            <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2 flex flex-col items-center">
              
              <div className="w-full max-w-[310px] sm:max-w-[330px] bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
                
                {/* Cabecera de la Ficha Fotográfica (Estilo OGTIC) */}
                <div className="bg-[#003876] text-white px-3.5 py-2 text-center border-b-2 border-[#CE1126]">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block">
                    República Dominicana
                  </span>
                  <span className="text-xs font-bold block text-white">
                    Dirección General • PECPFFAA
                  </span>
                </div>

                {/* Marco de Imagen 9:16 con la Foto Solicitada */}
                <div className="p-3 bg-slate-50/70">
                  <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-slate-950 shadow-md group border border-slate-300">
                    
                    {/* Fotografía Oficial con la URL provista por el usuario */}
                    <img
                      src={DIRECTOR_PHOTO_URL}
                      alt="Director General del PECPFFAA"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                      loading="eager"
                      onError={(e) => {
                        // En caso de corte momentáneo de red, respaldo de alta calidad
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
                        Director General
                      </p>
                      <p className="text-xs font-bold text-white leading-tight">
                        Mayor General, ERD
                      </p>
                    </div>

                  </div>
                </div>

                {/* Ficha de Resumen & Datos de Despacho (Clon OGTIC) */}
                <div className="p-3.5 space-y-2.5 text-xs text-slate-700 bg-white">
                  
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500 text-[11px] font-medium">Institución:</span>
                    <span className="font-bold text-[#003876] text-[11px]">PECPFFAA / MIDE</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500 text-[11px] font-medium">Rango:</span>
                    <span className="font-bold text-slate-800 text-[11px]">Mayor General, ERD</span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500 text-[11px] font-medium">Extensión:</span>
                    <span className="font-mono font-bold text-[#CE1126] text-[11px]">Ext. 3899</span>
                  </div>

                  <div className="flex items-center justify-between pb-1">
                    <span className="text-slate-500 text-[11px] font-medium">Correo:</span>
                    <span className="text-slate-700 text-[10px] font-mono font-semibold">despacho@pecpffaa.edu.do</span>
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
              (809) 530-5149 ext. 3899
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-[#CE1126]" />
              despacho@pecpffaa.edu.do
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
