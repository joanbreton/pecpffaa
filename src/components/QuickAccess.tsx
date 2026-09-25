import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Laptop, 
  Calendar 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickAccess: React.FC = () => {
  const { showNotification } = useApp();

  const accessItems = [
    {
      icon: GraduationCap,
      title: 'Admisiones 2026-II',
      desc: 'Requisitos, calendario y formulario de ingreso para oficiales y civiles.',
      tag: 'Convocatoria Abierta',
      color: 'border-red-600/30 text-[#B91C1C]',
      badgeBg: 'bg-red-50 text-[#B91C1C]',
      actionText: 'Postularse',
      href: '#admisiones'
    },
    {
      icon: Laptop,
      title: 'Campus Virtual Moodle',
      desc: 'Acceso a aulas digitales, foros de doctrina y evaluaciones en línea.',
      tag: 'Plataforma 24/7',
      color: 'border-blue-600/30 text-[#0D3671]',
      badgeBg: 'bg-blue-50 text-[#0D3671]',
      actionText: 'Ingresar al Campus',
      actionAlert: 'Accediendo al entorno de aprendizaje virtual del PECPFFAA'
    },
    {
      icon: BookOpen,
      title: 'Biblioteca Militar Digital',
      desc: 'Repositorio doctrinal, revistas científicas, manuales y tesis de grado.',
      tag: '+5,000 Recursos',
      color: 'border-amber-600/30 text-amber-700',
      badgeBg: 'bg-amber-50 text-amber-800',
      actionText: 'Consultar Catálogo',
      actionAlert: 'Abriendo el catálogo bibliográfico de defensa y seguridad'
    },
    {
      icon: Calendar,
      title: 'Calendario Académico',
      desc: 'Cronograma oficial de conferencias magistrales, trimestres y graduación.',
      tag: 'Periodo 2026-2027',
      color: 'border-emerald-600/30 text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-800',
      actionText: 'Ver Fechas Clave',
      actionAlert: 'Calendario académico institucional descargable'
    }
  ];

  const handleClick = (item: typeof accessItems[0]) => {
    if (item.href) {
      const el = document.querySelector(item.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (item.actionAlert) {
      showNotification(item.actionAlert, 'info');
    }
  };

  return (
    <section className="relative z-30 -mt-4 sm:-mt-6 lg:-mt-12 max-w-7xl mx-auto px-4 sm:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {accessItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => handleClick(item)}
              className="bg-white rounded-xl p-5 shadow-lg hover:shadow-2xl border border-slate-200 hover:border-[#0D3671]/40 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-[#0D3671] group-hover:text-white transition-colors duration-200 text-[#0D3671]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeBg}`}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0D3671] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0D3671] group-hover:text-[#B91C1C]">
                <span>{item.actionText}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
