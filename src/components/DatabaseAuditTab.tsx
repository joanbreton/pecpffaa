import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuditLogEntry, CMSModule, AuditAction } from '../types';
import { 
  Database, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  FileCode, 
  Copy, 
  Check, 
  Clock, 
  User, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  X,
  HardDrive,
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DatabaseAuditTabProps {
  onNavigateToTab?: (tab: 'slides' | 'news' | 'services' | 'users' | 'messages') => void;
}

export const DatabaseAuditTab: React.FC<DatabaseAuditTabProps> = ({ onNavigateToTab }) => {
  const { 
    auditLogs, 
    clearAuditLogs, 
    exportDatabase, 
    importDatabase, 
    getDatabaseStats, 
    showNotification,
    currentUser,
    firebaseSyncStatus,
    firebaseProjectId,
    slides,
    news,
    services,
    users,
    messages
  } = useApp();

  const isAdmin = currentUser?.role === 'Administrador';
  const dbStats = getDatabaseStats();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('Todos');
  const [actionFilter, setActionFilter] = useState<string>('Todas');

  // Modals state
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [restoreJsonText, setRestoreJsonText] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  // Filtered logs
  const filteredLogs = auditLogs.filter((log) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      log.itemTitle.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.userName.toLowerCase().includes(q) ||
      log.itemId.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.module.toLowerCase().includes(q);

    const matchesModule = moduleFilter === 'Todos' || log.module === moduleFilter;
    const matchesAction = actionFilter === 'Todas' || log.action === actionFilter;

    return matchesSearch && matchesModule && matchesAction;
  });

  const handleDownloadBackup = () => {
    try {
      const jsonStr = exportDatabase();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pecpffaa-db-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('Copia de seguridad completa descargada (.json)', 'success');
    } catch {
      showNotification('Error al generar la descarga del respaldo', 'error');
    }
  };

  const handleCopyBackup = () => {
    try {
      const jsonStr = exportDatabase();
      navigator.clipboard.writeText(jsonStr).then(() => {
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 2500);
        showNotification('JSON de la base de datos copiado al portapapeles', 'success');
      });
    } catch {
      showNotification('Error al copiar al portapapeles', 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRestoreJsonText(content);
    };
    reader.readAsText(file);
  };

  const handleExecuteRestore = () => {
    if (!restoreJsonText.trim()) {
      showNotification('Pegue o cargue un archivo JSON válido para restaurar', 'error');
      return;
    }
    const result = importDatabase(restoreJsonText);
    if (result.success) {
      setIsRestoreModalOpen(false);
      setRestoreJsonText('');
    } else {
      showNotification(result.message, 'error');
    }
  };

  const handleCopySingleLog = (log: AuditLogEntry) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2)).then(() => {
      setCopiedLogId(log.id);
      setTimeout(() => setCopiedLogId(null), 2000);
      showNotification('Registro copiado en formato JSON', 'info');
    });
  };

  const getActionBadgeColor = (action: AuditAction) => {
    switch (action) {
      case 'Creación':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Modificación':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Eliminación':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Cambio de Estado':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Restauración BD':
      case 'Inicialización BD':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getModuleBadgeColor = (mod: CMSModule) => {
    switch (mod) {
      case 'Slides (Carrusel)':
        return 'bg-red-100/70 text-red-900';
      case 'Noticias':
        return 'bg-blue-100/70 text-blue-900';
      case 'Oferta Académica':
        return 'bg-emerald-100/70 text-emerald-900';
      case 'Usuarios':
        return 'bg-amber-100/70 text-amber-900';
      case 'Buzón Admisiones':
        return 'bg-purple-100/70 text-purple-900';
      case 'Base de Datos':
        return 'bg-indigo-100/70 text-indigo-900';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-xl font-bold text-slate-900">Base de Datos Institucional & Auditoría</h2>
            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              firebaseSyncStatus === 'connected'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : firebaseSyncStatus === 'connecting'
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-red-100 text-red-800 border-red-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                firebaseSyncStatus === 'connected' ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
              }`} />
              {firebaseSyncStatus === 'connected' 
                ? 'Firebase Firestore Conectado (Nube)' 
                : firebaseSyncStatus === 'connecting' 
                ? 'Sincronizando con Firebase...' 
                : 'Modo Local / Desconectado'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
              ID: {firebaseProjectId}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Conexión en tiempo real con Google Cloud Firestore y sincronización multidireccional de diapositivas, noticias, posgrados, admisiones y auditoría forense.
          </p>
        </div>

        {/* Database Quick Actions */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleDownloadBackup}
            className="px-3 py-2 bg-[#0D3671] hover:bg-[#092652] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            title="Descargar respaldo completo de todas las tablas en formato JSON"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Descargar Respaldo JSON</span>
          </button>

          <button
            onClick={handleCopyBackup}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors"
            title="Copiar JSON íntegro de la base de datos"
          >
            {copiedNotification ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            <span>{copiedNotification ? 'Copiado' : 'Copiar JSON'}</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setIsRestoreModalOpen(true)}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              title="Restaurar base de datos desde un archivo o código JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Restaurar BD</span>
            </button>
          )}

          {isAdmin && auditLogs.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('¿Desea vaciar el historial de auditoría? Los datos de las tablas no se eliminarán, solo los registros de la bitácora.')) {
                  clearAuditLogs();
                }
              }}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-red-200 transition-colors"
              title="Vaciar historial de logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar Logs</span>
            </button>
          )}
        </div>
      </div>

      {/* Database Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">Registros en Tablas</span>
            <HardDrive className="w-4 h-4 text-[#0D3671]" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{dbStats.totalRecords}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{dbStats.tables.length} tablas institucionales activas</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">Transacciones Auditadas</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{auditLogs.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">cambios guardados en bitácora</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">Almacenamiento Usado</span>
            <Database className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {(dbStats.storageSizeBytes / 1024).toFixed(1)} <span className="text-sm font-normal text-slate-500">KB</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Cloud Firestore + Respaldo Local</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500">Versión del Motor</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base font-bold text-slate-900 font-mono mt-1">{dbStats.version}</div>
          <div className="text-[11px] text-slate-500 truncate mt-1">Último: {auditLogs[0]?.formattedDate || 'Sin cambios'}</div>
        </div>
      </div>

      {/* Database Master Tables Catalog */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Catálogo de Tablas de la Base de Datos</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">6 entidades relacionales</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Table 1: tbl_slides */}
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-red-300">tbl_slides</span>
              <span className="bg-white/15 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white">{slides.length} filas</span>
            </div>
            <p className="text-[11px] text-slate-300">Banners principales del carrusel 16:9 de la portada institucional.</p>
            {onNavigateToTab && (
              <button 
                onClick={() => onNavigateToTab('slides')}
                className="mt-2.5 text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold"
              >
                <span>Administrar tabla</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Table 2: tbl_noticias */}
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-blue-300">tbl_noticias</span>
              <span className="bg-white/15 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white">{news.length} filas</span>
            </div>
            <p className="text-[11px] text-slate-300">Boletines doctrinales, noticias y notas de prensa oficiales.</p>
            {onNavigateToTab && (
              <button 
                onClick={() => onNavigateToTab('news')}
                className="mt-2.5 text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold"
              >
                <span>Administrar tabla</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Table 3: tbl_servicios_academicos */}
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-emerald-300">tbl_servicios_academicos</span>
              <span className="bg-white/15 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white">{services.length} filas</span>
            </div>
            <p className="text-[11px] text-slate-300">Programas de posgrado, maestrías, especialidades y diplomados.</p>
            {onNavigateToTab && (
              <button 
                onClick={() => onNavigateToTab('services')}
                className="mt-2.5 text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold"
              >
                <span>Administrar tabla</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Table 4: tbl_usuarios_cms */}
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-amber-300">tbl_usuarios_cms</span>
              <span className="bg-white/15 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white">{users.length} filas</span>
            </div>
            <p className="text-[11px] text-slate-300">Cuentas de oficiales con privilegios de Administrador y Modo Lectura.</p>
            {onNavigateToTab && (
              <button 
                onClick={() => onNavigateToTab('users')}
                className="mt-2.5 text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold"
              >
                <span>Administrar tabla</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Table 5: tbl_buzon_admisiones */}
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-purple-300">tbl_buzon_admisiones</span>
              <span className="bg-white/15 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white">{messages.length} filas</span>
            </div>
            <p className="text-[11px] text-slate-300">Solicitudes y consultas recibidas a través del portal público.</p>
            {onNavigateToTab && (
              <button 
                onClick={() => onNavigateToTab('messages')}
                className="mt-2.5 text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold"
              >
                <span>Administrar tabla</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Table 6: tbl_auditoria_transacciones */}
          <div className="bg-white/5 border border-emerald-500/30 p-3.5 rounded-xl bg-emerald-950/20">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs font-bold text-emerald-300">tbl_auditoria_transacciones</span>
              <span className="bg-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-emerald-200">{auditLogs.length} logs</span>
            </div>
            <p className="text-[11px] text-slate-300">Registro inmutable de auditoría forense con cada cambio del CMS.</p>
            <span className="mt-2.5 text-[11px] text-emerald-400 flex items-center gap-1 font-bold">
              <span>Sincronización en tiempo real activa</span>
            </span>
          </div>
        </div>
      </div>

      {/* Audit Log / Registro de Cambios Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0D3671]" />
              <span>Registro de Cambios & Auditoría de Operaciones</span>
            </h3>
            <p className="text-xs text-slate-500">
              Mostrando {filteredLogs.length} de {auditLogs.length} eventos registrados en la base de datos.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en el registro..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0D3671]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Filter by Module */}
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              aria-label="Filtrar por Módulo"
              className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D3671]"
            >
              <option value="Todos">Todos los Módulos</option>
              <option value="Slides (Carrusel)">Slides (Carrusel)</option>
              <option value="Noticias">Noticias</option>
              <option value="Oferta Académica">Oferta Académica</option>
              <option value="Usuarios">Usuarios</option>
              <option value="Buzón Admisiones">Buzón Admisiones</option>
              <option value="Base de Datos">Base de Datos</option>
            </select>

            {/* Filter by Action */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              aria-label="Filtrar por Acción"
              className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0D3671]"
            >
              <option value="Todas">Todas las Acciones</option>
              <option value="Creación">Creación</option>
              <option value="Modificación">Modificación</option>
              <option value="Eliminación">Eliminación</option>
              <option value="Cambio de Estado">Cambio de Estado</option>
              <option value="Restauración BD">Restauración BD</option>
            </select>
          </div>
        </div>

        {/* Audit Log Entries List / Table */}
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 space-y-2">
            <Clock className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
            <p className="font-bold text-sm text-slate-700">No se encontraron registros de auditoría</p>
            <p className="text-xs text-slate-400">Pruebe ajustando los filtros o realizando cambios en algún módulo del CMS.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#0D3671]/40 shadow-xs transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center flex-wrap gap-2 text-xs">
                    {/* Action badge */}
                    <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] border ${getActionBadgeColor(log.action)}`}>
                      {log.action}
                    </span>

                    {/* Module badge */}
                    <span className={`px-2 py-0.5 rounded-md font-medium text-[10px] ${getModuleBadgeColor(log.module)}`}>
                      {log.module}
                    </span>

                    {/* Item title */}
                    <span className="font-bold text-slate-900 text-xs">
                      {log.itemTitle}
                    </span>

                    {/* Item ID */}
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      ID: {log.itemId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-[11px] font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {log.formattedDate}
                    </span>
                  </div>
                </div>

                {/* Details sentence */}
                <div className="text-xs text-slate-700 leading-relaxed">
                  {log.details}
                </div>

                {/* Footer of card: User + Action buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Responsable: <strong className="text-slate-700">{log.userName}</strong></span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] text-slate-500">Estado: <strong className="text-emerald-600">Guardado en BD ✓</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopySingleLog(log)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                      title="Copiar JSON del registro"
                    >
                      {copiedLogId === log.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedLogId === log.id ? 'Copiado' : 'Copiar'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-2.5 py-1 bg-[#0D3671]/10 hover:bg-[#0D3671] text-[#0D3671] hover:text-white rounded text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <FileCode className="w-3 h-3" />
                      <span>Ver Payload JSON</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: View Raw JSON Payload */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#0D3671]" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Detalle Forense de Transacción</h3>
                  <p className="text-[10px] text-slate-500">Registro inmutable en la tabla de auditoría de base de datos.</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div><span className="text-slate-500">ID de Log:</span> <strong className="font-mono text-slate-800">{selectedLog.id}</strong></div>
                <div><span className="text-slate-500">Fecha/Hora:</span> <strong className="text-slate-800">{selectedLog.formattedDate}</strong></div>
                <div><span className="text-slate-500">Módulo:</span> <strong className="text-slate-800">{selectedLog.module}</strong></div>
                <div><span className="text-slate-500">Acción:</span> <strong className="text-slate-800">{selectedLog.action}</strong></div>
                <div><span className="text-slate-500">Responsable:</span> <strong className="text-slate-800">{selectedLog.userName}</strong></div>
                <div><span className="text-slate-500">Estado BD:</span> <strong className="text-emerald-700">{selectedLog.status}</strong></div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 mb-1 block">Payload Técnico Almacenado (JSON):</label>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-60 leading-relaxed border border-white/10">
                  {JSON.stringify(selectedLog, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleCopySingleLog(selectedLog)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Registro JSON</span>
              </button>
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-[#0D3671] text-white rounded-lg text-xs font-bold hover:bg-[#092652] transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Restore Database from JSON */}
      {isRestoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Restaurar Base de Datos desde Respaldo</h3>
                  <p className="text-[10px] text-slate-500">Reemplaza el estado actual por el contenido del archivo JSON de respaldo.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsRestoreModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Advertencia de Restauración:</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-normal">
                  Esta acción actualizará las tablas de Slides, Noticias, Oferta Académica y Usuarios con el respaldo proporcionado. Se añadirá un evento de auditoría registrando esta restauración.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Opción 1: Cargar Archivo .JSON</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#0D3671] file:text-white hover:file:bg-[#092652] cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Opción 2: Pegar Contenido JSON de Respaldo</label>
                <textarea
                  rows={6}
                  value={restoreJsonText}
                  onChange={(e) => setRestoreJsonText(e.target.value)}
                  placeholder='{ "tables": { "slides": [...], "news": [...] } }'
                  className="w-full p-2.5 font-mono text-[11px] bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsRestoreModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteRestore}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ejecutar Restauración</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
