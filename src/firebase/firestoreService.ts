import { 
  db, 
  COLLECTIONS, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  deleteDoc, 
  updateDoc 
} from './config';
import { 
  SlideItem, 
  NewsItem, 
  ServiceItem, 
  UserItem, 
  ContactMessage, 
  AuditLogEntry 
} from '../types';
import { 
  INITIAL_SLIDES, 
  INITIAL_NEWS, 
  INITIAL_SERVICES, 
  INITIAL_USERS 
} from '../data/initialData';

export interface FirestoreSyncCallbacks {
  onSlidesUpdate?: (slides: SlideItem[]) => void;
  onNewsUpdate?: (news: NewsItem[]) => void;
  onServicesUpdate?: (services: ServiceItem[]) => void;
  onUsersUpdate?: (users: UserItem[]) => void;
  onMessagesUpdate?: (messages: ContactMessage[]) => void;
  onAuditLogsUpdate?: (logs: AuditLogEntry[]) => void;
  onSyncStatusChange?: (status: 'connecting' | 'connected' | 'error', error?: string) => void;
}

/**
 * Recursively removes all `undefined` keys and sanitizes values so Firestore setDoc/updateDoc
 * will never crash with "Unsupported field value: undefined".
 */
export const sanitizeForFirestore = <T>(obj: T): T => {
  if (obj === null || obj === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (value !== undefined) {
        result[key] = sanitizeForFirestore(value);
      }
    }
    return result as unknown as T;
  }
  return obj;
};

/**
 * High-performance parallel real-time Firestore sync.
 * Attaches real-time `onSnapshot` listeners to all collections simultaneously.
 * Any change made in any browser/tab is propagated instantly across all clients.
 */
export const initAndSyncFirestore = async (callbacks: FirestoreSyncCallbacks): Promise<() => void> => {
  const unsubscribers: (() => void)[] = [];
  callbacks.onSyncStatusChange?.('connecting');

  let hasConnected = false;
  const markConnected = () => {
    if (!hasConnected) {
      hasConnected = true;
      callbacks.onSyncStatusChange?.('connected');
    }
  };

  try {
    // 1. Parallel Slides Listener
    const slidesCol = collection(db, COLLECTIONS.SLIDES);
    const unsubSlides = onSnapshot(slidesCol, async (snapshot) => {
      markConnected();
      if (snapshot.empty) {
        console.log('🌱 Inicializando slides por defecto en Firestore...');
        for (const item of INITIAL_SLIDES) {
          await setDoc(doc(db, COLLECTIONS.SLIDES, item.id), sanitizeForFirestore(item));
        }
      } else {
        const items: SlideItem[] = [];
        snapshot.forEach((d) => items.push({ ...(d.data() as SlideItem), id: d.id }));
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
        callbacks.onSlidesUpdate?.(items);
      }
    }, (err) => {
      console.warn('Firestore slides listener warning:', err);
      callbacks.onSyncStatusChange?.('error', err.message);
    });
    unsubscribers.push(unsubSlides);

    // 2. Parallel News Listener
    const newsCol = collection(db, COLLECTIONS.NEWS);
    const unsubNews = onSnapshot(newsCol, async (snapshot) => {
      markConnected();
      if (snapshot.empty) {
        console.log('🌱 Inicializando noticias por defecto en Firestore...');
        for (const item of INITIAL_NEWS) {
          await setDoc(doc(db, COLLECTIONS.NEWS, item.id), sanitizeForFirestore(item));
        }
      } else {
        const items: NewsItem[] = [];
        snapshot.forEach((d) => items.push({ ...(d.data() as NewsItem), id: d.id }));
        callbacks.onNewsUpdate?.(items);
      }
    }, (err) => {
      console.warn('Firestore news listener warning:', err);
      callbacks.onSyncStatusChange?.('error', err.message);
    });
    unsubscribers.push(unsubNews);

    // 3. Parallel Services Listener
    const servicesCol = collection(db, COLLECTIONS.SERVICES);
    const unsubServices = onSnapshot(servicesCol, async (snapshot) => {
      markConnected();
      if (snapshot.empty) {
        console.log('🌱 Inicializando servicios por defecto en Firestore...');
        for (const item of INITIAL_SERVICES) {
          await setDoc(doc(db, COLLECTIONS.SERVICES, item.id), sanitizeForFirestore(item));
        }
      } else {
        const items: ServiceItem[] = [];
        snapshot.forEach((d) => items.push({ ...(d.data() as ServiceItem), id: d.id }));
        callbacks.onServicesUpdate?.(items);
      }
    }, (err) => {
      console.warn('Firestore services listener warning:', err);
      callbacks.onSyncStatusChange?.('error', err.message);
    });
    unsubscribers.push(unsubServices);

    // 4. Parallel Users Listener
    const usersCol = collection(db, COLLECTIONS.USERS);
    const unsubUsers = onSnapshot(usersCol, async (snapshot) => {
      markConnected();
      if (snapshot.empty) {
        console.log('🌱 Inicializando usuarios por defecto en Firestore...');
        for (const item of INITIAL_USERS) {
          await setDoc(doc(db, COLLECTIONS.USERS, item.id), sanitizeForFirestore(item));
        }
      } else {
        const items: UserItem[] = [];
        snapshot.forEach((d) => items.push({ ...(d.data() as UserItem), id: d.id }));
        callbacks.onUsersUpdate?.(items);
      }
    }, (err) => {
      console.warn('Firestore users listener warning:', err);
      callbacks.onSyncStatusChange?.('error', err.message);
    });
    unsubscribers.push(unsubUsers);

    // 5. Parallel Messages Listener
    const messagesCol = collection(db, COLLECTIONS.MESSAGES);
    const unsubMessages = onSnapshot(messagesCol, (snapshot) => {
      markConnected();
      const items: ContactMessage[] = [];
      snapshot.forEach((d) => items.push({ ...(d.data() as ContactMessage), id: d.id }));
      callbacks.onMessagesUpdate?.(items);
    }, (err) => {
      console.warn('Firestore messages listener warning:', err);
      callbacks.onSyncStatusChange?.('error', err.message);
    });
    unsubscribers.push(unsubMessages);

    // 6. Parallel Audit Logs Listener
    const auditCol = collection(db, COLLECTIONS.AUDIT_LOGS);
    const unsubAudit = onSnapshot(auditCol, (snapshot) => {
      markConnected();
      const items: AuditLogEntry[] = [];
      snapshot.forEach((d) => items.push({ ...(d.data() as AuditLogEntry), id: d.id }));
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callbacks.onAuditLogsUpdate?.(items);
    }, (err) => {
      console.warn('Firestore audit logs listener warning:', err);
      callbacks.onSyncStatusChange?.('error', err.message);
    });
    unsubscribers.push(unsubAudit);

  } catch (error) {
    console.error('Firebase Firestore connection error:', error);
    callbacks.onSyncStatusChange?.('error', String(error));
  }

  // Return cleanup function to unsubscribe from all listeners
  return () => {
    unsubscribers.forEach((unsub) => unsub());
  };
};

/* --- SLIDES CRUD --- */
export const saveSlideToFirestore = async (item: SlideItem): Promise<boolean> => {
  try {
    const clean = sanitizeForFirestore(item);
    await setDoc(doc(db, COLLECTIONS.SLIDES, item.id), clean);
    return true;
  } catch (err) {
    console.error('Error saving slide to Firestore:', err);
    return false;
  }
};

export const deleteSlideFromFirestore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SLIDES, id));
    return true;
  } catch (err) {
    console.error('Error deleting slide from Firestore:', err);
    return false;
  }
};

/* --- NEWS CRUD --- */
export const saveNewsToFirestore = async (item: NewsItem): Promise<boolean> => {
  try {
    const clean = sanitizeForFirestore(item);
    await setDoc(doc(db, COLLECTIONS.NEWS, item.id), clean);
    return true;
  } catch (err) {
    console.error('Error saving news to Firestore:', err);
    return false;
  }
};

export const deleteNewsFromFirestore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.NEWS, id));
    return true;
  } catch (err) {
    console.error('Error deleting news from Firestore:', err);
    return false;
  }
};

export const incrementNewsViewsInFirestore = async (id: string, newViews: number): Promise<boolean> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.NEWS, id), { views: newViews });
    return true;
  } catch (err) {
    console.error('Error updating news views in Firestore:', err);
    return false;
  }
};

/* --- SERVICES CRUD --- */
export const saveServiceToFirestore = async (item: ServiceItem): Promise<boolean> => {
  try {
    const clean = sanitizeForFirestore(item);
    await setDoc(doc(db, COLLECTIONS.SERVICES, item.id), clean);
    return true;
  } catch (err) {
    console.error('Error saving service to Firestore:', err);
    return false;
  }
};

export const deleteServiceFromFirestore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SERVICES, id));
    return true;
  } catch (err) {
    console.error('Error deleting service from Firestore:', err);
    return false;
  }
};

/* --- MESSAGES CRUD --- */
export const saveMessageToFirestore = async (item: ContactMessage): Promise<boolean> => {
  try {
    const clean = sanitizeForFirestore(item);
    await setDoc(doc(db, COLLECTIONS.MESSAGES, item.id), clean);
    return true;
  } catch (err) {
    console.error('Error saving message to Firestore:', err);
    return false;
  }
};

export const updateMessageStatusInFirestore = async (id: string, status: string): Promise<boolean> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.MESSAGES, id), { status });
    return true;
  } catch (err) {
    console.error('Error updating message status in Firestore:', err);
    return false;
  }
};

export const deleteMessageFromFirestore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.MESSAGES, id));
    return true;
  } catch (err) {
    console.error('Error deleting message from Firestore:', err);
    return false;
  }
};

/* --- USERS CRUD --- */
export const saveUserToFirestore = async (item: UserItem): Promise<boolean> => {
  try {
    const clean = sanitizeForFirestore(item);
    await setDoc(doc(db, COLLECTIONS.USERS, item.id), clean);
    return true;
  } catch (err) {
    console.error('Error saving user to Firestore:', err);
    return false;
  }
};

export const deleteUserFromFirestore = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, id));
    return true;
  } catch (err) {
    console.error('Error deleting user from Firestore:', err);
    return false;
  }
};

/* --- AUDIT LOGS --- */
export const saveAuditLogToFirestore = async (item: AuditLogEntry): Promise<boolean> => {
  try {
    const clean = sanitizeForFirestore(item);
    await setDoc(doc(db, COLLECTIONS.AUDIT_LOGS, item.id), clean);
    return true;
  } catch (err) {
    console.error('Error saving audit log to Firestore:', err);
    return false;
  }
};

export const clearAuditLogsInFirestore = async (): Promise<boolean> => {
  try {
    const { getDocs } = await import('firebase/firestore');
    const snap = await getDocs(collection(db, COLLECTIONS.AUDIT_LOGS));
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
    return true;
  } catch (err) {
    console.error('Error clearing audit logs in Firestore:', err);
    return false;
  }
};

/* --- BULK RESTORE & FACTORY RESET --- */
export const resetFirestoreToDefaults = async (): Promise<boolean> => {
  try {
    const { getDocs } = await import('firebase/firestore');
    const clearCol = async (colName: string) => {
      const snap = await getDocs(collection(db, colName));
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    };

    await clearCol(COLLECTIONS.SLIDES);
    for (const item of INITIAL_SLIDES) {
      await setDoc(doc(db, COLLECTIONS.SLIDES, item.id), sanitizeForFirestore(item));
    }

    await clearCol(COLLECTIONS.NEWS);
    for (const item of INITIAL_NEWS) {
      await setDoc(doc(db, COLLECTIONS.NEWS, item.id), sanitizeForFirestore(item));
    }

    await clearCol(COLLECTIONS.SERVICES);
    for (const item of INITIAL_SERVICES) {
      await setDoc(doc(db, COLLECTIONS.SERVICES, item.id), sanitizeForFirestore(item));
    }

    await clearCol(COLLECTIONS.USERS);
    for (const item of INITIAL_USERS) {
      await setDoc(doc(db, COLLECTIONS.USERS, item.id), sanitizeForFirestore(item));
    }

    await clearCol(COLLECTIONS.MESSAGES);
    return true;
  } catch (err) {
    console.error('Error resetting Firestore to defaults:', err);
    return false;
  }
};

export const importDataToFirestore = async (tables: {
  slides?: SlideItem[];
  news?: NewsItem[];
  services?: ServiceItem[];
  users?: UserItem[];
  messages?: ContactMessage[];
  auditLogs?: AuditLogEntry[];
}): Promise<boolean> => {
  try {
    const { getDocs } = await import('firebase/firestore');
    const clearCol = async (colName: string) => {
      const snap = await getDocs(collection(db, colName));
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    };

    if (Array.isArray(tables.slides)) {
      await clearCol(COLLECTIONS.SLIDES);
      for (const s of tables.slides) {
        await setDoc(doc(db, COLLECTIONS.SLIDES, s.id), sanitizeForFirestore(s));
      }
    }
    if (Array.isArray(tables.news)) {
      await clearCol(COLLECTIONS.NEWS);
      for (const n of tables.news) {
        await setDoc(doc(db, COLLECTIONS.NEWS, n.id), sanitizeForFirestore(n));
      }
    }
    if (Array.isArray(tables.services)) {
      await clearCol(COLLECTIONS.SERVICES);
      for (const s of tables.services) {
        await setDoc(doc(db, COLLECTIONS.SERVICES, s.id), sanitizeForFirestore(s));
      }
    }
    if (Array.isArray(tables.users)) {
      await clearCol(COLLECTIONS.USERS);
      for (const u of tables.users) {
        await setDoc(doc(db, COLLECTIONS.USERS, u.id), sanitizeForFirestore(u));
      }
    }
    if (Array.isArray(tables.messages)) {
      await clearCol(COLLECTIONS.MESSAGES);
      for (const m of tables.messages) {
        await setDoc(doc(db, COLLECTIONS.MESSAGES, m.id), sanitizeForFirestore(m));
      }
    }
    if (Array.isArray(tables.auditLogs)) {
      for (const l of tables.auditLogs) {
        await setDoc(doc(db, COLLECTIONS.AUDIT_LOGS, l.id), sanitizeForFirestore(l));
      }
    }
    return true;
  } catch (err) {
    console.error('Error importing data to Firestore:', err);
    return false;
  }
};
