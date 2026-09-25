import { SlideItem, NewsItem, ServiceItem, UserItem } from '../types';

export const INITIAL_USERS: UserItem[] = [
  {
    id: 'usr-1',
    username: 'admin',
    name: 'General de Brigada / Administrador General',
    email: 'admin@pecpffaa.edu.do',
    role: 'Administrador',
    status: 'Activo',
    password: 'admin',
    createdAt: '2026-01-15',
    lastLogin: 'Hoy, 08:30 AM',
  },
  {
    id: 'usr-2',
    username: 'oficial_lector',
    name: 'Coronel Académico / Asesor de Doctrina',
    email: 'lector@pecpffaa.edu.do',
    role: 'Lectura',
    status: 'Activo',
    password: 'Lector@123',
    createdAt: '2026-02-10',
    lastLogin: 'Ayer, 04:15 PM',
  },
  {
    id: 'usr-3',
    username: 'coordinador_posgrado',
    name: 'Mayor Lic. Valenzuela / Registro',
    email: 'posgrado@pecpffaa.edu.do',
    role: 'Lectura',
    status: 'Activo',
    password: 'User@123',
    createdAt: '2026-03-01',
    lastLogin: 'Hace 3 días',
  }
];

export const INITIAL_SLIDES: SlideItem[] = [
  {
    id: 'sld-1',
    title: 'Excelencia Estratégica en la Formación de Altos Mandos',
    subtitle: 'El Programa de Educación y Capacitación Profesional de las FF.AA. (PECPFFAA) lidera la investigación, doctrina y seguridad nacional.',
    tag: 'Admisiones Abiertas 2026-II',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Ver Oferta Académica',
    ctaLink: '#servicios',
    secondaryText: 'Proceso de Admisión',
    secondaryLink: '#admisiones',
    order: 1,
    active: true,
  },
  {
    id: 'sld-2',
    title: 'Doctrina Conjunta y Geopolítica Contemporánea',
    subtitle: 'Maestrías y Especialidades diseñadas para la toma de decisiones críticas en operaciones conjuntas y defensa del Estado.',
    tag: 'Investigación & Estrategia',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Conocer Planes de Estudio',
    ctaLink: '#servicios',
    secondaryText: 'Oferta Académica',
    secondaryLink: '#servicios',
    order: 2,
    active: true,
  },
  {
    id: 'sld-3',
    title: 'Ciberdefensa y Gestión Integral de Amenazas Híbridas',
    subtitle: 'Laboratorios de vanguardia para la protección de infraestructuras críticas nacionales y cooperación internacional.',
    tag: 'Innovación Tecnológica Militar',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Diplomados Especiales',
    ctaLink: '#servicios',
    secondaryText: 'Solicitar Información',
    secondaryLink: '#contacto',
    order: 3,
    active: true,
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'not-1',
    title: 'Inauguración del Diplomado Superior en Doctrina Conjunta e Interoperabilidad',
    slug: 'inauguracion-diplomado-doctrina-conjunta',
    excerpt: 'Oficiales superiores de las tres instituciones armadas inician el programa especializado con expositores internacionales.',
    content: 'El Programa de Educación y Capacitación Profesional de las FF.AA. (PECPFFAA) dio inicio formal a la vigésima quinta promoción del Diplomado en Doctrina Conjunta. La ceremonia estuvo presidida por el Alto Mando Militar y representantes de la academia de defensa hemisférica. Durante el discurso inaugural, se destacó la necesidad imperativa de articular esfuerzos doctrinales unificados ante los nuevos desafíos de seguridad multidimensional.',
    category: 'Doctrina Conjunta',
    author: 'Dirección de Comunicaciones Estratégicas',
    date: '28 Ago, 2026',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    featured: true,
    views: 1420,
    readTime: '3 min de lectura',
  },
  {
    id: 'not-2',
    title: 'Simposio Internacional de Ciberseguridad y Defensa de Infraestructuras Críticas',
    slug: 'simposio-internacional-ciberseguridad',
    excerpt: 'Expertos de más de 12 naciones se reunieron para debatir protocolos de respuesta conjunta frente a ciberamenazas.',
    content: 'Con una masiva asistencia presencial y virtual, el PECPFFAA celebró el Simposio de Seguridad Cibernética, presentando estudios de caso reales y simulaciones de respuesta a incidentes en redes de energía, telecomunicaciones y sistemas de comando y control militar.',
    category: 'Defensa & Seguridad',
    author: 'Departamento de Investigación',
    date: '24 Ago, 2026',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    featured: false,
    views: 980,
    readTime: '4 min de lectura',
  },
  {
    id: 'not-3',
    title: 'Convenio Académico Interinstitucional para la Investigación en Gestión de Riesgos',
    slug: 'convenio-academico-gestion-riesgos',
    excerpt: 'Firma de acuerdo estratégico para el desarrollo de proyectos conjuntos de tesis y publicaciones científicas.',
    content: 'Se suscribió un acuerdo de cooperación técnica y académica orientado al intercambio docente, pasantías especializadas y la creación de un observatorio de amenazas naturales y antropogénicas que refuercen los planes de contingencia militar y civil.',
    category: 'Institucional',
    author: 'Rectoría y Asuntos Legales',
    date: '19 Ago, 2026',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    featured: false,
    views: 740,
    readTime: '2 min de lectura',
  },
  {
    id: 'not-4',
    title: 'Graduación Ordinaria de la Maestría en Estrategia y Seguridad Nacional',
    slug: 'graduacion-ordinaria-maestria-estrategia',
    excerpt: 'Un total de 45 oficiales y profesionales civiles recibieron sus títulos de posgrado de alto nivel.',
    content: 'En un solemne acto celebrado en el Auditorio Central, fueron investidos los nuevos magísteres que aportarán su visión estratégica en los diversos estamentos del Estado y las Fuerzas Armadas. Se otorgaron menciones de honor al mérito académico.',
    category: 'Graduaciones',
    author: 'Secretaría General',
    date: '12 Ago, 2026',
    image: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=800&q=80',
    featured: false,
    views: 1850,
    readTime: '3 min de lectura',
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    code: 'MAE-EST-01',
    title: 'Maestría en Estrategia y Seguridad Nacional',
    category: 'Maestría',
    description: 'Programa cumbre orientado al análisis prospectivo de escenarios geopolíticos, formulación de políticas de defensa y toma de decisiones en el más alto nivel del Estado.',
    duration: '2 Años (4 Cuatrimestres)',
    modality: 'Semipresencial',
    targetAudience: 'Oficiales Superiores de las FFAA, Policía Nacional y Profesionales Civiles con cargos afines.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    iconName: 'Shield',
    requirements: [
      'Título de Grado legalizado por el Ministerio de Educación Superior',
      'Rango militar mínimo de Mayor/Capitán de Corbeta o equivalente civil',
      'Superación del examen psicotécnico y entrevista de admisión',
      'Ensayo de fundamentación académica'
    ],
    modules: [
      'Geopolítica y Geoestrategia Hemisférica',
      'Teoría de las Decisiones Estratégicas',
      'Derecho Internacional Humanitario y Conflictos Armados',
      'Planificación Militar Conjunta y Gestión de Crisis'
    ],
    featured: true,
  },
  {
    id: 'srv-2',
    code: 'ESP-DOC-02',
    title: 'Especialidad en Comando y Estado Mayor Conjunto',
    category: 'Especialidad',
    description: 'Capacitación táctica y operativa avanzada para coordinar fuerzas de tierra, mar y aire en teatros de operaciones modernos con doctrina unificada.',
    duration: '1 Año (12 Meses)',
    modality: 'Presencial',
    targetAudience: 'Oficiales de Estado Mayor designados por los comandos generales de las instituciones armadas.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    iconName: 'Compass',
    requirements: [
      'Acreditación de servicio activo en las Fuerzas Armadas',
      'Aprobación del curso básico de comando',
      'Certificación médica y física actualizada'
    ],
    modules: [
      'Proceso de Planificación Militar (PPM)',
      'Inteligencia Operacional y Análisis del Entorno',
      'Logística Militar Integrada',
      'Simulaciones y Juegos de Guerra Táctico-Estratégicos'
    ],
    featured: true,
  },
  {
    id: 'srv-3',
    code: 'DIP-CIB-03',
    title: 'Diplomado Superior en Ciberdefensa y Ciberinteligencia',
    category: 'Diplomado',
    description: 'Enfoque técnico-estratégico para la identificación de vectores de ataque, resiliencia cibernética y defensa de redes gubernamentales y militares.',
    duration: '6 Meses (180 Horas)',
    modality: 'Virtual',
    targetAudience: 'Personal técnico de comunicaciones, especialistas en TI y analistas de inteligencia.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    iconName: 'Cpu',
    requirements: [
      'Conocimientos previos en redes TCP/IP y sistemas operativos',
      'Carta de postulación institucional',
      'Equipo informático con capacidades de virtualización'
    ],
    modules: [
      'Arquitectura de Ciberseguridad Defensiva',
      'Threat Intelligence y Detección de Amenazas APT',
      'Criptografía Aplicada y Comunicaciones Seguras',
      'Marco Legal y Regulación Internacional en el Ciberespacio'
    ],
    featured: true,
  },
  {
    id: 'srv-4',
    code: 'CUR-GES-04',
    title: 'Curso Superior en Gestión de Riesgos y Desastres Complejos',
    category: 'Curso Superior',
    description: 'Metodologías para la respuesta militar ante emergencias climáticas, terremotos y asistencia humanitaria coordinada.',
    duration: '3 Meses (90 Horas)',
    modality: 'Semipresencial',
    targetAudience: 'Oficiales de enlace, directores de unidades de rescate y personal del COE.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    iconName: 'AlertTriangle',
    requirements: [
      'Pertenecer a organismos de socorro o unidades de contingencia de las FFAA',
      'Disponibilidad para ejercicios de campo'
    ],
    modules: [
      'Sistema de Comando de Incidentes (SCI)',
      'Evaluación de Daños y Análisis de Necesidades (EDAN)',
      'Despliegue Rápido y Apoyo a la Población Civil'
    ],
    featured: false,
  }
];
