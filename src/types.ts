export type UserRole = 'Administrador' | 'Lectura';
export type UserStatus = 'Activo' | 'Inactivo';

export interface UserItem {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  password?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  secondaryText?: string;
  secondaryLink?: string;
  order: number;
  active: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Institucional' | 'Académico' | 'Doctrina Conjunta' | 'Defensa & Seguridad' | 'Graduaciones' | 'Internacional';
  author: string;
  date: string;
  image: string;
  featured?: boolean;
  views: number;
  readTime: string;
}

export interface ServiceItem {
  id: string;
  code: string;
  title: string;
  category: 'Maestría' | 'Especialidad' | 'Diplomado' | 'Curso Superior';
  description: string;
  duration: string;
  modality: 'Presencial' | 'Semipresencial' | 'Virtual';
  targetAudience: string;
  image: string;
  iconName: string;
  requirements: string[];
  modules: string[];
  featured?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: 'No leído' | 'Leído' | 'Respondido';
}

export type AuditAction = 'Creación' | 'Modificación' | 'Eliminación' | 'Cambio de Estado' | 'Restauración BD' | 'Inicialización BD';
export type CMSModule = 'Slides (Carrusel)' | 'Noticias' | 'Oferta Académica' | 'Usuarios' | 'Buzón Admisiones' | 'Base de Datos';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO string
  formattedDate: string; // "09 Sep 2026, 10:25 AM"
  userName: string;
  userRole: UserRole;
  action: AuditAction;
  module: CMSModule;
  itemTitle: string;
  itemId: string;
  details: string;
  status: 'Completado' | 'Pendiente' | 'Error';
  snapshot?: Record<string, unknown>;
}

export interface DatabaseStats {
  version: string;
  lastUpdated: string;
  totalRecords: number;
  totalTransactions: number;
  storageSizeBytes: number;
  cloudProvider?: string;
  cloudDatabase?: string;
  cloudStatus?: 'connecting' | 'connected' | 'error';
  tables: {
    name: string;
    description: string;
    count: number;
  }[];
}
