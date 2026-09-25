import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceItem } from '../types';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  ChevronRight, 
  Search, 
  Shield, 
  Compass, 
  Cpu, 
  AlertTriangle, 
  GraduationCap 
} from 'lucide-react';

export const AcademicOffer: React.FC = () => {
  const { services, setSelectedServiceModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['Todos', 'Maestría', 'Especialidad', 'Diplomado', 'Curso Superior'];

  const filteredServices = services.filter((srv) => {
    const matchesCat = selectedCategory === 'Todos' || srv.category === selectedCategory;
    const matchesSearch = srv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          srv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          srv.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getIcon = (name: string) => {
    switch (name) {
      case 'Shield': return <Shield className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5" />;
      default: return <GraduationCap className="w-5 h-5" />;
    }
  };

  const getModalityBadge = (modality: ServiceItem['modality']) => {
    switch (modality) {
      case 'Presencial':
        return <span className="bg-slate-100 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-300">Presencial</span>;
      case 'Semipresencial':
        return <span className="bg-blue-50 text-[#0D3671] text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-200">Semipresencial</span>;
      case 'Virtual':
        return <span className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-200">100% Virtual</span>;
    }
  };

  return (
    <section id="servicios" className="py-16 sm:py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header with Military Styling and Red Line Accent */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D3671]/10 text-[#0D3671] font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-[#B91C1C]" />
            Oferta Académica de Posgrado y Altos Estudios
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            Programas y Servicios Educativos
          </h2>
          <div className="w-20 h-1 bg-[#B91C1C] mx-auto rounded-full"></div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Formación de alto nivel orientada al planeamiento operacional, liderazgo estratégico y doctrina de defensa integral.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-200">
          
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0D3671] text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar programa o código..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0D3671] focus:border-transparent bg-slate-50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Services / Programs Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No se encontraron programas</h3>
            <p className="text-xs text-slate-500 mt-1">Pruebe ajustando los filtros o el término de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 hover:border-[#0D3671]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Image & Badge Header */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                    
                    {/* Top Bar over image */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="bg-[#B91C1C] text-white text-[11px] font-extrabold px-2.5 py-1 rounded shadow uppercase tracking-wider">
                        {service.category}
                      </span>
                      <span className="font-mono text-xs bg-slate-900/80 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded border border-white/20">
                        {service.code}
                      </span>
                    </div>

                    {/* Modality Tag & Icon */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#0D3671] text-white flex items-center justify-center shadow-lg border border-white/20">
                        {getIcon(service.iconName)}
                      </div>
                      {getModalityBadge(service.modality)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#0D3671] transition-colors leading-snug">
                      {service.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    {/* Metadata summary (Duration & Audience) */}
                    <div className="pt-2 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#B91C1C]" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#0D3671]" />
                        <span className="truncate">Para Oficiales y Civiles</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 sm:px-6 pb-5 pt-0 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedServiceModal(service)}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-[#0D3671] hover:bg-[#092652] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Ver Plan de Estudio</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  
                  <a
                    href="#contacto"
                    className="py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-[#B91C1C] hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center"
                    title="Solicitar información de este programa"
                  >
                    Admisión
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
