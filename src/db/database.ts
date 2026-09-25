import { AuditLogEntry, AuditAction, CMSModule, UserRole, SlideItem, NewsItem, ServiceItem, UserItem, ContactMessage, DatabaseStats } from '../types';

export const DB_KEYS = {
  SLIDES: 'pecpffaa_slides',
  NEWS: 'pecpffaa_news',
  SERVICES: 'pecpffaa_services',
  USERS: 'pecpffaa_users',
  MESSAGES: 'pecpffaa_messages',
  AUDIT_LOGS: 'pecpffaa_db_audit_logs',
  CURRENT_USER: 'pecpffaa_current_user',
  DB_META: 'pecpffaa_db_metadata'
} as const;

export const DB_VERSION = 'v2.4-relational-audit';

export function formatAuditDate(date: Date = new Date()): string {
  return date.toLocaleString('es-DO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-init-01',
    timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    formattedDate: formatAuditDate(new Date(Date.now() - 3600000 * 24 * 2)),
    userName: 'Administrador General (admin)',
    userRole: 'Administrador',
    action: 'Inicialización BD',
    module: 'Base de Datos',
    itemTitle: 'Esquema de Base de Datos Institucional',
    itemId: 'schema-v2',
    details: 'Aprovisionamiento inicial de tablas relacionales de posgrado: Slides, Noticias, Oferta Académica y Usuarios.',
    status: 'Completado',
  },
  {
    id: 'log-init-02',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    formattedDate: formatAuditDate(new Date(Date.now() - 3600000 * 12)),
    userName: 'Administrador General (admin)',
    userRole: 'Administrador',
    action: 'Creación',
    module: 'Oferta Académica',
    itemTitle: 'Maestría en Seguridad y Defensa Nacional (POS-01)',
    itemId: 'srv-1',
    details: 'Registro y publicación del programa de maestría de estado mayor con 12 módulos y 2 años de duración.',
    status: 'Completado',
  },
  {
    id: 'log-init-03',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    formattedDate: formatAuditDate(new Date(Date.now() - 3600000 * 4)),
    userName: 'Administrador General (admin)',
    userRole: 'Administrador',
    action: 'Modificación',
    module: 'Slides (Carrusel)',
    itemTitle: 'Convocatoria Abierta Posgrados 2026',
    itemId: 'sld-1',
    details: 'Actualización del botón de llamada a la acción y sincronización con admisiones del período 2026.',
    status: 'Completado',
  }
];

export function getStoredAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(DB_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(DB_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function saveStoredAuditLogs(logs: AuditLogEntry[]): void {
  try {
    localStorage.setItem(DB_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Error al guardar registro en base de datos:', error);
  }
}

export function createAuditLog(
  userName: string,
  userRole: UserRole,
  action: AuditAction,
  module: CMSModule,
  itemTitle: string,
  itemId: string,
  details: string,
  snapshot?: Record<string, unknown>
): AuditLogEntry {
  const now = new Date();
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    formattedDate: formatAuditDate(now),
    userName,
    userRole,
    action,
    module,
    itemTitle,
    itemId,
    details,
    status: 'Completado',
    snapshot
  };
}

export function computeDatabaseStats(
  slides: SlideItem[],
  news: NewsItem[],
  services: ServiceItem[],
  users: UserItem[],
  messages: ContactMessage[],
  auditLogs: AuditLogEntry[]
): DatabaseStats {
  const allJson = JSON.stringify({ slides, news, services, users, messages, auditLogs });
  const storageSizeBytes = new Blob([allJson]).size;
  const totalRecords = slides.length + news.length + services.length + users.length + messages.length;

  return {
    version: DB_VERSION,
    lastUpdated: auditLogs[0]?.formattedDate || formatAuditDate(),
    totalRecords,
    totalTransactions: auditLogs.length,
    storageSizeBytes,
    tables: [
      {
        name: 'tbl_slides',
        description: 'Banners y diapositivas principales de la portada (16:9)',
        count: slides.length
      },
      {
        name: 'tbl_noticias',
        description: 'Boletines de prensa, artículos doctrinales y comunicados',
        count: news.length
      },
      {
        name: 'tbl_servicios_academicos',
        description: 'Catálogo de Maestrías, Especialidades y Diplomados militares',
        count: services.length
      },
      {
        name: 'tbl_usuarios_cms',
        description: 'Cuentas de oficiales administradores y lectores del sistema',
        count: users.length
      },
      {
        name: 'tbl_buzon_admisiones',
        description: 'Solicitudes y mensajes recibidos vía portal público',
        count: messages.length
      },
      {
        name: 'tbl_auditoria_transacciones',
        description: 'Historial transaccional y registro inmutable de cambios CMS',
        count: auditLogs.length
      }
    ]
  };
}

export interface DatabaseExportPayload {
  exportDate: string;
  version: string;
  institution: string;
  tables: {
    slides: SlideItem[];
    news: NewsItem[];
    services: ServiceItem[];
    users: UserItem[];
    messages: ContactMessage[];
    auditLogs: AuditLogEntry[];
  };
  checksum: string;
}

export function generateDatabaseExport(
  slides: SlideItem[],
  news: NewsItem[],
  services: ServiceItem[],
  users: UserItem[],
  messages: ContactMessage[],
  auditLogs: AuditLogEntry[]
): string {
  const payload: DatabaseExportPayload = {
    exportDate: new Date().toISOString(),
    version: DB_VERSION,
    institution: 'Programa de Educación y Capacitación Profesional de las FF.AA. (PECPFFAA)',
    tables: {
      slides,
      news,
      services,
      users,
      messages,
      auditLogs
    },
    checksum: `sha256-mock-${Date.now().toString(16)}`
  };
  return JSON.stringify(payload, null, 2);
}
