import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Calendar, 
  User, 
  Eye, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Share2, 
  Download,
  ArrowRight
} from 'lucide-react';

export const ItemModals: React.FC = () => {
  const { 
    selectedNewsModal, 
    setSelectedNewsModal, 
    selectedServiceModal, 
    setSelectedServiceModal,
    showNotification
  } = useApp();

  return (
    <>
      {/* News Reader Modal */}
      {selectedNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            {/* Image Header */}
            <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-slate-900">
              <img
                src={selectedNewsModal.image}
                alt={selectedNewsModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              
              <button
                onClick={() => setSelectedNewsModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-[#B91C1C] text-white text-xs font-bold px-3 py-1 rounded shadow uppercase tracking-wider inline-block mb-2">
                  {selectedNewsModal.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-serif leading-tight">
                  {selectedNewsModal.title}
                </h3>
              </div>
            </div>

            {/* Content & Metadata */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Meta bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <User className="w-3.5 h-3.5 text-[#0D3671]" />
                    {selectedNewsModal.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B91C1C]" />
                    {selectedNewsModal.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded text-slate-600">
                    <Eye className="w-3.5 h-3.5" />
                    {selectedNewsModal.views} vistas
                  </span>
                  <button
                    onClick={() => showNotification('Enlace copiado al portapapeles', 'info')}
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                    title="Compartir noticia"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Excerpt Lead */}
              <p className="text-base font-semibold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border-l-4 border-[#0D3671]">
                {selectedNewsModal.excerpt}
              </p>

              {/* Main text */}
              <div className="text-sm text-slate-700 leading-relaxed space-y-4">
                <p>{selectedNewsModal.content}</p>
                <p>
                  El Programa de Educación y Capacitación Profesional de las FF.AA. (PECPFFAA) reitera su compromiso institucional con la formación del pensamiento militar moderno, la investigación prospectiva y el fortalecimiento de la defensa y soberanía de la República Dominicana.
                </p>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => setSelectedNewsModal(null)}
                  className="px-6 py-2.5 bg-[#0D3671] text-white rounded-lg font-bold text-xs hover:bg-[#092652] transition-colors"
                >
                  Cerrar Artículo
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Academic Program Syllabus Modal */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            
            {/* Header in #0D3671 */}
            <div className="bg-[#0D3671] text-white p-6 relative">
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#B91C1C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded shadow">
                  {selectedServiceModal.category}
                </span>
                <span className="text-amber-300 font-mono text-xs font-bold">
                  Código: {selectedServiceModal.code}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-serif leading-tight">
                {selectedServiceModal.title}
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm">
              
              {/* Program Overview */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#0D3671]" />
                  Descripción del Programa
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {selectedServiceModal.description}
                </p>
              </div>

              {/* Fast Facts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="block text-[11px] text-slate-500 font-bold uppercase">Duración</span>
                  <span className="font-semibold text-slate-800">{selectedServiceModal.duration}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-bold uppercase">Modalidad</span>
                  <span className="font-semibold text-[#0D3671]">{selectedServiceModal.modality}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-bold uppercase">Dirigido A</span>
                  <span className="font-semibold text-slate-800">{selectedServiceModal.targetAudience}</span>
                </div>
              </div>

              {/* Modules / Plan de Estudios */}
              {selectedServiceModal.modules && selectedServiceModal.modules.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#B91C1C]" />
                    Ejes Doctrinales & Módulos Clave
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedServiceModal.modules.map((mod, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium text-xs">{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {selectedServiceModal.requirements && selectedServiceModal.requirements.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Requisitos de Postulación</h4>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-600 text-xs">
                    {selectedServiceModal.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => showNotification('Descargando pensum académico oficial en PDF...', 'info')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Pensum en PDF</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedServiceModal(null)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    Cerrar
                  </button>
                  <a
                    href="#contacto"
                    onClick={() => setSelectedServiceModal(null)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-[#B91C1C] hover:bg-red-700 text-white text-xs font-bold shadow transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Iniciar Admisión</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
