import React from 'react';
import officialLogo from '../assets/images/programalogo.jpg';
import { 
  Shield, 
  Award, 
  Target, 
  Eye, 
  Compass, 
  Anchor, 
  Plane, 
  BookOpenCheck,
  Building2
} from 'lucide-react';

export const InstitutionalInfo: React.FC = () => {
  const values = [
    { title: 'Ciencia & Doctrina', desc: 'Investigación continua para la actualización de tácticas y doctrinas conjuntas.', icon: BookOpenCheck },
    { title: 'Honor Militar', desc: 'Fidelidad inquebrantable a los valores patrios y a la Constitución de la República.', icon: Shield },
    { title: 'Interoperabilidad', desc: 'Sinergia operativa entre las fuerzas de tierra, mar, aire y ciberespacio.', icon: Compass },
    { title: 'Liderazgo Estratégico', desc: 'Capacitación para la toma de decisiones complejas en escenarios de crisis.', icon: Award },
  ];

  const stats = [
    { number: '+3,850', label: 'Oficiales & Civiles Graduados', sub: 'En programas de posgrado' },
    { number: '28+', label: 'Años de Doctrina Conjunta', sub: 'Tradición y excelencia' },
    { number: '16', label: 'Convenios Hemisféricos', sub: 'Con escuelas de defensa' },
    { number: '100%', label: 'Acreditación Oficial', sub: 'Por el Ministerio de Educación' },
  ];

  const branches = [
    {
      name: 'Ejército de República Dominicana',
      role: 'Comando de Operaciones Terrestres y Seguridad Fronteriza',
      icon: Shield,
      color: 'border-emerald-700 bg-emerald-900/40 text-emerald-300'
    },
    {
      name: 'Armada de República Dominicana',
      role: 'Seguridad Marítima, Defensa de Costas y Espacio Fluvial',
      icon: Anchor,
      color: 'border-blue-700 bg-blue-900/40 text-blue-300'
    },
    {
      name: 'Fuerza Aérea de República Dominicana',
      role: 'Soberanía del Espacio Aéreo y Apoyo Táctico',
      icon: Plane,
      color: 'border-cyan-700 bg-cyan-900/40 text-cyan-300'
    }
  ];

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
            Naturaleza Institucional
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
            Programa de Educación y Capacitación Profesional de las FF.AA.
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-amber-300 tracking-wider uppercase">
            Gran General Restaurador "Gregorio Luperón"
          </p>
          <div className="w-20 h-1 bg-[#B91C1C] mx-auto rounded-full"></div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Órgano académico rector encargado de formar y capacitar a los miembros de las Fuerzas Armadas y sector civil afín en doctrina militar, liderazgo estratégico y seguridad nacional.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700 hover:border-[#0D3671] transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#0D3671] text-white flex items-center justify-center shadow-lg border border-white/20">
              <Target className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif">Misión Institucional</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Formar y capacitar a los miembros de las Fuerzas Armadas, Policía Nacional y sector civil afín en doctrina militar conjunta, toma de decisiones estratégicas, seguridad y defensa nacional, con apego a los principios éticos y democráticos.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700 hover:border-[#B91C1C] transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#B91C1C] text-white flex items-center justify-center shadow-lg border border-white/20">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif">Visión Prospectiva</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Ser el centro de excelencia académica militar de referencia regional y hemisférica, reconocido por la vanguardia en investigación doctrinal, innovación tecnológica en ciberdefensa y sólida formación en liderazgo estratégico.
            </p>
          </div>
        </div>

        {/* Core Doctrinal Values */}
        <div className="space-y-6 pt-2">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-200 font-serif">Pilares Doctrinales y Valores Institucionales</h3>
            <p className="text-xs text-slate-400 mt-1">Principios rectores que guían la enseñanza superior militar y la toma de decisiones estratégicas</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val, idx) => {
              const Icon = val.icon;
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

        {/* Inter-institutional Armed Forces Unity */}
        <div className="space-y-6 pt-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-200 font-serif">Integración Doctrinal Conjunta</h3>
            <p className="text-xs text-slate-400 mt-1">Convergencia de las tres ramas de las Fuerzas Armadas en un solo cuerpo de pensamiento</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map((branch, idx) => {
              const Icon = branch.icon;
              return (
                <div 
                  key={idx}
                  className={`rounded-xl p-5 border backdrop-blur-sm ${branch.color} transition-transform hover:-translate-y-1`}
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

        {/* Key Numerical Metrics Counter Ribbon */}
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

      </div>
    </section>
  );
};
