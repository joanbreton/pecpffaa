import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { InstitutionalData, DoctrinalValue, ArmedForcesBranch, InstitutionalStat } from '../types';
import { 
  Building2, 
  Save, 
  RotateCcw, 
  Target, 
  Eye, 
  Shield, 
  Award, 
  BookOpenCheck, 
  Compass, 
  Anchor, 
  Plane, 
  BarChart3, 
  Plus, 
  Trash2, 
  ExternalLink,
  Layers
} from 'lucide-react';

export const CMSInstitutionalTab: React.FC = () => {
  const { 
    institutionalData, 
    updateInstitutionalData, 
    resetInstitutionalData, 
    showNotification,
    setActiveView,
    currentUser 
  } = useApp();

  const isAdmin = currentUser?.role === 'Administrador';

  // Sub-sections tabs
  const [activeSection, setActiveSection] = useState<'encabezado' | 'misionVision' | 'valores' | 'ramas' | 'metricas'>('encabezado');
  const [isSaving, setIsSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Form local state cloned from context
  const [formData, setFormData] = useState<InstitutionalData>(() => institutionalData);

  useEffect(() => {
    setFormData(institutionalData);
  }, [institutionalData]);

  // Handlers for Doctrinal Values
  const [newValueTitle, setNewValueTitle] = useState('');
  const [newValueDesc, setNewValueDesc] = useState('');
  const [newValueIcon, setNewValueIcon] = useState('BookOpenCheck');

  const handleAddValue = () => {
    if (!newValueTitle.trim() || !newValueDesc.trim()) {
      showNotification('Complete el título y la descripción del valor', 'error');
      return;
    }
    setFormData(prev => ({
      ...prev,
      values: [...(prev.values || []), { title: newValueTitle.trim(), desc: newValueDesc.trim(), iconName: newValueIcon }]
    }));
    setNewValueTitle('');
    setNewValueDesc('');
  };

  const handleRemoveValue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      values: (prev.values || []).filter((_, i) => i !== index)
    }));
  };

  // Handlers for Armed Forces Branches
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchRole, setNewBranchRole] = useState('');
  const [newBranchIcon, setNewBranchIcon] = useState('Shield');

  const handleAddBranch = () => {
    if (!newBranchName.trim() || !newBranchRole.trim()) {
      showNotification('Complete el nombre de la rama y su función', 'error');
      return;
    }
    setFormData(prev => ({
      ...prev,
      branches: [...(prev.branches || []), { name: newBranchName.trim(), role: newBranchRole.trim(), iconName: newBranchIcon }]
    }));
    setNewBranchName('');
    setNewBranchRole('');
  };

  const handleRemoveBranch = (index: number) => {
    setFormData(prev => ({
      ...prev,
      branches: (prev.branches || []).filter((_, i) => i !== index)
    }));
  };

  // Handlers for Key Stats
  const [newStatNum, setNewStatNum] = useState('');
  const [newStatLabel, setNewStatLabel] = useState('');
  const [newStatSub, setNewStatSub] = useState('');

  const handleAddStat = () => {
    if (!newStatNum.trim() || !newStatLabel.trim()) {
      showNotification('Complete la cifra numérica y la etiqueta de la métrica', 'error');
      return;
    }
    setFormData(prev => ({
      ...prev,
      stats: [...(prev.stats || []), { number: newStatNum.trim(), label: newStatLabel.trim(), sub: newStatSub.trim() }]
    }));
    setNewStatNum('');
    setNewStatLabel('');
    setNewStatSub('');
  };

  const handleRemoveStat = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stats: (prev.stats || []).filter((_, i) => i !== index)
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
      await updateInstitutionalData(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (!isAdmin) return;
    setIsSaving(true);
    try {
      await resetInstitutionalData();
      setShowResetConfirm(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Control Actions */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0D3671] text-amber-300">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-sans">
                  CMS • Naturaleza Institucional
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-200">
                  Sección Principal
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Gestione la identidad, misión, visión, pilares doctrinales, ramas armadas y métricas del portal.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setActiveView('portal')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#0D3671]" />
            <span>Ver en Portal</span>
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
                  title="Restablecer contenido institucional por defecto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-[#0D3671] hover:bg-[#092652] active:scale-95 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-amber-300" />
                <span>{isSaving ? 'Guardando en Firebase...' : 'Guardar Cambios en BD'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Module Sub-tabs */}
      <div className="flex items-center gap-1.5 bg-slate-200/70 p-1.5 rounded-xl overflow-x-auto scrollbar-none">
        {[
          { id: 'encabezado', label: '1. Encabezado & Títulos', icon: Building2 },
          { id: 'misionVision', label: '2. Misión & Visión', icon: Target },
          { id: 'valores', label: '3. Pilares Doctrinales', icon: Shield },
          { id: 'ramas', label: '4. Ramas de las FF.AA.', icon: Layers },
          { id: 'metricas', label: '5. Métricas & Cifras', icon: BarChart3 },
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-[#0D3671] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B91C1C]' : 'text-slate-400'}`} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSaveAll} className="space-y-6">

        {/* 1. ENCABEZADO */}
        {activeSection === 'encabezado' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Encabezado Principal de la Sección
              </h3>
              <p className="text-xs text-slate-500">
                Modifique la etiqueta superior, título general, subtítulo y descripción institucional.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Etiqueta del Badge Superior
                </label>
                <input
                  type="text"
                  value={formData.badgeTag}
                  onChange={(e) => setFormData({ ...formData, badgeTag: e.target.value })}
                  placeholder="Ej: Naturaleza Institucional"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#0D3671] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtítulo Institucional
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder='Ej: Gran General Restaurador "Gregorio Luperón"'
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#0D3671] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Título Principal del Programa / Órgano
              </label>
              <input
                type="text"
                value={formData.mainTitle}
                onChange={(e) => setFormData({ ...formData, mainTitle: e.target.value })}
                placeholder="Ej: Programa de Educación y Capacitación Profesional de las FF.AA."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-[#0D3671] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Descripción Institucional General
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Órgano académico rector encargado de formar y capacitar a los miembros..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-[#0D3671] outline-none"
                required
              />
            </div>
          </div>
        )}

        {/* 2. MISIÓN, VISIÓN, VALORES & OBJETIVO */}
        {activeSection === 'misionVision' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Misión, Visión, Valores y Objetivo Institucional
              </h3>
              <p className="text-xs text-slate-500">
                Configure los pilares fundamentales del PECPFFAA: Misión, Visión, Valores e Identidad y Objetivo educativo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Misión */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-[#0D3671] font-bold text-sm">
                  <Target className="w-4 h-4 text-amber-500" />
                  <span>1. Misión Institucional</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.missionTitle}
                    onChange={(e) => setFormData({ ...formData, missionTitle: e.target.value })}
                    placeholder="Misión Institucional"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contenido
                  </label>
                  <textarea
                    rows={4}
                    value={formData.missionText}
                    onChange={(e) => setFormData({ ...formData, missionText: e.target.value })}
                    placeholder="Formar y capacitar a los miembros de las Fuerzas Armadas..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed outline-none"
                    required
                  />
                </div>
              </div>

              {/* Visión */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-[#B91C1C] font-bold text-sm">
                  <Eye className="w-4 h-4 text-[#B91C1C]" />
                  <span>2. Visión Prospectiva</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.visionTitle}
                    onChange={(e) => setFormData({ ...formData, visionTitle: e.target.value })}
                    placeholder="Visión Prospectiva"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contenido
                  </label>
                  <textarea
                    rows={4}
                    value={formData.visionText}
                    onChange={(e) => setFormData({ ...formData, visionText: e.target.value })}
                    placeholder="Ser el centro de excelencia académica militar de referencia..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed outline-none"
                    required
                  />
                </div>
              </div>

              {/* Valores Texto */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>3. Valores (Descripción)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título del Bloque
                  </label>
                  <input
                    type="text"
                    value={formData.valuesTextTitle || 'Valores'}
                    onChange={(e) => setFormData({ ...formData, valuesTextTitle: e.target.value })}
                    placeholder="Valores"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Texto Descriptivo de Valores
                  </label>
                  <textarea
                    rows={4}
                    value={formData.valuesText || 'El PECPFFAA fomenta en su personal y en los Estudiantes beneficiados de los programas los valores mostrados previamente.'}
                    onChange={(e) => setFormData({ ...formData, valuesText: e.target.value })}
                    placeholder="El PECPFFAA fomenta en su personal y en los Estudiantes..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed outline-none"
                  />
                </div>
              </div>

              {/* Objetivo */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>4. Objetivo Institucional</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.objectiveTitle || 'Objetivo'}
                    onChange={(e) => setFormData({ ...formData, objectiveTitle: e.target.value })}
                    placeholder="Objetivo"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contenido del Objetivo
                  </label>
                  <textarea
                    rows={4}
                    value={formData.objectiveText || 'Otorgar diferentes facilidades educativas, para la capacitación y profesionalización de los Miembros de las Fuerzas Armadas activos, en la honrosa condición de retiro y sus familiares directos, en distintas universidades, institutos y colegios.'}
                    onChange={(e) => setFormData({ ...formData, objectiveText: e.target.value })}
                    placeholder="Otorgar diferentes facilidades educativas..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PILARES DOCTRINALES / VALORES */}
        {activeSection === 'valores' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Pilares Doctrinales y Valores Institucionales
              </h3>
              <p className="text-xs text-slate-500">
                Agregue, edite o elimine los valores éticos y doctrinales que rigen la enseñanza.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título de la Sección de Valores
                </label>
                <input
                  type="text"
                  value={formData.valuesTitle}
                  onChange={(e) => setFormData({ ...formData, valuesTitle: e.target.value })}
                  placeholder="Pilares Doctrinales y Valores Institucionales"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtítulo Informativo
                </label>
                <input
                  type="text"
                  value={formData.valuesSubtitle}
                  onChange={(e) => setFormData({ ...formData, valuesSubtitle: e.target.value })}
                  placeholder="Principios rectores que guían la enseñanza..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold outline-none"
                />
              </div>
            </div>

            {/* Formulario Agregar Nuevo Valor */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Agregar Nuevo Pilar Doctrinal</span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={newValueTitle}
                    onChange={(e) => setNewValueTitle(e.target.value)}
                    placeholder="Título (Ej: Honor Militar)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none font-semibold"
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={newValueDesc}
                    onChange={(e) => setNewValueDesc(e.target.value)}
                    placeholder="Descripción del valor"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <select
                    value={newValueIcon}
                    onChange={(e) => setNewValueIcon(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none font-medium"
                  >
                    <option value="BookOpenCheck">BookOpenCheck</option>
                    <option value="Shield">Shield</option>
                    <option value="Compass">Compass</option>
                    <option value="Award">Award</option>
                    <option value="GraduationCap">GraduationCap</option>
                    <option value="Target">Target</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddValue}
                    className="w-full py-1.5 px-3 bg-[#0D3671] hover:bg-[#092652] text-white rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Lista actual de valores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.values?.map((val, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] bg-[#0D3671] text-amber-300 font-mono px-1.5 py-0.2 rounded font-bold">
                        {val.iconName || 'Shield'}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900">{val.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveValue(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. RAMAS DE LAS FF.AA. */}
        {activeSection === 'ramas' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Integración Doctrinal Conjunta (Ramas Armadas)
              </h3>
              <p className="text-xs text-slate-500">
                Configure la presencia e integración del Ejército, Armada y Fuerza Aérea.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título de Integración
                </label>
                <input
                  type="text"
                  value={formData.branchesTitle}
                  onChange={(e) => setFormData({ ...formData, branchesTitle: e.target.value })}
                  placeholder="Integración Doctrinal Conjunta"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtítulo de Integración
                </label>
                <input
                  type="text"
                  value={formData.branchesSubtitle}
                  onChange={(e) => setFormData({ ...formData, branchesSubtitle: e.target.value })}
                  placeholder="Convergencia de las tres ramas de las Fuerzas Armadas..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold outline-none"
                />
              </div>
            </div>

            {/* Agregar Nueva Rama */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Agregar Componente o Rama Armada</span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="Nombre (Ej: Ejército de República Dominicana)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none font-semibold"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={newBranchRole}
                    onChange={(e) => setNewBranchRole(e.target.value)}
                    placeholder="Rol (Ej: Comando de Operaciones Terrestres)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <select
                    value={newBranchIcon}
                    onChange={(e) => setNewBranchIcon(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none font-medium"
                  >
                    <option value="Shield">Shield (Ejército)</option>
                    <option value="Anchor">Anchor (Armada)</option>
                    <option value="Plane">Plane (Fuerza Aérea)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddBranch}
                    className="w-full py-1.5 px-3 bg-[#0D3671] hover:bg-[#092652] text-white rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Lista actual de ramas */}
            <div className="space-y-2.5">
              {formData.branches?.map((branch, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-[#0D3671] text-amber-300 font-mono text-xs font-bold shrink-0">
                      {branch.iconName || 'Shield'}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{branch.name}</h4>
                      <p className="text-xs text-slate-600">{branch.role}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBranch(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. MÉTRICAS & CIFRAS */}
        {activeSection === 'metricas' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Métricas Numéricas & Cinta de Estadísticas
              </h3>
              <p className="text-xs text-slate-500">
                Cifras destacadas del portal (Número de graduados, años de doctrina, convenios y acreditación).
              </p>
            </div>

            {/* Agregar Nueva Estadística */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Agregar Nueva Cifra Métrica</span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={newStatNum}
                    onChange={(e) => setNewStatNum(e.target.value)}
                    placeholder="Número (Ej: +3,850)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold outline-none"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={newStatLabel}
                    onChange={(e) => setNewStatLabel(e.target.value)}
                    placeholder="Etiqueta (Ej: Graduados)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={newStatSub}
                    onChange={(e) => setNewStatSub(e.target.value)}
                    placeholder="Sub-leyenda (Ej: Posgrado)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddStat}
                    className="w-full py-1.5 px-3 bg-[#0D3671] hover:bg-[#092652] text-white rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Lista actual de métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {formData.stats?.map((st, idx) => (
                <div key={idx} className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="text-2xl font-extrabold text-amber-400 font-mono">{st.number}</div>
                    <div className="text-xs font-bold mt-1 text-slate-100">{st.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{st.sub}</div>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveStat(idx)}
                      className="text-xs text-slate-400 hover:text-red-400 cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </form>

    </div>
  );
};
