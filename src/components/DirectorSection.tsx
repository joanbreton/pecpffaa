import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Shield, 
  Award, 
  FileText, 
  Edit3 
} from 'lucide-react';

export const DirectorSection: React.FC = () => {
  const { 
    directorData, 
    setIsDirectorModalOpen, 
    currentUser, 
    setActiveView 
  } = useApp();

  const isAdmin = currentUser?.role === 'Administrador';

  // Helper to cleanly parse director name and military rank
  const parseDirectorNameAndRank = () => {
    const rawName = (directorData?.name || 'Ambiorix de Jesús Cepeda Hernández').trim();
    const explicitRank = (directorData?.rank || '').trim();

    if (explicitRank) {
      let cleanName = rawName;
      if (cleanName.includes(explicitRank)) {
        cleanName = cleanName.replace(new RegExp(`,?\\s*${explicitRank.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'), '').trim();
      }
      return {
        name: cleanName || rawName,
        rank: explicitRank
      };
    }

    if (rawName.includes(',')) {
      const parts = rawName.split(',');
      return {
        name: parts[0].trim(),
        rank: parts.slice(1).join(',').trim() || 'General de Brigada, ERD.'
      };
    }

    return {
      name: rawName,
      rank: 'General de Brigada, ERD.'
    };
  };

  const { name: directorName, rank: directorRank } = parseDirectorNameAndRank();
  const photo = directorData?.photoUrl || 'https://i.postimg.cc/V6vqjfQf/director-pecpffaa.jpg';

  const badgeText = directorData?.sectionBadge || 'Liderazgo Institucional';
  const sectionTitle = directorData?.sectionTitle || 'NUESTRO DIRECTOR';
  const sectionSubtitle = directorData?.sectionSubtitle || 'Despacho de la Dirección General • PECPFFAA';
  const summaryText = directorData?.sectionSummary || directorData?.bioSummary || 
    'El General de Brigada Ambiorix de Jesús Cepeda Hernández lidera con honor y visión estratégica el Programa de Educación y Capacitación Profesional de las Fuerzas Armadas (PECPFFAA), impulsando la modernización académica, la excelencia operativa y la formación integral de los hombres y mujeres que engrandecen a la Patria.';

  const handleEditInCMS = () => {
    setActiveView('dashboard');
  };

  return (
    <section 
      id="director" 
      className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900 relative overflow-hidden border-b border-slate-200"
    >
      {/* Background Architectural Watermark Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #0D3671 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Decorative ambient gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        
        {/* Section Header: Autoridad, Dignidad & Título Institucional */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D3671]/10 text-[#0D3671] text-xs font-extrabold uppercase tracking-widest border border-[#0D3671]/20">
            <Building2 className="w-3.5 h-3.5 text-[#0D3671]" />
            <span>{badgeText}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172B] font-serif tracking-tight">
            {sectionTitle}
          </h2>

          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="w-10 h-1 bg-[#0D3671] rounded-full" />
            <div className="w-16 h-1.5 bg-[#B91C1C] rounded-full" />
            <div className="w-10 h-1 bg-[#0D3671] rounded-full" />
          </div>

          <p className="text-xs sm:text-sm font-bold text-[#0D3671] tracking-wider uppercase font-sans">
            {sectionSubtitle}
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden transition-all hover:shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Column (5/12): Portrait & Identity */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-[#0B2545] to-[#06182E] text-white p-6 sm:p-8 md:p-10 flex flex-col justify-center items-center relative overflow-hidden">
              
              {/* Subtle Dominican Flag Accent Strip on Top */}
              <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                <div className="flex-1 bg-[#0D3671]" />
                <div className="w-12 bg-white" />
                <div className="flex-1 bg-[#B91C1C]" />
              </div>

              {/* Background ambient shine */}
              <div className="absolute top-10 right-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6 relative z-10 w-full max-w-[340px]">
                
                {/* Director Official Photograph Frame */}
                <div 
                  onClick={() => setIsDirectorModalOpen(true)}
                  className="relative mx-auto max-w-[320px] sm:max-w-[340px] cursor-pointer group"
                  title="Haga clic para ver la semblanza oficial del Director"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 ring-4 ring-[#0D3671]/40 aspect-[4/5] sm:aspect-square bg-slate-800">
                    <img 
                      src={photo} 
                      alt={`Fotografía oficial de ${directorName}`}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://i.postimg.cc/V6vqjfQf/director-pecpffaa.jpg';
                      }}
                    />
                  </div>

                  {/* Insignia / Shield Floating Badge */}
                  <div className="absolute -top-3 -right-3 w-11 h-11 rounded-full bg-[#B91C1C] border-2 border-white shadow-lg flex items-center justify-center text-white">
                    <Shield className="w-5 h-5 text-amber-300" />
                  </div>
                </div>

                {/* Button to open official bio & dossier */}
                <button
                  type="button"
                  onClick={() => setIsDirectorModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/20"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ver Semblanza Oficial</span>
                </button>

              </div>

            </div>

            {/* Right Column (7/12): Leadership & Trajectory Presentation */}
            <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between space-y-6 bg-white">
              
              <div className="space-y-6">
                
                {/* Header Rank Pill & Title */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#0D3671]/10 text-[#0D3671] border border-[#0D3671]/20 font-sans">
                      <Shield className="w-3.5 h-3.5 text-[#B91C1C]" />
                      {directorRank}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200">
                      <Award className="w-3 h-3 text-amber-500" />
                      {directorData?.institution || 'PECPFFAA / MIDE'}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 font-serif leading-tight">
                    {directorName}
                  </h3>

                  <p className="text-sm sm:text-base font-bold text-[#0D3671]">
                    {directorData?.title || 'Director General del PECPFFAA'}
                  </p>
                </div>

                {/* Main Text Content / Summary */}
                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <p className="font-medium text-slate-800 text-sm sm:text-base leading-relaxed">
                    {summaryText}
                  </p>
                </div>

              </div>

              {/* Bottom Admin Shortcut */}
              {isAdmin && (
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleEditInCMS}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-colors cursor-pointer"
                    title="Editar textos e imagen de esta sección en el CMS"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Administrar en CMS</span>
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
