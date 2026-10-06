import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DirectorData, DirectorDegree, DirectorFunction, DirectorLegalItem } from '../types';
import { 
  Building2, 
  Save, 
  RotateCcw, 
  Eye, 
  Image as ImageIcon, 
  UserCheck, 
  Quote, 
  Briefcase, 
  Scale, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Shield,
  GraduationCap,
  Award,
  ExternalLink
} from 'lucide-react';

export const CMSDirectorTab: React.FC = () => {
  const { 
    directorData, 
    updateDirectorData, 
    resetDirectorData, 
    setIsDirectorModalOpen, 
    showNotification,
    firebaseSyncStatus,
    currentUser 
  } = useApp();

  const isAdmin = currentUser?.role === 'Administrador';

  // Sub-tabs for clean editing
  const [activeSection, setActiveSection] = useState<'ficha' | 'biografia' | 'mensaje' | 'funciones' | 'marcoLegal'>('ficha');
  const [isSaving, setIsSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Form local state cloned from directorData
  const [formData, setFormData] = useState<DirectorData>(directorData);

  // Sync form data if remote database updates directorData
  useEffect(() => {
    setFormData(directorData);
  }, [directorData]);

  // Handlers for dynamic lists
  // Academic degrees
  const [newDegreeTitle, setNewDegreeTitle] = useState('');
  const [newDegreeInst, setNewDegreeInst] = useState('');

  const handleAddDegree = () => {
    if (!newDegreeTitle.trim() || !newDegreeInst.trim()) {
      showNotification('Complete el título y la institución académica', 'error');
      return;
    }
    setFormData(prev => ({
      ...prev,
      academicDegrees: [...(prev.academicDegrees || []), { title: newDegreeTitle.trim(), institution: newDegreeInst.trim() }]
    }));
    setNewDegreeTitle('');
    setNewDegreeInst('');
  };

  const handleRemoveDegree = (index: number) => {
    setFormData(prev => ({
      ...prev,
      academicDegrees: (prev.academicDegrees || []).filter((_, i) => i !== index)
    }));
  };

  // Distinctions
  const [newDistinction, setNewDistinction] = useState('');
  const handleAddDistinction = () => {
    if (!newDistinction.trim()) return;
    setFormData(prev => ({
      ...prev,
      distinctions: [...(prev.distinctions || []), newDistinction.trim()]
    }));
    setNewDistinction('');
  };

  const handleRemoveDistinction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      distinctions: (prev.distinctions || []).filter((_, i) => i !== index)
    }));
  };

  // Bio Paragraphs
  const handleBioParagraphChange = (index: number, value: string) => {
    const updated = [...(formData.bioParagraphs || [])];
    updated[index] = value;
    setFormData(prev => ({ ...prev, bioParagraphs: updated }));
  };

  const handleAddBioParagraph = () => {
    setFormData(prev => ({
      ...prev,
      bioParagraphs: [...(prev.bioParagraphs || []), 'Nuevo párrafo de la semblanza biográfica.']
    }));
  };

  const handleRemoveBioParagraph = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bioParagraphs: (prev.bioParagraphs || []).filter((_, i) => i !== index)
    }));
  };

  // Message Paragraphs
  const handleMessageParagraphChange = (index: number, value: string) => {
    const updated = [...(formData.messageParagraphs || [])];
    updated[index] = value;
    setFormData(prev => ({ ...prev, messageParagraphs: updated }));
  };

  const handleAddMessageParagraph = () => {
    setFormData(prev => ({
      ...prev,
      messageParagraphs: [...(prev.messageParagraphs || []), 'Nuevo párrafo de la alocución oficial.']
    }));
  };

  const handleRemoveMessageParagraph = (index: number) => {
    setFormData(prev => ({
      ...prev,
      messageParagraphs: (prev.messageParagraphs || []).filter((_, i) => i !== index)
    }));
  };

  // Functions
  const [newFuncNum, setNewFuncNum] = useState('');
  const [newFuncTitle, setNewFuncTitle] = useState('');
  const [newFuncDesc, setNewFuncDesc] = useState('');

  const handleAddFunction = () => {
    if (!newFuncTitle.trim() || !newFuncDesc.trim()) {
      showNotification('Complete el título y la descripción de la función', 'error');
      return;
    }
    const num = newFuncNum.trim() || `0${(formData.functions || []).length + 1}`;
    setFormData(prev => ({
      ...prev,
      functions: [...(prev.functions || []), { num, title: newFuncTitle.trim(), desc: newFuncDesc.trim() }]
    }));
    setNewFuncNum('');
    setNewFuncTitle('');
    setNewFuncDesc('');
  };

  const handleRemoveFunction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      functions: (prev.functions || []).filter((_, i) => i !== index)
    }));
  };

  // Legal Framework
  const [newLegalTitle, setNewLegalTitle] = useState('');
  const [newLegalDesc, setNewLegalDesc] = useState('');

  const handleAddLegal = () => {
    if (!newLegalTitle.trim() || !newLegalDesc.trim()) {
      showNotification('Complete el título y la descripción del marco legal', 'error');
      return;
    }
    setFormData(prev => ({
      ...prev,
      legalFramework: [...(prev.legalFramework || []), { title: newLegalTitle.trim(), desc: newLegalDesc.trim() }]
    }));
    setNewLegalTitle('');
    setNewLegalDesc('');
  };

  const handleRemoveLegal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      legalFramework: (prev.legalFramework || []).filter((_, i) => i !== index)
    }));
  };

  // Save to Firebase & local context
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showNotification('Solo los administradores tienen permisos para guardar cambios', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await updateDirectorData(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (!isAdmin) return;
    setIsSaving(true);
    try {
      await resetDirectorData();
      setShowResetConfirm(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action Controls */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#003876] text-amber-300">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-sans">
                  CMS • Despacho del Director General
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-[#003876]">
                  Popup Oficial
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Administre la ficha técnica, fotografía en proporción 9:16, semblanza, alocución y funciones institucionales.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setIsDirectorModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#003876]" />
            <span>Previsualizar Popup</span>
          </button>

          {isAdmin && (
            <>
              {showResetConfirm ? (
                <div className="flex items-center gap-1 bg-red-50 p-1 rounded-xl border border-red-200">
                  <span className="text-[10px] text-red-700 font-bold px-1.5">¿Restablecer?</span>
                  <button
                    type="button"
                    onClick={handleResetToDefaults}
                    disabled={isSaving}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold cursor-pointer"
                  >
                    Sí, Restablecer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[11px] cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 font-semibold text-xs border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Restablecer contenido original por defecto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-[#003876] hover:bg-blue-900 active:scale-95 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>{isSaving ? 'Guardando en Firebase...' : 'Guardar Cambios en BD'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-200/70 p-1.5 rounded-xl overflow-x-auto scrollbar-none">
        {[
          { id: 'ficha', label: '1. Ficha & Foto 9:16', icon: ImageIcon },
          { id: 'biografia', label: '2. Biografía & Formación', icon: UserCheck },
          { id: 'mensaje', label: '3. Alocución & Cita', icon: Quote },
          { id: 'funciones', label: '4. Funciones del Despacho', icon: Briefcase },
          { id: 'marcoLegal', label: '5. Marco Legal', icon: Scale },
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-[#003876] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#CE1126]' : 'text-slate-400'}`} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Forms Content Area */}
      <form onSubmit={handleSaveAll} className="space-y-6">
        
        {/* ===================================================================
            SECCIÓN 1: FICHA GENERAL, DATOS DE CONTACTO & FOTO 9:16
           =================================================================== */}
        {activeSection === 'ficha' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
            
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Ficha Identificativa y Fotografía Oficial 9:16
                </h3>
                <p className="text-xs text-slate-500">
                  Configure los datos del Director y la fotografía en proporción vertical 9:16.
                </p>
              </div>
              <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Sincronización en Nube
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Columna Izquierda: Campos de texto */}
              <div className="lg:col-span-8 space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre y Rango Militar *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Mayor General, ERD"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#003876] focus:bg-white transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cargo Oficial *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ej: Director General del PECPFFAA"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#003876] focus:bg-white transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Institución / Adscripción *
                    </label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="Ej: PECPFFAA / MIDE"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#003876] focus:bg-white transition-all outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      URL de la Fotografía Oficial (Proporción 9:16) *
                    </label>
                    <input
                      type="url"
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#003876] focus:bg-white transition-all outline-none"
                      required
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, photoUrl: 'https://i.postimg.cc/V6vqjfQf/director-pecpffaa.jpg' })}
                        className="text-[10px] text-[#003876] hover:underline font-semibold"
                      >
                        Usar foto oficial provista (director-pecpffaa.jpg)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Teléfono Oficial
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(809) 530-5149"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#003876] focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Extensión
                    </label>
                    <input
                      type="text"
                      value={formData.extension}
                      onChange={(e) => setFormData({ ...formData, extension: e.target.value })}
                      placeholder="Ext. 3899 / 3900"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#003876] focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correo Electrónico del Despacho
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="despacho@pecpffaa.edu.do"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#003876] focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Horario de Atención
                    </label>
                    <input
                      type="text"
                      value={formData.schedule}
                      onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                      placeholder="Lunes a Viernes: 8:00 AM – 4:00 PM"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#003876] focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dirección Física / Sede
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Edificio Principal MIDE, Ave. 27 de Febrero esq. Ave. Gregorio Luperón, Santo Domingo, D.N."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#003876] focus:bg-white outline-none"
                  />
                </div>

              </div>

              {/* Columna Derecha: Previsualizador de Fotografía 9:16 en Vivo */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="w-full max-w-[220px] bg-slate-50 p-3 rounded-2xl border-2 border-slate-300 shadow-sm text-center space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#003876]">
                    <span>Vista Previa</span>
                    <span className="bg-red-100 text-[#CE1126] px-1.5 py-0.2 rounded text-[9px] font-mono font-extrabold">9:16</span>
                  </div>

                  <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 shadow-inner border border-slate-300">
                    <img
                      src={formData.photoUrl || 'https://i.postimg.cc/V6vqjfQf/director-pecpffaa.jpg'}
                      alt="Previsualización 9:16"
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 p-2 text-white text-[10px]">
                      <p className="font-bold truncate">{formData.name || 'Mayor General, ERD'}</p>
                      <p className="text-[9px] text-amber-300 truncate">{formData.title}</p>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 font-medium">
                    Proporción vertical óptima para retrato oficial de alta fidelidad.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ===================================================================
            SECCIÓN 2: BIOGRAFÍA, SEMBLANZA & FORMACIÓN ACADÉMICA
           =================================================================== */}
        {activeSection === 'biografia' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
            
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Semblanza Biográfica y Títulos Académicos
              </h3>
              <p className="text-xs text-slate-500">
                Párrafos de la biografía oficial, especializaciones, maestrías y distinciones.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtítulo de Semblanza
                </label>
                <input
                  type="text"
                  value={formData.bioSubtitle}
                  onChange={(e) => setFormData({ ...formData, bioSubtitle: e.target.value })}
                  placeholder="Semblanza Oficial"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#003876] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resumen de Cargo / Perfil
                </label>
                <input
                  type="text"
                  value={formData.bioSummary}
                  onChange={(e) => setFormData({ ...formData, bioSummary: e.target.value })}
                  placeholder="Director General del PECPFFAA • Fuerzas Armadas de la República Dominicana"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#003876] outline-none"
                />
              </div>
            </div>

            {/* Párrafos Biográficos */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Párrafos de la Biografía ({formData.bioParagraphs?.length || 0})
                </label>
                <button
                  type="button"
                  onClick={handleAddBioParagraph}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#003876] hover:bg-blue-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Párrafo</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.bioParagraphs?.map((parr, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 font-mono mt-2 w-6 text-center">
                      #{idx + 1}
                    </span>
                    <textarea
                      rows={3}
                      value={parr}
                      onChange={(e) => handleBioParagraphChange(idx, e.target.value)}
                      className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-[#003876] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBioParagraph(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                      title="Eliminar este párrafo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Formación Académica */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#CE1126]" />
                Formación Académica y Especializaciones
              </label>

              {/* Agregar nuevo grado */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={newDegreeTitle}
                    onChange={(e) => setNewDegreeTitle(e.target.value)}
                    placeholder="Título (Ej: Maestría en Ciberdefensa)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={newDegreeInst}
                    onChange={(e) => setNewDegreeInst(e.target.value)}
                    placeholder="Institución (Ej: INSUDE)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none"
                  />
                </div>
                <div className="sm:col-span-1">
                  <button
                    type="button"
                    onClick={handleAddDegree}
                    className="w-full py-1.5 px-3 bg-[#003876] hover:bg-blue-900 text-white rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>

              {/* Lista actual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.academicDegrees?.map((deg, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <div>
                      <span className="block font-bold text-xs text-slate-800">{deg.title}</span>
                      <span className="text-[11px] text-slate-500">{deg.institution}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDegree(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Distinciones */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Distinciones Oficiales y Condecoraciones
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDistinction}
                  onChange={(e) => setNewDistinction(e.target.value)}
                  placeholder="Ej: Orden al Mérito Militar"
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddDistinction}
                  className="px-3 py-1.5 bg-[#003876] text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.distinctions?.map((dist, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-xs font-semibold">
                    <span>{dist}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDistinction(idx)}
                      className="text-amber-700 hover:text-red-700 ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ===================================================================
            SECCIÓN 3: ALOCUCIÓN, CITA & MENSAJE OFICIAL
           =================================================================== */}
        {activeSection === 'mensaje' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
            
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Alocución Oficial del Director General
              </h3>
              <p className="text-xs text-slate-500">
                Cita célebre de apertura, período académico y párrafos del mensaje a la comunidad militar y ciudadana.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subtítulo del Mensaje / Ciclo
              </label>
              <input
                type="text"
                value={formData.messageSubtitle}
                onChange={(e) => setFormData({ ...formData, messageSubtitle: e.target.value })}
                placeholder="Alocución del Director General • Ciclo 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#003876] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cita Protocolar Destacada (Frase Guía)
              </label>
              <textarea
                rows={2}
                value={formData.messageQuote}
                onChange={(e) => setFormData({ ...formData, messageQuote: e.target.value })}
                placeholder="Formar con disciplina, liderar con honor y servir a la Patria con excelencia técnica y moral."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-serif leading-relaxed focus:ring-2 focus:ring-[#003876] outline-none"
              />
            </div>

            {/* Párrafos del Mensaje */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Párrafos de la Alocución ({formData.messageParagraphs?.length || 0})
                </label>
                <button
                  type="button"
                  onClick={handleAddMessageParagraph}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#003876] hover:bg-blue-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Párrafo</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.messageParagraphs?.map((parr, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 font-mono mt-2 w-6 text-center">
                      #{idx + 1}
                    </span>
                    <textarea
                      rows={3}
                      value={parr}
                      onChange={(e) => handleMessageParagraphChange(idx, e.target.value)}
                      className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-[#003876] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMessageParagraph(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ===================================================================
            SECCIÓN 4: FUNCIONES Y ATRIBUCIONES DEL DESPACHO
           =================================================================== */}
        {activeSection === 'funciones' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
            
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Funciones Principales del Despacho
              </h3>
              <p className="text-xs text-slate-500">
                Atribuciones institucionales y competencias de la Dirección General.
              </p>
            </div>

            {/* Agregar Función */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Agregar Nueva Función</span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={newFuncNum}
                    onChange={(e) => setNewFuncNum(e.target.value)}
                    placeholder="Núm (01)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none font-mono"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={newFuncTitle}
                    onChange={(e) => setNewFuncTitle(e.target.value)}
                    placeholder="Título de la función"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={newFuncDesc}
                    onChange={(e) => setNewFuncDesc(e.target.value)}
                    placeholder="Descripción de la función"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddFunction}
                    className="w-full py-1.5 px-3 bg-[#003876] hover:bg-blue-900 text-white rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de funciones */}
            <div className="space-y-2.5">
              {formData.functions?.map((f, idx) => (
                <div key={idx} className="flex items-start justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 gap-3">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-extrabold text-[#CE1126] bg-red-50 px-2 py-0.5 rounded border border-red-200 shrink-0">
                      {f.num}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{f.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFunction(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ===================================================================
            SECCIÓN 5: MARCO LEGAL & NORMATIVAS
           =================================================================== */}
        {activeSection === 'marcoLegal' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
            
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Marco Legal e Institucional
              </h3>
              <p className="text-xs text-slate-500">
                Leyes, decretos, reglamentos y base constitucional que sustenta el Despacho.
              </p>
            </div>

            {/* Agregar Ley / Decreto */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Agregar Marco Normativo</span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={newLegalTitle}
                    onChange={(e) => setNewLegalTitle(e.target.value)}
                    placeholder="Título (Ej: Ley No. 139-13)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none"
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={newLegalDesc}
                    onChange={(e) => setNewLegalDesc(e.target.value)}
                    placeholder="Descripción o alcance normativo"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddLegal}
                    className="w-full py-1.5 px-3 bg-[#003876] hover:bg-blue-900 text-white rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Lista actual */}
            <div className="space-y-2.5">
              {formData.legalFramework?.map((leg, idx) => (
                <div key={idx} className="flex items-start justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 gap-3">
                  <div className="flex items-start gap-3">
                    <Scale className="w-4 h-4 text-[#003876] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{leg.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">{leg.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLegal(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Sticky Bottom Save Bar */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-300">
              Todos los cambios guardados se reflejan instantáneamente en el Popup y en la base de datos de Firebase Firestore.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsDirectorModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Ver Popup
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-[#CE1126] hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Todo'}</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
