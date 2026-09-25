import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewsItem } from '../types';
import { 
  Calendar, 
  Eye, 
  ArrowRight 
} from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { news, setSelectedNewsModal, incrementNewsViews } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('Todas');

  const categories = ['Todas', 'Doctrina Conjunta', 'Defensa & Seguridad', 'Institucional', 'Graduaciones'];

  const filteredNews = news.filter((item) => {
    if (activeFilter === 'Todas') return true;
    return item.category === activeFilter;
  });

  const handleOpenNews = (item: NewsItem) => {
    incrementNewsViews(item.id);
    setSelectedNewsModal(item);
  };

  const featuredNews = filteredNews.find(n => n.featured) || filteredNews[0];

  return (
    <section id="noticias" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0D3671] border-l-4 border-[#B91C1C] pl-4">
              Actualidad Institucional
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 pl-4">
              Actividades académicas, ceremonias de graduación y convenios de doctrina militar del PECPFFAA.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeFilter === cat
                      ? 'bg-[#0D3671] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <a 
              href="#noticias"
              onClick={(e) => { e.preventDefault(); setActiveFilter('Todas'); }}
              className="text-xs font-bold text-[#B91C1C] uppercase tracking-widest hover:underline shrink-0 hidden sm:inline"
            >
              Ver todas →
            </a>
          </div>
        </div>

        {/* Highlighted Featured Story + News Grid */}
        {filteredNews.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200">
            <h3 className="text-base font-bold text-slate-800">No hay noticias publicadas en esta categoría</h3>
            <p className="text-xs text-slate-500 mt-1">Seleccione "Todas" o publique nuevos comunicados desde el panel administrativo.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Headline Feature (5 cols on lg) */}
          {featuredNews && (
            <div className="lg:col-span-5 flex flex-col">
              <div 
                onClick={() => handleOpenNews(featuredNews)}
                className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 hover:border-[#B91C1C] transition-all duration-300 group cursor-pointer h-full flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={featuredNews.image}
                    alt={featuredNews.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#B91C1C] text-white text-xs font-bold px-3 py-1 rounded-full shadow uppercase tracking-wider">
                      Destacado • {featuredNews.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {featuredNews.date}
                    </span>
                    <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      {featuredNews.views} lecturas
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                      {featuredNews.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {featuredNews.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-bold">
                    <span>Leer Reportaje Completo</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-grid of recent news (7 cols on lg) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredNews
              .filter(n => n.id !== (featuredNews?.id))
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenNews(item)}
                  className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200/90 hover:border-[#0D3671]/40 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-200">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="bg-[#0D3671] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                        {item.category}
                      </span>

                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0D3671] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-0.5">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-1 flex items-center justify-between text-xs font-bold text-[#0D3671] group-hover:text-[#B91C1C]">
                    <span className="text-[11px] text-slate-400 font-normal">{item.date}</span>
                    <span className="group-hover:translate-x-1 transition-transform">Ver más →</span>
                  </div>
                </div>
              ))}
          </div>

        </div>
        )}

      </div>
    </section>
  );
};
