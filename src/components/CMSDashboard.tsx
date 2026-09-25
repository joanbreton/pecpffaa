import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SlideItem, NewsItem, ServiceItem, UserItem, UserRole } from '../types';
import officialLogo from '../assets/images/programalogo.jpg';
import { 
  Newspaper, 
  GraduationCap, 
  Users, 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Shield, 
  Lock, 
  KeyRound,
  ArrowLeft, 
  LogOut, 
  RotateCcw, 
  Image as ImageIcon, 
  ExternalLink,
  Mail,
  Database,
  CheckCircle2
} from 'lucide-react';
import { DatabaseAuditTab } from './DatabaseAuditTab';

export const CMSDashboard: React.FC = () => {
  const { 
    currentUser, 
    logout, 
    setActiveView, 
    slides, 
    addSlide, 
    updateSlide, 
    deleteSlide, 
    toggleSlideStatus,
    news,
    addNews,
    updateNews,
    deleteNews,
    services,
    addService,
    updateService,
    deleteService,
    users,
    addUser,
    updateUser,
    deleteUser,
    messages,
    updateMessageStatus,
    deleteMessage,
    auditLogs,
    resetToDefaults,
    showNotification,
    firebaseSyncStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'slides' | 'news' | 'services' | 'users' | 'messages' | 'database'>('overview');
  const [messageFilter, setMessageFilter] = useState<'Todos' | 'No leído' | 'Leído' | 'Respondido'>('Todos');
  
  const isAdmin = currentUser?.role === 'Administrador';

  // Forms state
  // Slide Form
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideFormData, setSlideFormData] = useState<Omit<SlideItem, 'id'>>({
    title: '',
    subtitle: '',
    tag: 'Formación Superior',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Ver Programas',
    ctaLink: '#servicios',
    secondaryText: 'Admisiones',
    secondaryLink: '#admisiones',
    order: 1,
    active: true,
  });

  // News Form
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsFormData, setNewsFormData] = useState<Omit<NewsItem, 'id' | 'views'>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Doctrina Conjunta',
    author: 'Dirección de Comunicaciones',
    date: new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' }),
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    featured: false,
    readTime: '3 min de lectura',
  });

  // Service Form
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceFormData, setServiceFormData] = useState<Omit<ServiceItem, 'id'>>({
    code: 'POS-01',
    title: '',
    category: 'Maestría',
    description: '',
    duration: '1 Año',
    modality: 'Presencial',
    targetAudience: 'Oficiales y Civiles',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    iconName: 'Shield',
    requirements: ['Título universitario de grado', 'Servicio militar o profesional afín'],
    modules: ['Doctrina Estratégica', 'Planificación Operativa'],
    featured: true,
  });

  // User Form
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState<Omit<UserItem, 'id' | 'createdAt'>>({
    username: '',
    name: '',
    email: '',
    role: 'Lectura',
    status: 'Activo',
    password: '',
  });

  // Slide Handlers
  const handleOpenSlideModal = (slide?: SlideItem) => {
    if (slide) {
      setEditingSlideId(slide.id);
      setSlideFormData({
        title: slide.title,
        subtitle: slide.subtitle,
        tag: slide.tag,
        image: slide.image,
        ctaText: slide.ctaText,
        ctaLink: slide.ctaLink,
        secondaryText: slide.secondaryText || '',
        secondaryLink: slide.secondaryLink || '',
        order: slide.order,
        active: slide.active,
      });
    } else {
      setEditingSlideId(null);
      setSlideFormData({
        title: '',
        subtitle: '',
        tag: 'Nueva Convocatoria',
        image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80',
        ctaText: 'Ver Más',
        ctaLink: '#servicios',
        secondaryText: 'Contacto',
        secondaryLink: '#contacto',
        order: slides.length + 1,
        active: true,
      });
    }
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showNotification('Modo Lectura: No tiene permisos para guardar cambios.', 'info');
      return;
    }
    if (editingSlideId) {
      updateSlide(editingSlideId, slideFormData);
    } else {
      addSlide(slideFormData);
    }
    setIsSlideModalOpen(false);
  };

  // News Handlers
  const handleOpenNewsModal = (item?: NewsItem) => {
    if (item) {
      setEditingNewsId(item.id);
      setNewsFormData({
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        category: item.category,
        author: item.author,
        date: item.date,
        image: item.image,
        featured: item.featured || false,
        readTime: item.readTime,
      });
    } else {
      setEditingNewsId(null);
      setNewsFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'Doctrina Conjunta',
        author: currentUser?.name || 'Dirección de Comunicaciones',
        date: new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' }),
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
        featured: false,
        readTime: '3 min de lectura',
      });
    }
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showNotification('Modo Lectura: No tiene permisos para guardar noticias.', 'info');
      return;
    }
    if (editingNewsId) {
      updateNews(editingNewsId, newsFormData);
    } else {
      addNews(newsFormData);
    }
    setIsNewsModalOpen(false);
  };

  // Service Handlers
  const handleOpenServiceModal = (srv?: ServiceItem) => {
    if (srv) {
      setEditingServiceId(srv.id);
      setServiceFormData({
        code: srv.code,
        title: srv.title,
        category: srv.category,
        description: srv.description,
        duration: srv.duration,
        modality: srv.modality,
        targetAudience: srv.targetAudience,
        image: srv.image,
        iconName: srv.iconName,
        requirements: srv.requirements,
        modules: srv.modules,
        featured: srv.featured,
      });
    } else {
      setEditingServiceId(null);
      setServiceFormData({
        code: `POS-0${services.length + 1}`,
        title: '',
        category: 'Diplomado',
        description: '',
        duration: '6 Meses',
        modality: 'Semipresencial',
        targetAudience: 'Oficiales y Civiles',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        iconName: 'Shield',
        requirements: ['Título universitario', 'Hoja de vida profesional'],
        modules: ['Módulo 1: Fundamentos', 'Módulo 2: Aplicación Práctica'],
        featured: false,
      });
    }
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showNotification('Modo Lectura: No tiene permisos para editar servicios.', 'info');
      return;
    }
    if (editingServiceId) {
      updateService(editingServiceId, serviceFormData);
    } else {
      addService(serviceFormData);
    }
    setIsServiceModalOpen(false);
  };

  // User Handlers
  const handleOpenUserModal = (user?: UserItem) => {
    if (user) {
      setEditingUserId(user.id);
      setUserFormData({
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: user.password || '',
      });
    } else {
      setEditingUserId(null);
      setUserFormData({
        username: '',
        name: '',
        email: '',
        role: 'Lectura',
        status: 'Activo',
        password: 'User@123',
      });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showNotification('Modo Lectura: Solo el Administrador puede gestionar usuarios.', 'info');
      return;
    }
    if (editingUserId) {
      updateUser(editingUserId, userFormData);
    } else {
      addUser(userFormData);
    }
    setIsUserModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* CMS Topbar in Deep Blue #0D3671 */}
      <header className="bg-[#0D3671] text-white border-b-2 border-[#B91C1C] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white p-0.5 flex items-center justify-center border-2 border-white shadow">
            <img 
              src={officialLogo} 
              alt="Escudo Oficial PECPFFAA" 
              className="w-full h-full object-contain rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white font-serif tracking-wider">CMS PECPFFAA</span>
              <span className="text-[10px] bg-[#B91C1C] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Panel de Control
              </span>
            </div>
            <p className="text-xs text-slate-300">Sistema de Gestión de Contenidos & Roles</p>
          </div>
        </div>

        {/* User Identity & View Toggle */}
        <div className="flex items-center space-x-3">
          {/* Real-time DB Sync & Audit Status Indicator */}
          <button
            onClick={() => setActiveTab('database')}
            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer shadow-inner ${
              firebaseSyncStatus === 'connected'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/90'
                : firebaseSyncStatus === 'connecting'
                ? 'bg-amber-950/80 border-amber-500/40 text-amber-300 hover:bg-amber-900/90'
                : 'bg-red-950/80 border-red-500/40 text-red-300 hover:bg-red-900/90'
            }`}
            title="Conexión en tiempo real con Google Cloud Firebase Firestore. Sincronización continua de datos."
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                firebaseSyncStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                firebaseSyncStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}></span>
            </span>
            <Database className={`w-3.5 h-3.5 ${
              firebaseSyncStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'
            }`} />
            <span className="font-mono text-[11px] font-semibold">
              {firebaseSyncStatus === 'connected' ? 'Firebase Firestore • En Línea' : 'Sincronizando con Firebase...'}
            </span>
          </button>

          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white">{currentUser?.name || 'Administrador'}</span>
            <div className="flex items-center justify-end gap-1.5">
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                isAdmin ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-200'
              }`}>
                Rol: {currentUser?.role || 'Lectura'}
              </span>
              {!isAdmin && (
                <span className="text-[10px] text-amber-300">(Solo Consulta)</span>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveView('portal')}
            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ver Portal Público</span>
          </button>

          <button
            onClick={logout}
            title="Cerrar Sesión"
            className="p-2 rounded-lg bg-red-950/60 hover:bg-red-800 text-red-200 border border-red-700/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main CMS Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* Left Sidebar Navigation (Sleek Dark Style) */}
        <aside className="w-full md:w-64 bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-white/10 shrink-0 space-y-3 flex flex-col justify-between">
          
          <div className="space-y-2">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/10 pb-2">
              Módulos del CMS
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'overview' 
                    ? 'bg-white/10 text-white border-l-4 border-[#B91C1C] shadow-sm' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Resumen General</span>
              </button>

              <button
                onClick={() => setActiveTab('slides')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'slides' 
                    ? 'bg-white/10 text-white border-l-4 border-[#B91C1C] shadow-sm' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-4 h-4 text-red-400" />
                  <span>Slider 16:9 Carrusel</span>
                </div>
                <span className="text-[10px] bg-white/15 text-white px-2 py-0.5 rounded-full font-mono">
                  {slides.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('news')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'news' 
                    ? 'bg-white/10 text-white border-l-4 border-[#B91C1C] shadow-sm' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Newspaper className="w-4 h-4 text-blue-400" />
                  <span>Noticias & Artículos</span>
                </div>
                <span className="text-[10px] bg-white/15 text-white px-2 py-0.5 rounded-full font-mono">
                  {news.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'services' 
                    ? 'bg-white/10 text-white border-l-4 border-[#B91C1C] shadow-sm' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Servicios & Carreras</span>
                </div>
                <span className="text-[10px] bg-white/15 text-white px-2 py-0.5 rounded-full font-mono">
                  {services.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'users' 
                    ? 'bg-white/10 text-white border-l-4 border-[#B91C1C] shadow-sm' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Usuarios & Roles</span>
                </div>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                  {users.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'messages' 
                    ? 'bg-white/10 text-white border-l-4 border-[#B91C1C] shadow-sm' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>Buzón Admisiones</span>
                </div>
                <span className="text-[10px] bg-[#B91C1C] text-white px-2 py-0.5 rounded-full font-mono font-bold">
                  {messages.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'database' 
                    ? 'bg-white/10 text-white border-l-4 border-[#B91C1C] shadow-sm' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Base de Datos & Logs</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  {auditLogs.length}
                </span>
              </button>
            </nav>
          </div>

          {/* User Profile & Role Status in Sidebar Footer */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-amber-300 border border-white/20 shrink-0">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{currentUser?.name || 'Administrador'}</div>
                <div className="text-[10px] text-slate-400 truncate">@{currentUser?.username || 'admin'} • {currentUser?.role}</div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 bg-black/40 p-2.5 rounded-lg border border-white/5 font-mono leading-tight">
              <div className="font-bold text-slate-300 mb-0.5">Credenciales demo:</div>
              <div>admin : admin</div>
              <div>oficial_lector : Lector@123</div>
            </div>

            {isAdmin && (
              <button
                onClick={resetToDefaults}
                className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                title="Restaurar datos predeterminados de prueba"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Restaurar Datos Iniciales</span>
              </button>
            )}
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 overflow-x-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Resumen Institucional del CMS</h2>
                  <p className="text-xs text-slate-500">Métricas en tiempo real del portal universitario PECPFFAA.</p>
                </div>
                <button
                  onClick={() => setActiveView('portal')}
                  className="px-4 py-2 bg-[#0D3671] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#092652]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ver Sitio Web
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div 
                  onClick={() => setActiveTab('slides')}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#0D3671] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500">Slides 16:9</span>
                    <ImageIcon className="w-4 h-4 text-[#0D3671]" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">{slides.filter(s => s.active).length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">de {slides.length} en carrusel</div>
                </div>

                <div 
                  onClick={() => setActiveTab('news')}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#B91C1C] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500">Noticias</span>
                    <Newspaper className="w-4 h-4 text-[#B91C1C]" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">{news.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">artículos publicados</div>
                </div>

                <div 
                  onClick={() => setActiveTab('services')}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-600 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500">Programas</span>
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">{services.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">maestrías y diplomados</div>
                </div>

                <div 
                  onClick={() => setActiveTab('users')}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-600 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500">Usuarios CMS</span>
                    <Users className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">{users.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">operadores registrados</div>
                </div>

                <div 
                  onClick={() => setActiveTab('database')}
                  className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-500 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-900">Base de Datos & Logs</span>
                    <Database className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-800">{auditLogs.length}</div>
                  <div className="text-[11px] text-emerald-700 mt-1">cambios registrados</div>
                </div>
              </div>

              {/* Quick Action Shortcuts */}
              <div className="bg-[#0D3671] text-white p-6 rounded-2xl space-y-4">
                <h3 className="font-bold text-base">Acciones Rápidas de Administración</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    onClick={() => { setActiveTab('slides'); handleOpenSlideModal(); }}
                    className="py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-amber-300" />
                    <span>Añadir Slide 16:9</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('news'); handleOpenNewsModal(); }}
                    className="py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-amber-300" />
                    <span>Publicar Noticia</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('services'); handleOpenServiceModal(); }}
                    className="py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-amber-300" />
                    <span>Nuevo Programa</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('database')}
                    className="py-3 px-4 bg-emerald-600/60 hover:bg-emerald-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-emerald-400/40 transition-colors text-white"
                  >
                    <Database className="w-4 h-4 text-emerald-200" />
                    <span>Base de Datos & Respaldo</span>
                  </button>
                </div>
              </div>

              {/* Recent Audit Logs Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>Últimos Cambios en Base de Datos (Auditoría Forense)</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('database')}
                    className="text-xs font-bold text-[#0D3671] hover:underline"
                  >
                    Ver historial completo ({auditLogs.length}) →
                  </button>
                </div>

                <div className="space-y-2">
                  {auditLogs.slice(0, 3).map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.action === 'Creación' ? 'bg-emerald-100 text-emerald-800' :
                            log.action === 'Modificación' ? 'bg-blue-100 text-blue-800' :
                            log.action === 'Eliminación' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {log.action}
                          </span>
                          <span className="font-bold text-slate-800">{log.itemTitle}</span>
                          <span className="text-[10px] text-slate-400 font-mono">[{log.module}]</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{log.details}</p>
                      </div>
                      <div className="text-[10px] text-slate-400 shrink-0 font-mono flex sm:flex-col sm:items-end justify-between">
                        <span>{log.formattedDate}</span>
                        <span className="text-slate-500 font-sans">Por: {log.userName.split(' ')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Messages Preview */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900">Últimas Solicitudes de Admisión Recibidas</h4>
                {messages.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-xs text-center border border-slate-200">
                    No hay solicitudes recientes en el buzón.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {messages.slice(0, 3).map((m) => (
                      <div key={m.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{m.name} <span className="font-normal text-slate-500">({m.email} • {m.phone})</span></div>
                          <p className="text-slate-600 text-[11px] mt-0.5">{m.subject}</p>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-[#0D3671] px-2 py-0.5 rounded font-semibold">
                          {m.date}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SLIDES 16:9 */}
          {activeTab === 'slides' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Gestión del Slider Carrusel (Proporción 16:9)</h2>
                  <p className="text-xs text-slate-500">Administre las imágenes, textos y llamadas a la acción de la portada.</p>
                </div>

                <button
                  onClick={() => handleOpenSlideModal()}
                  disabled={!isAdmin}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow ${
                    isAdmin 
                      ? 'bg-[#B91C1C] hover:bg-red-700 text-white cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Slide 16:9</span>
                </button>
              </div>

              {/* Slides Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {slides.map((slide) => (
                  <div 
                    key={slide.id}
                    className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      {/* 16:9 Image Preview Container */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                        <img 
                          src={slide.image} 
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#B91C1C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow">
                            {slide.tag || 'Slide 16:9'}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                            slide.active ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {slide.active ? 'Activo' : 'Oculto'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                          {slide.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {slide.subtitle}
                        </p>
                        <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#0D3671]">
                          <span>CTA: {slide.ctaText}</span>
                          <span className="text-slate-400">→</span>
                          <span className="text-slate-500 font-mono text-[11px]">{slide.ctaLink}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleSlideStatus(slide.id)}
                        disabled={!isAdmin}
                        className={`text-xs px-2.5 py-1.5 rounded font-semibold border ${
                          isAdmin ? 'hover:bg-slate-50 text-slate-700 border-slate-300' : 'text-slate-400 border-slate-200 cursor-not-allowed'
                        }`}
                      >
                        {slide.active ? 'Ocultar' : 'Activar'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenSlideModal(slide)}
                          disabled={!isAdmin}
                          className={`p-2 rounded border ${
                            isAdmin ? 'bg-[#0D3671] text-white hover:bg-[#092652]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                          title="Editar slide"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSlide(slide.id)}
                          disabled={!isAdmin}
                          className={`p-2 rounded border ${
                            isAdmin ? 'bg-red-50 text-[#B91C1C] border-red-200 hover:bg-red-100' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                          title="Eliminar slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NEWS */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Gestión de Noticias & Comunicados</h2>
                  <p className="text-xs text-slate-500">Publique y edite boletines doctrinales y eventos institucionales.</p>
                </div>

                <button
                  onClick={() => handleOpenNewsModal()}
                  disabled={!isAdmin}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow ${
                    isAdmin 
                      ? 'bg-[#B91C1C] hover:bg-red-700 text-white cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar Noticia</span>
                </button>
              </div>

              {/* News Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Título & Resumen</th>
                      <th className="p-3.5">Categoría</th>
                      <th className="p-3.5">Fecha</th>
                      <th className="p-3.5">Lecturas</th>
                      <th className="p-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {news.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 max-w-sm">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.title} className="w-12 h-10 object-cover rounded shrink-0" />
                            <div>
                              <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">{item.excerpt}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="bg-[#0D3671]/10 text-[#0D3671] px-2 py-0.5 rounded font-semibold text-[11px]">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">{item.date}</td>
                        <td className="p-3.5 font-mono text-slate-700">{item.views}</td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenNewsModal(item)}
                              disabled={!isAdmin}
                              className={`p-1.5 rounded border ${
                                isAdmin ? 'bg-white text-[#0D3671] hover:bg-slate-100 border-slate-300' : 'text-slate-300 border-slate-200 cursor-not-allowed'
                              }`}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteNews(item.id)}
                              disabled={!isAdmin}
                              className={`p-1.5 rounded border ${
                                isAdmin ? 'bg-red-50 text-[#B91C1C] hover:bg-red-100 border-red-200' : 'text-slate-300 border-slate-200 cursor-not-allowed'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Gestión de Servicios & Oferta Académica</h2>
                  <p className="text-xs text-slate-500">Configure los programas de posgrado, maestrías y diplomados.</p>
                </div>

                <button
                  onClick={() => handleOpenServiceModal()}
                  disabled={!isAdmin}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow ${
                    isAdmin 
                      ? 'bg-[#B91C1C] hover:bg-red-700 text-white cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Programa</span>
                </button>
              </div>

              {/* Services List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div key={srv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-[#B91C1C] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {srv.category}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-500">{srv.code}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{srv.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{srv.description}</p>
                      
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span>⏳ {srv.duration}</span>
                        <span>•</span>
                        <span className="font-semibold text-[#0D3671]">{srv.modality}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => handleOpenServiceModal(srv)}
                        disabled={!isAdmin}
                        className={`px-3 py-1.5 rounded text-xs font-bold border flex items-center gap-1 ${
                          isAdmin ? 'bg-[#0D3671] text-white hover:bg-[#092652]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Edit className="w-3 h-3" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => deleteService(srv.id)}
                        disabled={!isAdmin}
                        className={`p-1.5 rounded text-xs font-bold border ${
                          isAdmin ? 'bg-red-50 text-[#B91C1C] border-red-200 hover:bg-red-100' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: USERS & ROLES */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Administración de Usuarios & Roles</h2>
                  <p className="text-xs text-slate-500">Gestión de accesos: Administrador (Control Total) y Lectura (Solo Consulta).</p>
                </div>

                <button
                  onClick={() => handleOpenUserModal()}
                  disabled={!isAdmin}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow ${
                    isAdmin 
                      ? 'bg-[#0D3671] hover:bg-[#092652] text-white cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Usuario</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Usuario / Nombre</th>
                      <th className="p-3.5">Correo</th>
                      <th className="p-3.5">Rol de Acceso</th>
                      <th className="p-3.5">Estado</th>
                      <th className="p-3.5">Último Acceso</th>
                      <th className="p-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] font-mono text-slate-500">@{u.username}</div>
                        </td>
                        <td className="p-3.5 text-slate-600">{u.email}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            u.role === 'Administrador' ? 'bg-[#B91C1C] text-white' : 'bg-slate-700 text-slate-100'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 text-[11px]">{u.lastLogin || 'Nunca'}</td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {u.username.toLowerCase() === 'admin' && (
                              <button
                                onClick={() => {
                                  updateUser(u.id, { password: 'admin' });
                                  showNotification("Contraseña del usuario 'admin' restablecida a 'admin'", 'success');
                                }}
                                disabled={!isAdmin}
                                className={`p-1.5 rounded border ${
                                  isAdmin ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-300' : 'text-slate-300 border-slate-200 cursor-not-allowed'
                                }`}
                                title="Reiniciar clave de admin a 'admin'"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenUserModal(u)}
                              disabled={!isAdmin}
                              className={`p-1.5 rounded border ${
                                isAdmin ? 'bg-white text-[#0D3671] hover:bg-slate-100 border-slate-300' : 'text-slate-300 border-slate-200 cursor-not-allowed'
                              }`}
                              title="Editar usuario"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              disabled={!isAdmin || u.id === currentUser?.id}
                              className={`p-1.5 rounded border ${
                                isAdmin && u.id !== currentUser?.id
                                  ? 'bg-red-50 text-[#B91C1C] hover:bg-red-100 border-red-200' 
                                  : 'text-slate-300 border-slate-200 cursor-not-allowed'
                              }`}
                              title={u.id === currentUser?.id ? 'No puede auto-eliminarse' : 'Eliminar usuario'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Password notice */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#0D3671]" />
                  <span>Credencial de Administrador por defecto:</span>
                </div>
                <p>
                  Usuario: <code className="bg-slate-200 px-1 py-0.5 rounded font-bold text-slate-900">admin</code> | 
                  Contraseña: <code className="bg-slate-200 px-1 py-0.5 rounded font-bold text-[#B91C1C]">admin</code> (Rol Administrador con privilegios de escritura y eliminación).
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Buzón de Admisiones & Contactos</h2>
                  <p className="text-xs text-slate-500">Consultas y solicitudes enviadas desde el portal público • Tabla: <code className="text-[#0D3671] font-bold">tbl_buzon_admisiones</code></p>
                </div>
                
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                  {(['Todos', 'No leído', 'Leído', 'Respondido'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setMessageFilter(status)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        messageFilter === status
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {status} {status === 'Todos' ? `(${messages.length})` : `(${messages.filter(m => m.status === status).length})`}
                    </button>
                  ))}
                </div>
              </div>

              {messages.filter(m => messageFilter === 'Todos' || m.status === messageFilter).length === 0 ? (
                <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                  <Mail className="w-12 h-12 mx-auto mb-2 opacity-50 text-slate-400" />
                  <p className="text-sm font-medium">No hay mensajes en esta categoría.</p>
                  <p className="text-xs text-slate-400 mt-1">Cualquier consulta enviada desde el formulario público aparecerá aquí.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages
                    .filter(m => messageFilter === 'Todos' || m.status === messageFilter)
                    .map((m) => (
                      <div key={m.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.status === 'No leído' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                              m.status === 'Leído' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                              'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}>
                              {m.status}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">{m.date}</span>
                        </div>

                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-4">
                          <span className="flex items-center gap-1.5">
                            <span className="text-slate-400">Correo:</span>
                            <a href={`mailto:${m.email}`} className="text-[#0D3671] hover:underline font-medium">{m.email}</a>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-slate-400">Teléfono:</span>
                            <span className="font-medium text-slate-700">{m.phone}</span>
                          </span>
                        </div>

                        <div className="text-xs font-bold text-[#0D3671] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          Asunto: {m.subject}
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                          {m.message}
                        </p>

                        {/* Actions Toolbar */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-medium">Actualizar estado en BD:</span>
                            {m.status !== 'Leído' && (
                              <button
                                onClick={() => updateMessageStatus(m.id, 'Leído')}
                                disabled={!isAdmin}
                                className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-medium text-[11px] transition-colors"
                              >
                                Marcar Leído
                              </button>
                            )}
                            {m.status !== 'Respondido' && (
                              <button
                                onClick={() => updateMessageStatus(m.id, 'Respondido')}
                                disabled={!isAdmin}
                                className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-medium text-[11px] transition-colors"
                              >
                                Marcar Respondido
                              </button>
                            )}
                            {m.status !== 'No leído' && (
                              <button
                                onClick={() => updateMessageStatus(m.id, 'No leído')}
                                disabled={!isAdmin}
                                className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 font-medium text-[11px] transition-colors"
                              >
                                Marcar No Leído
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar de la base de datos el mensaje de "${m.name}"?`)) {
                                deleteMessage(m.id);
                              }
                            }}
                            disabled={!isAdmin}
                            className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition-colors"
                            title="Eliminar mensaje permanentemente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: DATABASE & AUDIT LOGS */}
          {activeTab === 'database' && (
            <DatabaseAuditTab onNavigateToTab={(tab) => setActiveTab(tab)} />
          )}

        </main>
      </div>

      {/* Slide Modal */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingSlideId ? 'Editar Slide 16:9' : 'Nuevo Slide para Carrusel 16:9'}
              </h3>
              <button onClick={() => setIsSlideModalOpen(false)} aria-label="Cerrar modal" className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título Principal *</label>
                <input
                  type="text"
                  required
                  value={slideFormData.title}
                  onChange={(e) => setSlideFormData({ ...slideFormData, title: e.target.value })}
                  placeholder="Ej: Excelencia Estratégica Militar"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtítulo Descriptivo</label>
                <textarea
                  rows={2}
                  value={slideFormData.subtitle}
                  onChange={(e) => setSlideFormData({ ...slideFormData, subtitle: e.target.value })}
                  placeholder="Descripción concisa que se mostrará sobre el slider..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Etiqueta Superior</label>
                  <input
                    type="text"
                    value={slideFormData.tag}
                    onChange={(e) => setSlideFormData({ ...slideFormData, tag: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Texto Botón CTA</label>
                  <input
                    type="text"
                    value={slideFormData.ctaText}
                    onChange={(e) => setSlideFormData({ ...slideFormData, ctaText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL de Imagen (Proporción 16:9)</label>
                <input
                  type="url"
                  required
                  value={slideFormData.image}
                  onChange={(e) => setSlideFormData({ ...slideFormData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="slideActive"
                  checked={slideFormData.active}
                  onChange={(e) => setSlideFormData({ ...slideFormData, active: e.target.checked })}
                  className="w-4 h-4 text-[#0D3671] rounded"
                />
                <label htmlFor="slideActive" className="font-semibold text-slate-700">Mostrar activamente en el carrusel de inicio</label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D3671] text-white rounded-lg font-bold hover:bg-[#092652]"
                >
                  Guardar Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* News Modal */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingNewsId ? 'Editar Noticia' : 'Publicar Nueva Noticia'}
              </h3>
              <button onClick={() => setIsNewsModalOpen(false)} aria-label="Cerrar modal" className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Titular de la Noticia *</label>
                <input
                  type="text"
                  required
                  value={newsFormData.title}
                  onChange={(e) => setNewsFormData({ ...newsFormData, title: e.target.value })}
                  placeholder="Ej: Graduación Ordinaria de la Maestría..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={newsFormData.category}
                    onChange={(e) => setNewsFormData({ ...newsFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Doctrina Conjunta">Doctrina Conjunta</option>
                    <option value="Defensa & Seguridad">Defensa & Seguridad</option>
                    <option value="Institucional">Institucional</option>
                    <option value="Graduaciones">Graduaciones</option>
                    <option value="Académico">Académico</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Autor / Departamento</label>
                  <input
                    type="text"
                    value={newsFormData.author}
                    onChange={(e) => setNewsFormData({ ...newsFormData, author: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resumen (Excerpt) *</label>
                <textarea
                  rows={2}
                  required
                  value={newsFormData.excerpt}
                  onChange={(e) => setNewsFormData({ ...newsFormData, excerpt: e.target.value })}
                  placeholder="Breve resumen para la tarjeta..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cuerpo Completo del Artículo *</label>
                <textarea
                  rows={4}
                  required
                  value={newsFormData.content}
                  onChange={(e) => setNewsFormData({ ...newsFormData, content: e.target.value })}
                  placeholder="Desarrollo completo de la noticia..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL de Imagen</label>
                <input
                  type="url"
                  required
                  value={newsFormData.image}
                  onChange={(e) => setNewsFormData({ ...newsFormData, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B91C1C] text-white rounded-lg font-bold hover:bg-red-700"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingServiceId ? 'Editar Programa Académico' : 'Crear Nuevo Programa'}
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)} aria-label="Cerrar modal" className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nombre del Programa *</label>
                  <input
                    type="text"
                    required
                    value={serviceFormData.title}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                    placeholder="Ej: Maestría en Ciberdefensa"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código</label>
                  <input
                    type="text"
                    required
                    value={serviceFormData.code}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Programa</label>
                  <select
                    value={serviceFormData.category}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Maestría">Maestría</option>
                    <option value="Especialidad">Especialidad</option>
                    <option value="Diplomado">Diplomado</option>
                    <option value="Curso Superior">Curso Superior</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Modalidad</label>
                  <select
                    value={serviceFormData.modality}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, modality: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Semipresencial">Semipresencial</option>
                    <option value="Virtual">Virtual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción del Programa *</label>
                <textarea
                  rows={3}
                  required
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duración</label>
                  <input
                    type="text"
                    value={serviceFormData.duration}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, duration: e.target.value })}
                    placeholder="Ej: 1 Año (3 Cuatrimestres)"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Imagen Representativa</label>
                  <input
                    type="url"
                    value={serviceFormData.image}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, image: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D3671] text-white rounded-lg font-bold hover:bg-[#092652]"
                >
                  Guardar Programa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingUserId ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} aria-label="Cerrar modal" className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre Completo y Cargo *</label>
                <input
                  type="text"
                  required
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  placeholder="Ej: Coronel Lic. Juan Martínez"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre de Usuario *</label>
                  <input
                    type="text"
                    required
                    value={userFormData.username}
                    onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value.toLowerCase() })}
                    placeholder="usuario"
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="correo@pecpffaa.edu.do"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rol en el CMS</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border rounded-lg font-bold"
                  >
                    <option value="Lectura">Lectura (Solo Consulta)</option>
                    <option value="Administrador">Administrador (Total)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estado de la Cuenta</label>
                  <select
                    value={userFormData.status}
                    onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Contraseña de Acceso</label>
                  {userFormData.username.toLowerCase() === 'admin' && (
                    <button
                      type="button"
                      onClick={() => setUserFormData({ ...userFormData, password: 'admin' })}
                      className="text-[11px] text-[#0D3671] hover:underline font-semibold"
                    >
                      Reiniciar a clave default ('admin')
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  placeholder="admin"
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0D3671] text-white rounded-lg font-bold hover:bg-[#092652]"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
