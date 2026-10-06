import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  SlideItem, 
  NewsItem, 
  ServiceItem, 
  UserItem, 
  ContactMessage,
  AuditLogEntry,
  AuditAction,
  CMSModule,
  DatabaseStats,
  DirectorData
} from '../types';
import { 
  INITIAL_SLIDES, 
  INITIAL_NEWS, 
  INITIAL_SERVICES, 
  INITIAL_USERS,
  INITIAL_DIRECTOR_DATA 
} from '../data/initialData';
import { 
  DB_KEYS, 
  createAuditLog, 
  getStoredAuditLogs, 
  saveStoredAuditLogs, 
  computeDatabaseStats, 
  generateDatabaseExport 
} from '../db/database';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  initAndSyncFirestore,
  saveSlideToFirestore,
  deleteSlideFromFirestore,
  saveNewsToFirestore,
  deleteNewsFromFirestore,
  incrementNewsViewsInFirestore,
  saveServiceToFirestore,
  deleteServiceFromFirestore,
  saveMessageToFirestore,
  updateMessageStatusInFirestore,
  deleteMessageFromFirestore,
  saveUserToFirestore,
  deleteUserFromFirestore,
  saveDirectorToFirestore,
  saveAuditLogToFirestore,
  clearAuditLogsInFirestore,
  resetFirestoreToDefaults,
  importDataToFirestore
} from '../firebase/firestoreService';

interface AppContextType {
  // Cloud Database Status
  firebaseSyncStatus: 'connecting' | 'connected' | 'error';
  firebaseProjectId: string;

  // Navigation & Modals
  activeView: 'portal' | 'dashboard';
  setActiveView: (view: 'portal' | 'dashboard') => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isDirectorModalOpen: boolean;
  setIsDirectorModalOpen: (open: boolean) => void;
  selectedNewsModal: NewsItem | null;
  setSelectedNewsModal: (news: NewsItem | null) => void;
  selectedServiceModal: ServiceItem | null;
  setSelectedServiceModal: (service: ServiceItem | null) => void;
  
  // Auth & Session
  currentUser: UserItem | null;
  login: (userOrUsername: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  
  // CMS CRUD & Data
  slides: SlideItem[];
  news: NewsItem[];
  services: ServiceItem[];
  users: UserItem[];
  messages: ContactMessage[];
  directorData: DirectorData;
  updateDirectorData: (data: Partial<DirectorData>) => Promise<boolean>;
  resetDirectorData: () => Promise<boolean>;
  
  // Slide Actions
  addSlide: (slide: Omit<SlideItem, 'id'>) => Promise<boolean>;
  updateSlide: (id: string, slide: Partial<SlideItem>) => Promise<boolean>;
  deleteSlide: (id: string) => Promise<boolean>;
  toggleSlideStatus: (id: string) => Promise<boolean>;
  toggleSlideTextContainer: (id: string) => Promise<boolean>;
  
  // News Actions
  addNews: (item: Omit<NewsItem, 'id' | 'views'>) => Promise<boolean>;
  updateNews: (id: string, item: Partial<NewsItem>) => Promise<boolean>;
  deleteNews: (id: string) => Promise<boolean>;
  incrementNewsViews: (id: string) => void;
  
  // Services Actions
  addService: (item: Omit<ServiceItem, 'id'>) => Promise<boolean>;
  updateService: (id: string, item: Partial<ServiceItem>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  
  // User Actions
  addUser: (item: Omit<UserItem, 'id' | 'createdAt'>) => Promise<boolean>;
  updateUser: (id: string, item: Partial<UserItem>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  
  // Contact Message
  sendContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => Promise<void>;
  updateMessageStatus: (id: string, status: 'No leído' | 'Leído' | 'Respondido') => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
  
  // Database & Audit Log
  auditLogs: AuditLogEntry[];
  recordAuditChange: (
    action: AuditAction, 
    module: CMSModule, 
    itemTitle: string, 
    itemId: string, 
    details: string, 
    snapshot?: Record<string, unknown>
  ) => void;
  clearAuditLogs: () => Promise<boolean>;
  exportDatabase: () => string;
  importDatabase: (jsonContent: string) => Promise<{ success: boolean; message: string }>;
  getDatabaseStats: () => DatabaseStats;

  // System
  resetToDefaults: () => Promise<void>;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Instant cross-tab broadcast for browsers running multiple tabs
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('pecpffaa_multi_browser_sync') 
  : null;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<'portal' | 'dashboard'>('portal');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);
  const [selectedNewsModal, setSelectedNewsModal] = useState<NewsItem | null>(null);
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load database state from persistent cache or initial seeds
  const [users, setUsers] = useState<UserItem[]>(() => {
    try {
      const saved = localStorage.getItem(DB_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserItem | null>(() => {
    try {
      const saved = localStorage.getItem(DB_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [slides, setSlides] = useState<SlideItem[]>(() => {
    try {
      const saved = localStorage.getItem(DB_KEYS.SLIDES);
      return saved ? JSON.parse(saved) : INITIAL_SLIDES;
    } catch {
      return INITIAL_SLIDES;
    }
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem(DB_KEYS.NEWS);
      return saved ? JSON.parse(saved) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(DB_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(DB_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [directorData, setDirectorData] = useState<DirectorData>(() => {
    try {
      const saved = localStorage.getItem(DB_KEYS.DIRECTOR);
      return saved ? JSON.parse(saved) : INITIAL_DIRECTOR_DATA;
    } catch {
      return INITIAL_DIRECTOR_DATA;
    }
  });

  // Audit Logs table for database activity recording
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    return getStoredAuditLogs();
  });

  // Firebase Firestore Real-Time Cloud Synchronization
  const [firebaseSyncStatus, setFirebaseSyncStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  // Multi-tab synchronization handler
  useEffect(() => {
    if (!syncChannel) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CLOUD_REFRESH') {
        // Re-read local storage cache if another tab in this browser updated it
        try {
          const s = localStorage.getItem(DB_KEYS.SLIDES);
          if (s) setSlides(JSON.parse(s));
          const n = localStorage.getItem(DB_KEYS.NEWS);
          if (n) setNews(JSON.parse(n));
          const srv = localStorage.getItem(DB_KEYS.SERVICES);
          if (srv) setServices(JSON.parse(srv));
          const u = localStorage.getItem(DB_KEYS.USERS);
          if (u) setUsers(JSON.parse(u));
          const m = localStorage.getItem(DB_KEYS.MESSAGES);
          if (m) setMessages(JSON.parse(m));
          const d = localStorage.getItem(DB_KEYS.DIRECTOR);
          if (d) setDirectorData(JSON.parse(d));
        } catch (e) {
          console.error('Error syncing tab state', e);
        }
      }
    };

    syncChannel.addEventListener('message', handleMessage);
    return () => {
      syncChannel.removeEventListener('message', handleMessage);
    };
  }, []);

  // Real-time synchronization with Google Cloud Firebase Firestore
  useEffect(() => {
    let isMounted = true;
    let cleanupListeners: (() => void) | undefined;

    initAndSyncFirestore({
      onSlidesUpdate: (firestoreSlides) => {
        if (isMounted) {
          setSlides(firestoreSlides);
          try {
            localStorage.setItem(DB_KEYS.SLIDES, JSON.stringify(firestoreSlides));
          } catch (e) {
            console.error('Error saving slides cache', e);
          }
        }
      },
      onNewsUpdate: (firestoreNews) => {
        if (isMounted) {
          setNews(firestoreNews);
          try {
            localStorage.setItem(DB_KEYS.NEWS, JSON.stringify(firestoreNews));
          } catch (e) {
            console.error('Error saving news cache', e);
          }
        }
      },
      onServicesUpdate: (firestoreServices) => {
        if (isMounted) {
          setServices(firestoreServices);
          try {
            localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(firestoreServices));
          } catch (e) {
            console.error('Error saving services cache', e);
          }
        }
      },
      onUsersUpdate: (firestoreUsers) => {
        if (isMounted) {
          setUsers(firestoreUsers);
          try {
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(firestoreUsers));
          } catch (e) {
            console.error('Error saving users cache', e);
          }
        }
      },
      onMessagesUpdate: (firestoreMessages) => {
        if (isMounted) {
          setMessages(firestoreMessages);
          try {
            localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(firestoreMessages));
          } catch (e) {
            console.error('Error saving messages cache', e);
          }
        }
      },
      onDirectorUpdate: (firestoreDirector) => {
        if (isMounted && firestoreDirector) {
          setDirectorData(firestoreDirector);
          try {
            localStorage.setItem(DB_KEYS.DIRECTOR, JSON.stringify(firestoreDirector));
          } catch (e) {
            console.error('Error saving director cache', e);
          }
        }
      },
      onAuditLogsUpdate: (firestoreLogs) => {
        if (isMounted && firestoreLogs.length > 0) {
          setAuditLogs(firestoreLogs);
          saveStoredAuditLogs(firestoreLogs);
        }
      },
      onSyncStatusChange: (status) => {
        if (isMounted) {
          setFirebaseSyncStatus(status);
        }
      }
    }).then((unsub) => {
      cleanupListeners = unsub;
    }).catch((err) => {
      console.warn('Firebase Firestore init notice:', err);
      if (isMounted) setFirebaseSyncStatus('error');
    });

    return () => {
      isMounted = false;
      if (cleanupListeners) cleanupListeners();
    };
  }, []);

  const notifyCrossTab = () => {
    try {
      syncChannel?.postMessage({ type: 'CLOUD_REFRESH', timestamp: Date.now() });
    } catch {
      // ignore
    }
  };

  const showNotification = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Internal function to log any administrative change to the database
  const recordAuditChange = useCallback((
    action: AuditAction, 
    module: CMSModule, 
    itemTitle: string, 
    itemId: string, 
    details: string, 
    snapshot?: Record<string, unknown>
  ) => {
    const userName = currentUser ? `${currentUser.name} (@${currentUser.username})` : 'Administrador del Sistema';
    const userRole = currentUser?.role || 'Administrador';
    const newEntry = createAuditLog(userName, userRole, action, module, itemTitle, itemId, details, snapshot);
    setAuditLogs(prev => {
      const updated = [newEntry, ...prev];
      saveStoredAuditLogs(updated);
      return updated;
    });

    try {
      localStorage.setItem(DB_KEYS.DB_META, JSON.stringify({
        lastCommitted: new Date().toISOString(),
        lastTransactionId: newEntry.id,
        action,
        module,
        itemTitle
      }));
    } catch (e) {
      console.error('Error saving DB metadata', e);
    }

    // Persist audit log entry directly to Firebase Firestore
    saveAuditLogToFirestore(newEntry);
  }, [currentUser]);

  const checkAdminPermission = (): boolean => {
    if (!currentUser) {
      showNotification('Debe iniciar sesión para realizar cambios.', 'error');
      setIsLoginModalOpen(true);
      return false;
    }
    if (currentUser.role !== 'Administrador') {
      showNotification('Modo Lectura: Su rol sólo tiene permisos de visualización en el CMS.', 'info');
      return false;
    }
    return true;
  };

  const login = (usernameOrEmail: string, pass: string) => {
    const cleanUser = usernameOrEmail.trim().toLowerCase();
    const cleanPass = pass.trim();

    const matched = users.find(
      (u) => (u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser) && u.password === cleanPass
    );

    if (matched) {
      if (matched.status === 'Inactivo') {
        return { success: false, message: 'Usuario inactivo. Contacte al Administrador.' };
      }
      const updatedUser = { ...matched, lastLogin: 'Hace un momento' };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === matched.id ? updatedUser : u));
      try {
        localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
      } catch (e) {
        console.error(e);
      }
      saveUserToFirestore(updatedUser);
      setIsLoginModalOpen(false);
      showNotification(`Bienvenido, ${matched.name} (${matched.role})`, 'success');
      
      // Log login event in audit trail
      recordAuditChange(
        'Modificación',
        'Usuarios',
        `Inicio de sesión: ${matched.name}`,
        matched.id,
        `El usuario @${matched.username} (${matched.role}) inició sesión en el panel administrativo.`
      );

      return { success: true, message: 'Acceso autorizado' };
    }

    return { success: false, message: 'Credenciales inválidas. Verifique usuario o contraseña.' };
  };

  const logout = () => {
    if (currentUser) {
      recordAuditChange(
        'Modificación',
        'Usuarios',
        `Cierre de sesión: ${currentUser.name}`,
        currentUser.id,
        `El usuario @${currentUser.username} cerró su sesión administrativa.`
      );
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem(DB_KEYS.CURRENT_USER);
    } catch (e) {
      console.error(e);
    }
    setActiveView('portal');
    showNotification('Sesión finalizada correctamente', 'info');
  };

  // Slides CRUD with Database Audit Recording & Real-Time Firebase Persistence
  const addSlide = async (slide: Omit<SlideItem, 'id'>): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const newSlide: SlideItem = {
      ...slide,
      id: 'sld-' + Date.now(),
      order: slides.length + 1
    };
    
    // Optimistic UI update
    setSlides(prev => [newSlide, ...prev]);
    
    // Save to Firestore Cloud Database
    const savedOk = await saveSlideToFirestore(newSlide);
    if (!savedOk) {
      showNotification('Aviso: Guardado localmente, sincronizando con Firestore...', 'info');
    } else {
      showNotification('Slide guardado y sincronizado con Firebase Firestore en todos los navegadores', 'success');
    }

    recordAuditChange(
      'Creación',
      'Slides (Carrusel)',
      newSlide.title || 'Slide sin título',
      newSlide.id,
      `Se creó un nuevo slide 16:9 con etiqueta "${newSlide.tag}" y enlace a "${newSlide.ctaText}".`,
      { slide: newSlide }
    );
    notifyCrossTab();
    return true;
  };

  const updateSlide = async (id: string, updated: Partial<SlideItem>): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const current = slides.find(s => s.id === id);
    const updatedSlide: SlideItem = {
      ...(current || {}),
      ...updated,
      id
    } as SlideItem;

    setSlides(prev => prev.map(s => s.id === id ? updatedSlide : s));
    
    const savedOk = await saveSlideToFirestore(updatedSlide);
    if (!savedOk) {
      showNotification('Aviso: Guardado localmente, sincronizando con Firestore...', 'info');
    } else {
      showNotification('Slide actualizado en Firebase Firestore (visible en todos los navegadores)', 'success');
    }

    recordAuditChange(
      'Modificación',
      'Slides (Carrusel)',
      updated.title || current?.title || id,
      id,
      `Se actualizaron los campos del slide: ${Object.keys(updated).join(', ')}.`,
      { previous: current, updated }
    );
    notifyCrossTab();
    return true;
  };

  const deleteSlide = async (id: string): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const current = slides.find(s => s.id === id);
    setSlides(prev => prev.filter(s => s.id !== id));
    
    await deleteSlideFromFirestore(id);
    showNotification('Slide eliminado de la base de datos Firestore', 'info');

    recordAuditChange(
      'Eliminación',
      'Slides (Carrusel)',
      current?.title || id,
      id,
      `Se eliminó permanentemente el slide del carrusel institucional de la base de datos.`,
      { deletedItem: current }
    );
    notifyCrossTab();
    return true;
  };

  const toggleSlideStatus = async (id: string): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const current = slides.find(s => s.id === id);
    if (!current) return false;
    const newStatus = !current.active;
    const updatedSlide: SlideItem = { ...current, active: newStatus, id };
    
    setSlides(prev => prev.map(s => s.id === id ? updatedSlide : s));
    await saveSlideToFirestore(updatedSlide);

    recordAuditChange(
      'Cambio de Estado',
      'Slides (Carrusel)',
      current.title || id,
      id,
      `Se cambió el estado del slide a ${newStatus ? 'ACTIVO (Visible)' : 'INACTIVO (Oculto)'}.`,
      { newStatus }
    );
    showNotification(`Slide marcado como ${newStatus ? 'Activo' : 'Inactivo'} en Firestore`, 'success');
    notifyCrossTab();
    return true;
  };

  const toggleSlideTextContainer = async (id: string): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const current = slides.find(s => s.id === id);
    if (!current) return false;
    const newStatus = current.showTextContainer === false;
    const updatedSlide: SlideItem = { ...current, showTextContainer: newStatus, id };
    
    setSlides(prev => prev.map(s => s.id === id ? updatedSlide : s));
    await saveSlideToFirestore(updatedSlide);

    recordAuditChange(
      'Modificación',
      'Slides (Carrusel)',
      current.title || id,
      id,
      `Se ${newStatus ? 'activó' : 'desactivó'} el contenedor de textos del slide en el HeroCarousel.`,
      { showTextContainer: newStatus }
    );
    showNotification(`Contenedor de textos ${newStatus ? 'activado' : 'desactivado'} en Firestore`, 'info');
    notifyCrossTab();
    return true;
  };

  // News CRUD with Database Audit Recording & Real-Time Firebase Persistence
  const addNews = async (item: Omit<NewsItem, 'id' | 'views'>): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const newItem: NewsItem = {
      ...item,
      id: 'not-' + Date.now(),
      views: 1,
    };
    setNews(prev => [newItem, ...prev]);
    
    const savedOk = await saveNewsToFirestore(newItem);
    if (!savedOk) {
      showNotification('Aviso: Guardado localmente, sincronizando con Firestore...', 'info');
    } else {
      showNotification('Noticia publicada en Firebase Firestore para todos los navegadores', 'success');
    }

    recordAuditChange(
      'Creación',
      'Noticias',
      newItem.title,
      newItem.id,
      `Se redactó y publicó una nueva noticia en la categoría "${newItem.category}".`,
      { news: newItem }
    );
    notifyCrossTab();
    return true;
  };

  const updateNews = async (id: string, updated: Partial<NewsItem>): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const current = news.find(n => n.id === id);
    const updatedNews: NewsItem = {
      ...(current || {}),
      ...updated,
      id
    } as NewsItem;

    setNews(prev => prev.map(n => n.id === id ? updatedNews : n));
    
    const savedOk = await saveNewsToFirestore(updatedNews);
    if (!savedOk) {
      showNotification('Aviso: Guardado localmente, sincronizando con Firestore...', 'info');
    } else {
      showNotification('Noticia actualizada en Firebase Firestore (visible en todos los navegadores)', 'success');
    }

    recordAuditChange(
      'Modificación',
      'Noticias',
      updated.title || current?.title || id,
      id,
      `Se editaron datos de la noticia: ${Object.keys(updated).join(', ')}.`,
      { previous: current, updated }
    );
    notifyCrossTab();
    return true;
  };

  const deleteNews = async (id: string): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const current = news.find(n => n.id === id);
    setNews(prev => prev.filter(n => n.id !== id));
    
    await deleteNewsFromFirestore(id);
    showNotification('Noticia eliminada de la base de datos Firestore', 'info');

    recordAuditChange(
      'Eliminación',
      'Noticias',
      current?.title || id,
      id,
      `Se eliminó la noticia "${current?.title}" de la base de datos del portal.`,
      { deletedItem: current }
    );
    notifyCrossTab();
    return true;
  };

  const incrementNewsViews = (id: string) => {
    const current = news.find(n => n.id === id);
    const updatedViews = (current?.views || 0) + 1;
    setNews(prev => prev.map(n => n.id === id ? { ...n, views: updatedViews } : n));
    incrementNewsViewsInFirestore(id, updatedViews);
  };

  // Services CRUD with Database Audit Recording & Real-Time Firebase Persistence
  const addService = async (item: Omit<ServiceItem, 'id'>): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const newItem: ServiceItem = {
      ...item,
      id: 'srv-' + Date.now(),
    };
    setServices(prev => [newItem, ...prev]);
    
    const savedOk = await saveServiceToFirestore(newItem);
    if (!savedOk) {
      showNotification('Aviso: Guardado localmente, sincronizando con Firestore...', 'info');
    } else {
      showNotification('Programa académico guardado en Firebase Firestore para todos los navegadores', 'success');
    }

    recordAuditChange(
      'Creación',
      'Oferta Académica',
      `${newItem.title} (${newItem.code})`,
      newItem.id,
      `Se incorporó un nuevo programa de posgrado tipo ${newItem.category} con modalidad ${newItem.modality}.`,
      { service: newItem }
    );
    notifyCrossTab();
    return true;
  };

  const updateService = async (id: string, updated: Partial<ServiceItem>): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const current = services.find(s => s.id === id);
    const updatedService: ServiceItem = {
      ...(current || {}),
      ...updated,
      id
    } as ServiceItem;

    setServices(prev => prev.map(s => s.id === id ? updatedService : s));
    
    const savedOk = await saveServiceToFirestore(updatedService);
    if (!savedOk) {
      showNotification('Aviso: Guardado localmente, sincronizando con Firestore...', 'info');
    } else {
      showNotification('Programa académico actualizado en Firestore (visible en todos los navegadores)', 'success');
    }

    recordAuditChange(
      'Modificación',
      'Oferta Académica',
      updated.title || current?.title || id,
      id,
      `Se actualizaron los parámetros del programa académico: ${Object.keys(updated).join(', ')}.`,
      { previous: current, updated }
    );
    notifyCrossTab();
    return true;
  };

  const deleteService = async (id: string): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const current = services.find(s => s.id === id);
    setServices(prev => prev.filter(s => s.id !== id));
    
    await deleteServiceFromFirestore(id);
    showNotification('Programa académico eliminado de Firestore', 'info');

    recordAuditChange(
      'Eliminación',
      'Oferta Académica',
      current?.title || id,
      id,
      `Se eliminó el programa de posgrado "${current?.title}" de la base de datos.`,
      { deletedItem: current }
    );
    notifyCrossTab();
    return true;
  };

  // Users CRUD with Database Audit Recording & Real-Time Firebase Persistence
  const addUser = async (item: Omit<UserItem, 'id' | 'createdAt'>): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const newUser: UserItem = {
      ...item,
      id: 'usr-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Pendiente de inicio'
    };
    setUsers(prev => [...prev, newUser]);
    
    const savedOk = await saveUserToFirestore(newUser);
    if (!savedOk) {
      showNotification('Aviso: Guardado localmente, sincronizando con Firestore...', 'info');
    } else {
      showNotification(`Usuario ${newUser.username} guardado en Firestore (disponible en todos los navegadores)`, 'success');
    }

    recordAuditChange(
      'Creación',
      'Usuarios',
      `${newUser.name} (@${newUser.username})`,
      newUser.id,
      `Se creó la cuenta de usuario con rol ${newUser.role} y estado ${newUser.status}.`,
      { user: { ...newUser, password: '[PROTEGIDO]' } }
    );
    notifyCrossTab();
    return true;
  };

  const updateUser = async (id: string, updated: Partial<UserItem>): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const current = users.find(u => u.id === id);
    const updatedUser: UserItem = {
      ...(current || {}),
      ...updated,
      id
    } as UserItem;

    setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    
    // If the updated user is currently logged in, sync currentUser in state and storage
    if (currentUser && currentUser.id === id) {
      const syncedUser = { ...currentUser, ...updated, id };
      setCurrentUser(syncedUser);
      try {
        localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(syncedUser));
      } catch (e) {
        console.error('Error saving current user to storage', e);
      }
    }

    const savedOk = await saveUserToFirestore(updatedUser);
    if (!savedOk) {
      showNotification('Aviso: Guardado localmente, sincronizando con Firestore...', 'info');
    } else {
      showNotification('Usuario modificado en Firebase Firestore', 'success');
    }

    recordAuditChange(
      'Modificación',
      'Usuarios',
      updated.name || current?.name || id,
      id,
      `Se modificó la cuenta de @${current?.username || id}: ${Object.keys(updated).join(', ')}.`,
      { updatedFields: Object.keys(updated) }
    );
    notifyCrossTab();
    return true;
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    if (id === currentUser?.id) {
      showNotification('No puede eliminar su propia cuenta activa.', 'error');
      return false;
    }
    const current = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    
    await deleteUserFromFirestore(id);
    showNotification('Usuario eliminado de la base de datos Firestore', 'info');

    recordAuditChange(
      'Eliminación',
      'Usuarios',
      current ? `${current.name} (@${current.username})` : id,
      id,
      `Se revocó el acceso del usuario en la base de datos institucional.`,
      { deletedUser: current?.username }
    );
    notifyCrossTab();
    return true;
  };

  const sendContactMessage = async (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      date: new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'No leído'
    };
    setMessages(prev => [newMsg, ...prev]);
    await saveMessageToFirestore(newMsg);
    
    recordAuditChange(
      'Creación',
      'Buzón Admisiones',
      `Solicitud de: ${newMsg.name}`,
      newMsg.id,
      `Ingresó un nuevo mensaje de admisión sobre: "${newMsg.subject}" vía portal público.`
    );
    showNotification('Su solicitud ha sido registrada en la base de datos en la nube (Firestore).', 'success');
    notifyCrossTab();
  };

  const updateMessageStatus = async (id: string, status: 'No leído' | 'Leído' | 'Respondido'): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const current = messages.find(m => m.id === id);
    const updated = current ? { ...current, status, id } : null;
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    
    await updateMessageStatusInFirestore(id, status);
    
    recordAuditChange(
      'Cambio de Estado',
      'Buzón Admisiones',
      current ? `Mensaje de: ${current.name}` : id,
      id,
      `Se actualizó el estado del mensaje de admisión a "${status}".`,
      { previousStatus: current?.status, newStatus: status }
    );
    showNotification(`Mensaje marcado como "${status}" y actualizado en Firestore`, 'success');
    notifyCrossTab();
    return true;
  };

  const deleteMessage = async (id: string): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    const current = messages.find(m => m.id === id);
    setMessages(prev => prev.filter(m => m.id !== id));
    
    await deleteMessageFromFirestore(id);
    
    recordAuditChange(
      'Eliminación',
      'Buzón Admisiones',
      current ? `Mensaje de: ${current.name}` : id,
      id,
      `Se eliminó la solicitud de admisión de "${current?.name}" de la base de datos.`,
      { deletedItem: current }
    );
    showNotification('Mensaje eliminado de la base de datos Firestore', 'info');
    notifyCrossTab();
    return true;
  };

  const clearAuditLogs = async (): Promise<boolean> => {
    if (!checkAdminPermission()) return false;
    setAuditLogs([]);
    saveStoredAuditLogs([]);
    await clearAuditLogsInFirestore();
    showNotification('Historial de auditoría de Firebase Firestore vaciado', 'info');
    notifyCrossTab();
    return true;
  };

  const exportDatabase = (): string => {
    const exported = generateDatabaseExport(slides, news, services, users, messages, auditLogs);
    recordAuditChange(
      'Modificación',
      'Base de Datos',
      'Exportación Completa de BD',
      `exp-${Date.now()}`,
      'El administrador generó y descargó un respaldo íntegro de la base de datos institucional.'
    );
    return exported;
  };

  const importDatabase = async (jsonContent: string): Promise<{ success: boolean; message: string }> => {
    if (!checkAdminPermission()) return { success: false, message: 'Permiso denegado: requiere rol Administrador' };
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed.tables) {
        return { success: false, message: 'Estructura inválida: Falta la propiedad "tables" en el JSON.' };
      }
      if (Array.isArray(parsed.tables.slides)) setSlides(parsed.tables.slides);
      if (Array.isArray(parsed.tables.news)) setNews(parsed.tables.news);
      if (Array.isArray(parsed.tables.services)) setServices(parsed.tables.services);
      if (Array.isArray(parsed.tables.users)) setUsers(parsed.tables.users);
      if (Array.isArray(parsed.tables.messages)) setMessages(parsed.tables.messages);
      
      const newLogs = Array.isArray(parsed.tables.auditLogs) ? parsed.tables.auditLogs : [];
      const restoreLog = createAuditLog(
        currentUser ? `${currentUser.name} (@${currentUser.username})` : 'Administrador',
        currentUser?.role || 'Administrador',
        'Restauración BD',
        'Base de Datos',
        'Restauración desde Archivo JSON',
        `rst-${Date.now()}`,
        `Se restauró la base de datos completa con ${parsed.tables.slides?.length || 0} slides, ${parsed.tables.news?.length || 0} noticias y ${parsed.tables.services?.length || 0} programas.`
      );
      
      const combinedLogs = [restoreLog, ...newLogs];
      setAuditLogs(combinedLogs);
      saveStoredAuditLogs(combinedLogs);

      // Persist restored collections to Firebase Firestore
      await importDataToFirestore({
        slides: parsed.tables.slides,
        news: parsed.tables.news,
        services: parsed.tables.services,
        users: parsed.tables.users,
        messages: parsed.tables.messages,
        auditLogs: combinedLogs
      });

      showNotification('Base de datos restaurada y sincronizada con Firebase Firestore para todos los navegadores', 'success');
      notifyCrossTab();
      return { success: true, message: 'Base de datos restaurada con éxito en Firestore.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido de parseo';
      return { success: false, message: `Error al procesar el archivo: ${msg}` };
    }
  };

  const getDatabaseStats = (): DatabaseStats => {
    const base = computeDatabaseStats(slides, news, services, users, messages, auditLogs);
    return {
      ...base,
      cloudProvider: 'Firebase Cloud Firestore',
      cloudDatabase: `${firebaseConfig.projectId} [${(firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId || '(default)'}]`,
      cloudStatus: firebaseSyncStatus
    };
  };

  const resetToDefaults = async () => {
    if (!checkAdminPermission()) return;
    setUsers(INITIAL_USERS);
    setSlides(INITIAL_SLIDES);
    setNews(INITIAL_NEWS);
    setServices(INITIAL_SERVICES);
    setMessages([]);

    await resetFirestoreToDefaults();

    recordAuditChange(
      'Restauración BD',
      'Base de Datos',
      'Restauración a Valores de Fábrica',
      `rst-def-${Date.now()}`,
      'Se restablecieron los datos predeterminados en todas las tablas institucionales y Firebase Firestore.'
    );
    showNotification('Datos de fábrica restaurados y guardados en Firebase Firestore para todos los navegadores', 'success');
    notifyCrossTab();
  };

  // Director Office CMS Actions
  const updateDirectorData = async (data: Partial<DirectorData>): Promise<boolean> => {
    const updated: DirectorData = {
      ...directorData,
      ...data,
      id: 'general',
      updatedAt: new Date().toISOString()
    };

    setDirectorData(updated);
    try {
      localStorage.setItem(DB_KEYS.DIRECTOR, JSON.stringify(updated));
    } catch (e) {
      console.error('Error caching director info', e);
    }
    notifyCrossTab();

    const success = await saveDirectorToFirestore(updated);

    recordAuditChange(
      'Modificación',
      'Despacho del Director',
      'Información y Perfil del Director General',
      'general',
      `Actualización integral del Despacho del Director (${updated.name}) en el CMS.`
    );

    if (success) {
      showNotification('Información del Despacho guardada en Firebase Firestore', 'success');
    } else {
      showNotification('Cambios guardados localmente (sin conexión)', 'info');
    }

    return true;
  };

  const resetDirectorData = async (): Promise<boolean> => {
    setDirectorData(INITIAL_DIRECTOR_DATA);
    try {
      localStorage.setItem(DB_KEYS.DIRECTOR, JSON.stringify(INITIAL_DIRECTOR_DATA));
    } catch (e) {
      console.error('Error resetting director info', e);
    }
    notifyCrossTab();

    const success = await saveDirectorToFirestore(INITIAL_DIRECTOR_DATA);
    recordAuditChange(
      'Modificación',
      'Despacho del Director',
      'Restablecimiento de Ficha del Despacho',
      'general',
      'Restablecimiento de los datos del Despacho del Director a los valores oficiales por defecto.'
    );

    showNotification('Despacho del Director restablecido a valores iniciales', 'success');
    return success;
  };

  return (
    <AppContext.Provider
      value={{
        firebaseSyncStatus,
        firebaseProjectId: firebaseConfig.projectId,
        activeView,
        setActiveView,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isDirectorModalOpen,
        setIsDirectorModalOpen,
        selectedNewsModal,
        setSelectedNewsModal,
        selectedServiceModal,
        setSelectedServiceModal,
        currentUser,
        login,
        logout,
        slides,
        news,
        services,
        users,
        messages,
        directorData,
        updateDirectorData,
        resetDirectorData,
        addSlide,
        updateSlide,
        deleteSlide,
        toggleSlideStatus,
        toggleSlideTextContainer,
        addNews,
        updateNews,
        deleteNews,
        incrementNewsViews,
        addService,
        updateService,
        deleteService,
        addUser,
        updateUser,
        deleteUser,
        sendContactMessage,
        updateMessageStatus,
        deleteMessage,
        auditLogs,
        recordAuditChange,
        clearAuditLogs,
        exportDatabase,
        importDatabase,
        getDatabaseStats,
        resetToDefaults,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
