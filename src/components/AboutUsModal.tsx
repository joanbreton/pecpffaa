import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import officialLogo from '../assets/images/programalogo.jpg';
import { 
  X, 
  Shield, 
  Award, 
  Target, 
  Eye, 
  Compass, 
  Anchor, 
  Plane, 
  BookOpenCheck,
  Building2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Users,
  Flag
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpenCheck,
  Shield,
  Compass,
  Award,
  Anchor,
  Plane,
  Target,
  Eye,
  Building2,
  GraduationCap,
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
  CheckCircle2
};

export const AboutUsModal: React.FC = () => {
  const { 
    isAboutModalOpen, 
    setIsAboutModalOpen, 
    institutionalData, 
    currentUser, 
    setActiveView, 
    setDashboardTab,
    showNotification 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'todos' | 'identidad' | 'doctrina' | 'fuerzas'>('todos');

  const isAdmin = currentUser?.role === 'Administrador';

  // Manejo de tecla ESC y bloqueo del scroll de fondo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAboutModalOpen(false);
      }
    };
    if (isAboutModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isAboutModalOpen, setIsAboutModalOpen]);

  if (!isAboutModalOpen) return null;

  const getIcon = (name?: string, fallback: LucideIcon = Shield) => {
    if (!name) return fallback;
    return ICON_MAP[name] || fallback;
  };

  const values = institutionalData?.values || [];
  const branches = institutionalData?.branches || [];

  const handleGoToCMS = () => {
    setIsAboutModalOpen(false);
    setActiveView('dashboard');
    if (setDashboardTab) {
      setDashboardTab('institutional');
    }
    showNotification('Accediendo al CMS de Quiénes Somos', 'info');
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-8 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      {/* Click Outside Backdrop */}
      <div 
        className="fixed inset-0 cursor-pointer" 
        onClick={() => setIsAboutModalOpen(false)}
        aria-hidden="true"
      />

      {/* Main Modal Card Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[92vh] z-10 transition-all">
        
        {/* Top Header Bar with Institutional Branding */}
        <div className="bg-[#0D3671] text-white px-5 sm:px-8 py-5 border-b-4 border-[#B91C1C] flex items-center justify-between gap-4 sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-1 shrink-0 shadow-lg border-2 border-amber-300 ring-2 ring-white/20">
              <img 
                src={officialLogo} 
                alt="Emblema PECPFFAA" 
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-white/15">
                <Shield className="w-3 h-3" />
                <span>{institutionalData.badgeTag || 'Quiénes Somos'}</span>
              </div>
              <h2 id="about-modal-title" className="text-base sm:text-xl font-black text-white font-serif tracking-tight truncate mt-0.5">
                {institutionalData.mainTitle}
              </h2>
              {institutionalData.subtitle && (
                <p className="text-[11px] sm:text-xs text-slate-200 font-medium truncate">
                  {institutionalData.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <button
                onClick={handleGoToCMS}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer"
                title="Editar esta información en el CMS"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar CMS</span>
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsAboutModalOpen(false)}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#B91C1C] text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Filter */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-5 sm:px-8 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'todos', label: 'Vista General', icon: Building2 },
            { id: 'identidad', label: 'Misión & Visión', icon: Target },
            { id: 'doctrina', label: 'Pilares Doctrinales', icon: BookOpenCheck },
            { id: 'fuerzas', label: 'Integración FF.AA.', icon: Flag }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#0D3671] text-white shadow-xs' 
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-10 text-slate-800">
          
          {/* Institutional Overview / Synopsis */}
          {(activeTab === 'todos' || activeTab === 'identidad') && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 rounded-2xl p-6 sm:p-8 border border-blue-200/70 shadow-sm relative overflow-hidden">
                <div className="max-w-3xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D3671]/10 text-[#0D3671] font-bold text-xs uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{institutionalData.overviewTitle || 'Naturaleza & Mandato Rector'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0F172B] font-serif tracking-tight">
                    {institutionalData.mainTitle}
                  </h3>
                  <div className="w-16 h-1 bg-[#B91C1C] rounded-full" />
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    {institutionalData.description}
                  </p>
                </div>
              </div>

              {/* Core 4 Cards: Misión, Visión, Valores, Objetivo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Misión */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-[#0D3671] transition-all space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0D3671] text-white flex items-center justify-center shadow-md shrink-0">
                      <Target className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#0D3671] tracking-wider block">Propósito Central</span>
                      <h4 className="text-base font-bold text-[#0F172B] font-serif">{institutionalData.missionTitle || 'Misión Institucional'}</h4>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {institutionalData.missionText}
                  </p>
                </div>

                {/* Visión */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-[#B91C1C] transition-all space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#B91C1C] text-white flex items-center justify-center shadow-md shrink-0">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#B91C1C] tracking-wider block">Futuro & Proyección</span>
                      <h4 className="text-base font-bold text-[#0F172B] font-serif">{institutionalData.visionTitle || 'Visión Prospectiva'}</h4>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {institutionalData.visionText}
                  </p>
                </div>

                {/* Valores */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-amber-500 transition-all space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shrink-0">
                      <Award className="w-5 h-5 text-slate-950" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-amber-700 tracking-wider block">Ética y Conducta</span>
                      <h4 className="text-base font-bold text-[#0F172B] font-serif">{institutionalData.valuesTextTitle || 'Valores'}</h4>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {institutionalData.valuesText || 'El PECPFFAA fomenta en su personal y en los Estudiantes beneficiados de los programas los valores mostrados previamente.'}
                  </p>
                </div>

                {/* Objetivo */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-emerald-600 transition-all space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider block">Capacitación y Becas</span>
                      <h4 className="text-base font-bold text-[#0F172B] font-serif">{institutionalData.objectiveTitle || 'Objetivo'}</h4>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {institutionalData.objectiveText || 'Otorgar diferentes facilidades educativas, para la capacitación y profesionalización de los Miembros de las Fuerzas Armadas activos, en la honrosa condición de retiro y sus familiares directos.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Doctrinal Values Pillars */}
          {(activeTab === 'todos' || activeTab === 'doctrina') && values.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#0F172B] font-serif">
                    {institutionalData.valuesTitle || 'Pilares Doctrinales y Valores Institucionales'}
                  </h3>
                  {institutionalData.valuesSubtitle && (
                    <p className="text-xs text-slate-500 font-medium">{institutionalData.valuesSubtitle}</p>
                  )}
                </div>
                <span className="text-[11px] font-bold text-[#0D3671] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 shrink-0 self-start sm:self-auto">
                  {values.length} Pilares Fundamentales
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {values.map((val, idx) => {
                  const Icon = getIcon(val.iconName, Shield);
                  return (
                    <div 
                      key={idx}
                      className="bg-slate-50/70 hover:bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-[#0D3671] hover:shadow-md transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#0D3671] text-amber-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-[#0F172B] mb-1.5">{val.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Armed Forces Integration */}
          {(activeTab === 'todos' || activeTab === 'fuerzas') && branches.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-slate-200/80">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#0F172B] font-serif">
                  {institutionalData.branchesTitle || 'Integración Doctrinal Conjunta'}
                </h3>
                {institutionalData.branchesSubtitle && (
                  <p className="text-xs text-slate-500 font-medium">{institutionalData.branchesSubtitle}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {branches.map((branch, idx) => {
                  const Icon = getIcon(branch.iconName, Shield);
                  const colorClass = idx === 0 
                    ? 'border-emerald-200 bg-emerald-50/80 text-emerald-950' 
                    : idx === 1 
                    ? 'border-blue-200 bg-blue-50/80 text-blue-950' 
                    : 'border-sky-200 bg-sky-50/80 text-sky-950';

                  return (
                    <div 
                      key={idx}
                      className={`rounded-2xl p-5 border ${colorClass} shadow-xs transition-transform hover:-translate-y-1`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-[#0D3671] text-amber-300 shadow">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#0F172B]">{branch.name}</h4>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 mt-2.5 leading-relaxed font-normal">
                        {branch.role}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}



        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-100 px-5 sm:px-8 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Shield className="w-4 h-4 text-[#0D3671] shrink-0" />
            <span>Documento Oficial de Naturaleza Institucional • PECPFFAA Gran General Restaurador Gregorio Luperón</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAboutModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 transition-colors cursor-pointer"
            >
              Cerrar Ventana
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
