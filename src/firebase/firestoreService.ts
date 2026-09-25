import { 
  db, 
  COLLECTIONS, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
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
 * Initializes Firestore collections, seeds initial data if collections are empty,
 * and attaches real-time snapshot listeners for live multi-user sync.
 */
export const initAndSyncFirestore = async (callbacks: FirestoreSyncCallbacks): Promise<() => void> => {
  const unsubscribers: (() => void)[] = [];

  try {
    callbacks.onSyncStatusChange?.('connecting');

    // 1. Check & Seed Slides if empty
    const slidesCol = collection(db, COLLECTIONS.SLIDES);
    const slidesSnap = await getDocs(slidesCol);
    if (slidesSnap.empty) {
      console.log('🌱 Seeding initial slides to Firebase Firestore...');
      for (const item of INITIAL_SLIDES) {
        await setDoc(doc(db, COLLECTIONS.SLIDES, item.id), item);
      }
    }

    // 2. Check & Seed News if empty
    const newsCol = collection(db, COLLECTIONS.NEWS);
    const newsSnap = await getDocs(newsCol);
    if (newsSnap.empty) {
      console.log('🌱 Seeding initial news to Firebase Firestore...');
      for (const item of INITIAL_NEWS) {
        await setDoc(doc(db, COLLECTIONS.NEWS, item.id), item);
      }
    }

    // 3. Check & Seed Services if empty
    const servicesCol = collection(db, COLLECTIONS.SERVICES);
    const servicesSnap = await getDocs(servicesCol);
    if (servicesSnap.empty) {
      console.log('🌱 Seeding initial services to Firebase Firestore...');
      for (const item of INITIAL_SERVICES) {
        await setDoc(doc(db, COLLECTIONS.SERVICES, item.id), item);
      }
    }

    // 4. Check & Seed Users if empty
    const usersCol = collection(db, COLLECTIONS.USERS);
    const usersSnap = await getDocs(usersCol);
    if (usersSnap.empty) {
      console.log('🌱 Seeding initial users to Firebase Firestore...');
      for (const item of INITIAL_USERS) {
        await setDoc(doc(db, COLLECTIONS.USERS, item.id), item);
      }
    }

    // 5. Setup Live Listeners (onSnapshot)
    // Slides Listener
    const unsubSlides = onSnapshot(slidesCol, (snapshot) => {
      if (!snapshot.empty) {
        const items: SlideItem[] = [];
        snapshot.forEach((d) => items.push({ ...(d.data() as SlideItem), id: d.id }));
        items.sort((a, b) => a.order - b.order);
        callbacks.onSlidesUpdate?.(items);
      }
    }, (err) => {
      console.warn('Firestore slides listener notice:', err);
    });
    unsubscribers.push(unsubSlides);

    // News Listener
    const unsubNews = onSnapshot(newsCol, (snapshot) => {
      if (!snapshot.empty) {
        const items: NewsItem[] = [];
        snapshot.forEach((d) => items.push({ ...(d.data() as NewsItem), id: d.id }));
        callbacks.onNewsUpdate?.(items);
      }
    }, (err) => {
      console.warn('Firestore news listener notice:', err);
    });
    unsubscribers.push(unsubNews);

    // Services Listener
    const unsubServices = onSnapshot(servicesCol, (snapshot) => {
      if (!snapshot.empty) {
        const items: ServiceItem[] = [];
        snapshot.forEach((d) => items.push({ ...(d.data() as ServiceItem), id: d.id }));
        callbacks.onServicesUpdate?.(items);
      }
    }, (err) => {
      console.warn('Firestore services listener notice:', err);
    });
    unsubscribers.push(unsubServices);

    // Users Listener
    const unsubUsers = onSnapshot(usersCol, (snapshot) => {
      if (!snapshot.empty) {
        const items: UserItem[] = [];
        snapshot.forEach((d) => items.push({ ...(d.data() as UserItem), id: d.id }));
        callbacks.onUsersUpdate?.(items);
      }
    }, (err) => {
      console.warn('Firestore users listener notice:', err);
    });
    unsubscribers.push(unsubUsers);

    // Messages Listener
    const messagesCol = collection(db, COLLECTIONS.MESSAGES);
    const unsubMessages = onSnapshot(messagesCol, (snapshot) => {
      const items: ContactMessage[] = [];
      snapshot.forEach((d) => items.push({ ...(d.data() as ContactMessage), id: d.id }));
      callbacks.onMessagesUpdate?.(items);
    }, (err) => {
      console.warn('Firestore messages listener notice:', err);
    });
    unsubscribers.push(unsubMessages);

    // Audit Logs Listener
    const auditCol = collection(db, COLLECTIONS.AUDIT_LOGS);
    const unsubAudit = onSnapshot(auditCol, (snapshot) => {
      const items: AuditLogEntry[] = [];
      snapshot.forEach((d) => items.push({ ...(d.data() as AuditLogEntry), id: d.id }));
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callbacks.onAuditLogsUpdate?.(items);
    }, (err) => {
      console.warn('Firestore audit logs listener notice:', err);
    });
    unsubscribers.push(unsubAudit);

    callbacks.onSyncStatusChange?.('connected');
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
export const saveSlideToFirestore = async (item: SlideItem): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.SLIDES, item.id), item);
  } catch (err) {
    console.error('Error saving slide to Firestore:', err);
  }
};

export const deleteSlideFromFirestore = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SLIDES, id));
  } catch (err) {
    console.error('Error deleting slide from Firestore:', err);
  }
};

/* --- NEWS CRUD --- */
export const saveNewsToFirestore = async (item: NewsItem): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.NEWS, item.id), item);
  } catch (err) {
    console.error('Error saving news to Firestore:', err);
  }
};

export const deleteNewsFromFirestore = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.NEWS, id));
  } catch (err) {
    console.error('Error deleting news from Firestore:', err);
  }
};

export const incrementNewsViewsInFirestore = async (id: string, newViews: number): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.NEWS, id), { views: newViews });
  } catch (err) {
    console.error('Error updating news views in Firestore:', err);
  }
};

/* --- SERVICES CRUD --- */
export const saveServiceToFirestore = async (item: ServiceItem): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.SERVICES, item.id), item);
  } catch (err) {
    console.error('Error saving service to Firestore:', err);
  }
};

export const deleteServiceFromFirestore = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SERVICES, id));
  } catch (err) {
    console.error('Error deleting service from Firestore:', err);
  }
};

/* --- MESSAGES CRUD --- */
export const saveMessageToFirestore = async (item: ContactMessage): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.MESSAGES, item.id), item);
  } catch (err) {
    console.error('Error saving message to Firestore:', err);
  }
};

export const updateMessageStatusInFirestore = async (id: string, status: string): Promise<void> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.MESSAGES, id), { status });
  } catch (err) {
    console.error('Error updating message status in Firestore:', err);
  }
};

export const deleteMessageFromFirestore = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.MESSAGES, id));
  } catch (err) {
    console.error('Error deleting message from Firestore:', err);
  }
};

/* --- USERS CRUD --- */
export const saveUserToFirestore = async (item: UserItem): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, item.id), item);
  } catch (err) {
    console.error('Error saving user to Firestore:', err);
  }
};

export const deleteUserFromFirestore = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, id));
  } catch (err) {
    console.error('Error deleting user from Firestore:', err);
  }
};

/* --- AUDIT LOGS --- */
export const saveAuditLogToFirestore = async (item: AuditLogEntry): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.AUDIT_LOGS, item.id), item);
  } catch (err) {
    console.error('Error saving audit log to Firestore:', err);
  }
};

export const clearAuditLogsInFirestore = async (currentLogs: AuditLogEntry[]): Promise<void> => {
  try {
    for (const log of currentLogs) {
      await deleteDoc(doc(db, COLLECTIONS.AUDIT_LOGS, log.id));
    }
  } catch (err) {
    console.error('Error clearing audit logs in Firestore:', err);
  }
};
