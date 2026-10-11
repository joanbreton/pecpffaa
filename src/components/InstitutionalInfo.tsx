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
    <section id="institucion" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Subtle Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #B91C1C 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-16">
        
        {/* Top Header with Official Seal */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-2xl border-4 border-[#0D3671] ring-4 ring-amber-400/30">
              <img 
                src={officialLogo} 
                alt="Emblema Oficial Gran General Restaurador Gregorio Luperón"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider border border-white/10">
            <Building2 className="w-3.5 h-3.5" />
            {institutionalData.badgeTag || 'Naturaleza Institucional'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
            {institutionalData.mainTitle}
          </h2>
          {institutionalData.subtitle && (
            <p className="text-xs sm:text-sm font-semibold text-amber-300 tracking-wider uppercase">
              {institutionalData.subtitle}
            </p>
          )}
          <div className="w-20 h-1 bg-[#B91C1C] mx-auto rounded-full"></div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {institutionalData.description}
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700 hover:border-[#0D3671] transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#0D3671] text-white flex items-center justify-center shadow-lg border border-white/20">
              <Target className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif">{institutionalData.missionTitle}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {institutionalData.missionText}
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700 hover:border-[#B91C1C] transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#B91C1C] text-white flex items-center justify-center shadow-lg border border-white/20">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif">{institutionalData.visionTitle}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {institutionalData.visionText}
            </p>
          </div>
        </div>

        {/* Core Doctrinal Values */}
        {values.length > 0 && (
          <div className="space-y-6 pt-2">
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-200 font-serif">
                {institutionalData.valuesTitle || 'Pilares Doctrinales y Valores Institucionales'}
              </h3>
              {institutionalData.valuesSubtitle && (
                <p className="text-xs text-slate-400 mt-1">{institutionalData.valuesSubtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((val, idx) => {
                const Icon = getIcon(val.iconName, Shield);
                return (
                  <div 
                    key={idx}
                    className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/80 hover:border-amber-400/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#0D3671] text-amber-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-sm text-white mb-1.5">{val.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{val.desc}</p>
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
              <h3 className="text-xl font-bold text-slate-200 font-serif">
                {institutionalData.branchesTitle || 'Integración Doctrinal Conjunta'}
              </h3>
              {institutionalData.branchesSubtitle && (
                <p className="text-xs text-slate-400 mt-1">{institutionalData.branchesSubtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {branches.map((branch, idx) => {
                const Icon = getIcon(branch.iconName, Shield);
                const colorClass = branch.color || (
                  idx === 0 ? 'border-emerald-700 bg-emerald-900/40 text-emerald-300' :
                  idx === 1 ? 'border-blue-700 bg-blue-900/40 text-blue-300' :
                  'border-cyan-700 bg-cyan-900/40 text-cyan-300'
                );

                return (
                  <div 
                    key={idx}
                    className={`rounded-xl p-5 border backdrop-blur-sm ${colorClass} transition-transform hover:-translate-y-1`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-black/40">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-white">{branch.name}</h4>
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
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
          <div className="bg-[#0D3671] rounded-2xl p-8 border-2 border-[#B91C1C] shadow-2xl">
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
