import React from 'react';
import officialLogo from '../assets/images/programalogo.jpg';
import { useApp } from '../context/AppContext';
import { 
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
  LucideIcon
} from 'lucide-react';

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

export const InstitutionalInfo: React.FC = () => {
  const { institutionalData } = useApp();

  const getIcon = (name?: string, fallback: LucideIcon = Shield) => {
    if (!name) return fallback;
    return ICON_MAP[name] || fallback;
  };

  const values = institutionalData?.values || [];
  const stats = institutionalData?.stats || [];
  const branches = institutionalData?.branches || [];

  return (
    <section id="institucion" className="py-16 sm:py-24 bg-[#F8FAFC] text-[#0F172B] relative overflow-hidden">
      
      {/* Subtle Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0D3671 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-16">
        
        {/* Top Header with Official Seal */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-xl border-4 border-[#0D3671] ring-4 ring-[#0D3671]/10">
              <img 
                src={officialLogo} 
                alt="Emblema Oficial Gran General Restaurador Gregorio Luperón"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0D3671]/10 text-[#0D3671] text-xs font-bold uppercase tracking-wider border border-[#0D3671]/20 font-sans">
            <Building2 className="w-3.5 h-3.5" />
            {institutionalData.badgeTag || 'Naturaleza Institucional'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172B] font-serif tracking-tight">
            {institutionalData.mainTitle}
          </h2>
          {institutionalData.subtitle && (
            <p className="text-xs sm:text-sm font-bold text-[#0D3671] tracking-wider uppercase">
              {institutionalData.subtitle}
            </p>
          )}
          <div className="w-20 h-1 bg-[#B91C1C] mx-auto rounded-full"></div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            {institutionalData.description}
          </p>
        </div>

        {/* Mission, Vision, Values & Objective Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Misión */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#0D3671] transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#0D3671] text-white flex items-center justify-center shadow-md">
              <Target className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172B] font-serif">{institutionalData.missionTitle || 'Misión Institucional'}</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {institutionalData.missionText}
            </p>
          </div>

          {/* Visión */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#B91C1C] transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#B91C1C] text-white flex items-center justify-center shadow-md">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172B] font-serif">{institutionalData.visionTitle || 'Visión Prospectiva'}</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {institutionalData.visionText}
            </p>
          </div>

          {/* Valores */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-amber-500 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center shadow-md">
              <Award className="w-6 h-6 text-slate-900" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172B] font-serif">{institutionalData.valuesTextTitle || 'Valores'}</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {institutionalData.valuesText || 'El PECPFFAA fomenta en su personal y en los Estudiantes beneficiados de los programas los valores mostrados previamente.'}
            </p>
          </div>

          {/* Objetivo */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-emerald-600 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#0F172B] font-serif">{institutionalData.objectiveTitle || 'Objetivo'}</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {institutionalData.objectiveText || 'Otorgar diferentes facilidades educativas, para la capacitación y profesionalización de los Miembros de las Fuerzas Armadas activos, en la honrosa condición de retiro y sus familiares directos, en distintas universidades, institutos y colegios.'}
            </p>
          </div>
        </div>

        {/* Core Doctrinal Values */}
        {values.length > 0 && (
          <div className="space-y-6 pt-2">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172B] font-serif">
                {institutionalData.valuesTitle || 'Pilares Doctrinales y Valores Institucionales'}
              </h3>
              {institutionalData.valuesSubtitle && (
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{institutionalData.valuesSubtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((val, idx) => {
                const Icon = getIcon(val.iconName, Shield);
                return (
                  <div 
                    key={idx}
                    className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:border-[#0D3671] hover:shadow-md transition-all group"
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

        {/* Inter-institutional Armed Forces Unity */}
        {branches.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172B] font-serif">
                {institutionalData.branchesTitle || 'Integración Doctrinal Conjunta'}
              </h3>
              {institutionalData.branchesSubtitle && (
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{institutionalData.branchesSubtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    className={`rounded-xl p-5 border ${colorClass} shadow-sm transition-transform hover:-translate-y-1`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-[#0D3671] text-white">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-[#0F172B]">{branch.name}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {branch.role}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Key Numerical Metrics Counter Ribbon */}
        {stats.length > 0 && (
          <div className="bg-[#0D3671] text-white rounded-2xl p-8 border-2 border-[#B91C1C] shadow-2xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              {stats.map((st, idx) => (
                <div key={idx} className="pt-4 lg:pt-0 px-2 space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-mono tracking-tight">
                    {st.number}
                  </div>
                  <div className="text-sm font-bold text-white">{st.label}</div>
                  <div className="text-xs text-slate-300">{st.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
