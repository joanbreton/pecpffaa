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
  DatabaseStats
} from '../types';
import { INITIAL_SLIDES, INITIAL_NEWS, INITIAL_SERVICES, INITIAL_USERS } from '../data/initialData';
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
  saveAuditLogToFirestore,
  clearAuditLogsInFirestore
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
  
  // Slide Actions
  addSlide: (slide: Omit<SlideItem, 'id'>) => boolean;
  updateSlide: (id: string, slide: Partial<SlideItem>) => boolean;
  deleteSlide: (id: string) => boolean;
  toggleSlideStatus: (id: string) => boolean;
  
  // News Actions
  addNews: (item: Omit<NewsItem, 'id' | 'views'>) => boolean;
  updateNews: (id: string, item: Partial<NewsItem>) => boolean;
  deleteNews: (id: string) => boolean;
  incrementNewsViews: (id: string) => void;
  
  // Services Actions
  addService: (item: Omit<ServiceItem, 'id'>) => boolean;
  updateService: (id: string, item: Partial<ServiceItem>) => boolean;
  deleteService: (id: string) => boolean;
  
  // User Actions
  addUser: (item: Omit<UserItem, 'id' | 'createdAt'>) => boolean;
  updateUser: (id: string, item: Partial<UserItem>) => boolean;
  deleteUser: (id: string) => boolean;
  
  // Contact Message
  sendContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => void;
  updateMessageStatus: (id: string, status: 'No leído' | 'Leído' | 'Respondido') => boolean;
  deleteMessage: (id: string) => boolean;
  
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
  clearAuditLogs: () => boolean;
  exportDatabase: () => string;
  importDatabase: (jsonContent: string) => { success: boolean; message: string };
  getDatabaseStats: () => DatabaseStats;

  // System
  resetToDefaults: () => void;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<'portal' | 'dashboard'>('portal');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedNewsModal, setSelectedNewsModal] = useState<NewsItem | null>(null);
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load database state from persistent storage or initial seeds
  const [users, setUsers] = useState<UserItem[]>(() => {
    try {
      const saved = localStorage.getItem(DB_KEYS.USERS);
      if (saved) {
        const parsed: UserItem[] = JSON.parse(saved);
        let hasChanges = false;
        const updated = parsed.map((u) => {
          if (u.username?.toLowerCase() === 'admin' && u.password !== 'admin') {
            hasChanges = true;
            return { ...u, password: 'admin' };
          }
          return u;
        });
        if (hasChanges) {
          localStorage.setItem(DB_KEYS.USERS, JSON.stringify(updated));
        }
        return updated;
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserItem | null>(() => {
    try {
      const saved = localStorage.getItem(DB_KEYS.CURRENT_USER);
      if (saved) {
        const parsed: UserItem = JSON.parse(saved);
        if (parsed.username?.toLowerCase() === 'admin' && parsed.password !== 'admin') {
          parsed.password = 'admin';
          localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(parsed));
        }
        return parsed;
      }
      return null;
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

  // Audit Logs table for database activity recording
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    return getStoredAuditLogs();
  });

  // Firebase Firestore Real-Time Cloud Synchronization
  const [firebaseSyncStatus, setFirebaseSyncStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    let isMounted = true;
    let cleanupListeners: (() => void) | undefined;

    initAndSyncFirestore({
      onSlidesUpdate: (firestoreSlides) => {
        if (isMounted && firestoreSlides.length > 0) {
          setSlides(firestoreSlides);
        }
      },
      onNewsUpdate: (firestoreNews) => {
        if (isMounted && firestoreNews.length > 0) {
          setNews(firestoreNews);
        }
      },
      onServicesUpdate: (firestoreServices) => {
        if (isMounted && firestoreServices.length > 0) {
          setServices(firestoreServices);
        }
      },
      onUsersUpdate: (firestoreUsers) => {
        if (isMounted && firestoreUsers.length > 0) {
          setUsers(firestoreUsers);
        }
      },
      onMessagesUpdate: (firestoreMessages) => {
        if (isMounted) {
          setMessages(firestoreMessages);
        }
      },
      onAuditLogsUpdate: (firestoreLogs) => {
        if (isMounted && firestoreLogs.length > 0) {
          setAuditLogs(firestoreLogs);
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

  // Automatically sync table mutations to persistent database storage
  useEffect(() => {
    try {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users to database', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } catch (e) {
      console.error('Error saving current user', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(DB_KEYS.SLIDES, JSON.stringify(slides));
    } catch (e) {
      console.error('Error saving slides to database', e);
    }
  }, [slides]);

  useEffect(() => {
    try {
      localStorage.setItem(DB_KEYS.NEWS, JSON.stringify(news));
    } catch (e) {
      console.error('Error saving news to database', e);
    }
  }, [news]);

  useEffect(() => {
    try {
      localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.error('Error saving services to database', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving messages to database', e);
    }
  }, [messages]);

  useEffect(() => {
    saveStoredAuditLogs(auditLogs);
  }, [auditLogs]);

  const showNotification = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
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
    setActiveView('portal');
    showNotification('Sesión finalizada correctamente', 'info');
  };

  // Slides CRUD with Database Audit Recording & Firebase Persistence
  const addSlide = (slide: Omit<SlideItem, 'id'>) => {
    if (!checkAdminPermission()) return false;
    const newSlide: SlideItem = {
      ...slide,
      id: 'sld-' + Date.now(),
      order: slides.length + 1
    };
    setSlides(prev => [newSlide, ...prev]);
    saveSlideToFirestore(newSlide);
    recordAuditChange(
      'Creación',
      'Slides (Carrusel)',
      newSlide.title || 'Slide sin título',
      newSlide.id,
      `Se creó un nuevo slide 16:9 con etiqueta "${newSlide.tag}" y enlace a "${newSlide.ctaText}".`,
      { slide: newSlide }
    );
    showNotification('Slide del carrusel guardado en Firebase Firestore', 'success');
    return true;
  };

  const updateSlide = (id: string, updated: Partial<SlideItem>) => {
    if (!checkAdminPermission()) return false;
    const current = slides.find(s => s.id === id);
    const updatedSlide = { ...current, ...updated } as SlideItem;
    setSlides(prev => prev.map(s => s.id === id ? updatedSlide : s));
    saveSlideToFirestore(updatedSlide);
    recordAuditChange(
      'Modificación',
      'Slides (Carrusel)',
      updated.title || current?.title || id,
      id,
      `Se actualizaron los campos del slide: ${Object.keys(updated).join(', ')}.`,
      { previous: current, updated }
    );
    showNotification('Slide actualizado y registrado en Firebase Firestore', 'success');
    return true;
  };

  const deleteSlide = (id: string) => {
    if (!checkAdminPermission()) return false;
    const current = slides.find(s => s.id === id);
    setSlides(prev => prev.filter(s => s.id !== id));
    deleteSlideFromFirestore(id);
    recordAuditChange(
      'Eliminación',
      'Slides (Carrusel)',
      current?.title || id,
      id,
      `Se eliminó permanentemente el slide del carrusel institucional de la base de datos.`,
      { deletedItem: current }
    );
    showNotification('Slide eliminado de la base de datos', 'info');
    return true;
  };

  const toggleSlideStatus = (id: string) => {
    if (!checkAdminPermission()) return false;
    const current = slides.find(s => s.id === id);
    const newStatus = !current?.active;
    setSlides(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    if (current) {
      saveSlideToFirestore({ ...current, active: newStatus });
    }
    recordAuditChange(
      'Cambio de Estado',
      'Slides (Carrusel)',
      current?.title || id,
      id,
      `Se cambió el estado del slide a ${newStatus ? 'ACTIVO (Visible)' : 'INACTIVO (Oculto)'}.`,
      { newStatus }
    );
    showNotification(`Estado del slide modificado a ${newStatus ? 'Activo' : 'Inactivo'}`, 'success');
    return true;
  };

  // News CRUD with Database Audit Recording & Firebase Persistence
  const addNews = (item: Omit<NewsItem, 'id' | 'views'>) => {
    if (!checkAdminPermission()) return false;
    const newItem: NewsItem = {
      ...item,
      id: 'not-' + Date.now(),
      views: 1,
    };
    setNews(prev => [newItem, ...prev]);
    saveNewsToFirestore(newItem);
    recordAuditChange(
      'Creación',
      'Noticias',
      newItem.title,
      newItem.id,
      `Se redactó y publicó una nueva noticia en la categoría "${newItem.category}".`,
      { news: newItem }
    );
    showNotification('Noticia guardada en Firebase Firestore', 'success');
    return true;
  };

  const updateNews = (id: string, updated: Partial<NewsItem>) => {
    if (!checkAdminPermission()) return false;
    const current = news.find(n => n.id === id);
    const updatedNews = { ...current, ...updated } as NewsItem;
    setNews(prev => prev.map(n => n.id === id ? updatedNews : n));
    saveNewsToFirestore(updatedNews);
    recordAuditChange(
      'Modificación',
      'Noticias',
      updated.title || current?.title || id,
      id,
      `Se editaron datos de la noticia: ${Object.keys(updated).join(', ')}.`,
      { previous: current, updated }
    );
    showNotification('Noticia actualizada y guardada en Firebase Firestore', 'success');
    return true;
  };

  const deleteNews = (id: string) => {
    if (!checkAdminPermission()) return false;
    const current = news.find(n => n.id === id);
    setNews(prev => prev.filter(n => n.id !== id));
    deleteNewsFromFirestore(id);
    recordAuditChange(
      'Eliminación',
      'Noticias',
      current?.title || id,
      id,
      `Se eliminó la noticia "${current?.title}" de la base de datos del portal.`,
      { deletedItem: current }
    );
    showNotification('Noticia eliminada de la base de datos', 'info');
    return true;
  };

  const incrementNewsViews = (id: string) => {
    const current = news.find(n => n.id === id);
    const updatedViews = (current?.views || 0) + 1;
    setNews(prev => prev.map(n => n.id === id ? { ...n, views: updatedViews } : n));
    incrementNewsViewsInFirestore(id, updatedViews);
  };

  // Services CRUD with Database Audit Recording & Firebase Persistence
  const addService = (item: Omit<ServiceItem, 'id'>) => {
    if (!checkAdminPermission()) return false;
    const newItem: ServiceItem = {
      ...item,
      id: 'srv-' + Date.now(),
    };
    setServices(prev => [newItem, ...prev]);
    saveServiceToFirestore(newItem);
    recordAuditChange(
      'Creación',
      'Oferta Académica',
      `${newItem.title} (${newItem.code})`,
      newItem.id,
      `Se incorporó un nuevo programa de posgrado tipo ${newItem.category} con modalidad ${newItem.modality}.`,
      { service: newItem }
    );
    showNotification('Programa académico guardado en Firebase Firestore', 'success');
    return true;
  };

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    if (!checkAdminPermission()) return false;
    const current = services.find(s => s.id === id);
    const updatedService = { ...current, ...updated } as ServiceItem;
    setServices(prev => prev.map(s => s.id === id ? updatedService : s));
    saveServiceToFirestore(updatedService);
    recordAuditChange(
      'Modificación',
      'Oferta Académica',
      updated.title || current?.title || id,
      id,
      `Se actualizaron los parámetros del programa académico: ${Object.keys(updated).join(', ')}.`,
      { previous: current, updated }
    );
    showNotification('Programa académico actualizado en Firebase Firestore', 'success');
    return true;
  };

  const deleteService = (id: string) => {
    if (!checkAdminPermission()) return false;
    const current = services.find(s => s.id === id);
    setServices(prev => prev.filter(s => s.id !== id));
    deleteServiceFromFirestore(id);
    recordAuditChange(
      'Eliminación',
      'Oferta Académica',
      current?.title || id,
      id,
      `Se eliminó el programa de posgrado "${current?.title}" de la base de datos.`,
      { deletedItem: current }
    );
    showNotification('Programa académico eliminado de la base de datos', 'info');
    return true;
  };

  // Users CRUD with Database Audit Recording & Firebase Persistence
  const addUser = (item: Omit<UserItem, 'id' | 'createdAt'>) => {
    if (!checkAdminPermission()) return false;
    const newUser: UserItem = {
      ...item,
      id: 'usr-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Pendiente de inicio'
    };
    setUsers(prev => [...prev, newUser]);
    saveUserToFirestore(newUser);
    recordAuditChange(
      'Creación',
      'Usuarios',
      `${newUser.name} (@${newUser.username})`,
      newUser.id,
      `Se creó la cuenta de usuario con rol ${newUser.role} y estado ${newUser.status}.`,
      { user: { ...newUser, password: '[PROTEGIDO]' } }
    );
    showNotification(`Usuario ${newUser.username} guardado en Firebase Firestore con rol ${newUser.role}`, 'success');
    return true;
  };

  const updateUser = (id: string, updated: Partial<UserItem>) => {
    if (!checkAdminPermission()) return false;
    const current = users.find(u => u.id === id);
    const updatedUser = { ...current, ...updated } as UserItem;
    setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    saveUserToFirestore(updatedUser);
    
    // If the updated user is currently logged in, sync currentUser in state and storage
    if (currentUser && currentUser.id === id) {
      const syncedUser = { ...currentUser, ...updated };
      setCurrentUser(syncedUser);
      try {
        localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(syncedUser));
      } catch (e) {
        console.error('Error saving current user to storage', e);
      }
    }

    recordAuditChange(
      'Modificación',
      'Usuarios',
      updated.name || current?.name || id,
      id,
      `Se modificó la configuración de cuenta de @${current?.username || id}: ${Object.keys(updated).join(', ')}.`,
      { updatedFields: Object.keys(updated) }
    );
    showNotification('Usuario modificado y guardado en Firebase Firestore', 'success');
    return true;
  };

  const deleteUser = (id: string) => {
    if (!checkAdminPermission()) return false;
    if (id === currentUser?.id) {
      showNotification('No puede eliminar su propia cuenta activa.', 'error');
      return false;
    }
    const current = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    deleteUserFromFirestore(id);
    recordAuditChange(
      'Eliminación',
      'Usuarios',
      current ? `${current.name} (@${current.username})` : id,
      id,
      `Se revocó y eliminó permanentemente el acceso del usuario de la base de datos institucional.`,
      { deletedUser: current?.username }
    );
    showNotification('Usuario eliminado y registrado en la base de datos', 'info');
    return true;
  };

  const sendContactMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      date: new Date().toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'No leído'
    };
    setMessages(prev => [newMsg, ...prev]);
    saveMessageToFirestore(newMsg);
    recordAuditChange(
      'Creación',
      'Buzón Admisiones',
      `Solicitud de: ${newMsg.name}`,
      newMsg.id,
      `Ingresó un nuevo mensaje de admisión sobre: "${newMsg.subject}" vía portal público.`
    );
    showNotification('Su solicitud ha sido registrada en la base de datos en la nube (Firestore).', 'success');
  };

  const updateMessageStatus = (id: string, status: 'No leído' | 'Leído' | 'Respondido') => {
    if (!checkAdminPermission()) return false;
    const current = messages.find(m => m.id === id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    updateMessageStatusInFirestore(id, status);
    recordAuditChange(
      'Cambio de Estado',
      'Buzón Admisiones',
      current ? `Mensaje de: ${current.name}` : id,
      id,
      `Se actualizó el estado del mensaje de admisión de "${current?.status || 'No leído'}" a "${status}".`,
      { previousStatus: current?.status, newStatus: status }
    );
    showNotification(`Mensaje marcado como "${status}" y actualizado en Firebase Firestore`, 'success');
    return true;
  };

  const deleteMessage = (id: string) => {
    if (!checkAdminPermission()) return false;
    const current = messages.find(m => m.id === id);
    setMessages(prev => prev.filter(m => m.id !== id));
    deleteMessageFromFirestore(id);
    recordAuditChange(
      'Eliminación',
      'Buzón Admisiones',
      current ? `Mensaje de: ${current.name}` : id,
      id,
      `Se eliminó la solicitud de admisión de "${current?.name}" de la base de datos.`,
      { deletedItem: current }
    );
    showNotification('Mensaje eliminado y registrado en la base de datos', 'info');
    return true;
  };

  const clearAuditLogs = () => {
    if (!checkAdminPermission()) return false;
    clearAuditLogsInFirestore(auditLogs);
    setAuditLogs([]);
    saveStoredAuditLogs([]);
    showNotification('Historial de auditoría de Firebase Firestore vaciado', 'info');
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

  const importDatabase = (jsonContent: string): { success: boolean; message: string } => {
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
        `Se restauró la base de datos completa con ${parsed.tables.slides?.length || 0} slides, ${parsed.tables.news?.length || 0} noticias y ${parsed.tables.services?.length || 0} carreras.`
      );
      
      const combinedLogs = [restoreLog, ...newLogs];
      setAuditLogs(combinedLogs);
      saveStoredAuditLogs(combinedLogs);

      // Push restored data to Firebase Firestore
      if (Array.isArray(parsed.tables.slides)) {
        for (const s of parsed.tables.slides) saveSlideToFirestore(s);
      }
      if (Array.isArray(parsed.tables.news)) {
        for (const n of parsed.tables.news) saveNewsToFirestore(n);
      }
      if (Array.isArray(parsed.tables.services)) {
        for (const s of parsed.tables.services) saveServiceToFirestore(s);
      }
      if (Array.isArray(parsed.tables.users)) {
        for (const u of parsed.tables.users) saveUserToFirestore(u);
      }
      if (Array.isArray(parsed.tables.messages)) {
        for (const m of parsed.tables.messages) saveMessageToFirestore(m);
      }

      showNotification('Base de datos restaurada y sincronizada con Firebase Firestore', 'success');
      return { success: true, message: 'Base de datos restaurada con éxito.' };
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

  const resetToDefaults = () => {
    if (!checkAdminPermission()) return;
    setUsers(INITIAL_USERS);
    setSlides(INITIAL_SLIDES);
    setNews(INITIAL_NEWS);
    setServices(INITIAL_SERVICES);
    setMessages([]);

    // Reseed Firebase Firestore with initial records
    for (const s of INITIAL_SLIDES) saveSlideToFirestore(s);
    for (const n of INITIAL_NEWS) saveNewsToFirestore(n);
    for (const s of INITIAL_SERVICES) saveServiceToFirestore(s);
    for (const u of INITIAL_USERS) saveUserToFirestore(u);

    recordAuditChange(
      'Restauración BD',
      'Base de Datos',
      'Restauración a Valores de Fábrica',
      `rst-def-${Date.now()}`,
      'Se restablecieron los datos predeterminados en todas las tablas institucionales y Firebase Firestore.'
    );
    showNotification('Datos de fábrica restaurados y guardados en Firebase Firestore', 'success');
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
        addSlide,
        updateSlide,
        deleteSlide,
        toggleSlideStatus,
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
