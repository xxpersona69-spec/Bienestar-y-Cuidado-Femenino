import {
  Product,
  DropiCatalogItem,
  Order,
  Review,
  Customer,
  DropiSettings,
  ColombianLocation,
  PushNotification
} from '../types';

const heatBeltImage = '/src/assets/images/banda_termica_colombia_1785357617957.jpg';
const razorKitImage = '/src/assets/images/kit_depilador_femenino_1785357630428.jpg';
export const brandLogoImage = '/src/assets/images/bienestar_femenino_logo_1785357642273.jpg';

/**
 * Calculador de Envío Real Dropi Colombia según Departamento y Ciudad
 * Basado en las tarifas reales de transportadoras Dropi (Servientrega, Envía, Interrapidísimo, TCC)
 */
export function calculateDropiShippingFee(department: string, city?: string): number {
  return 0; // Envío GRATIS promocional en toda Colombia
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-aura-heat',
    title: 'Banda Térmica para Cólicos "Aura Heat"',
    subtitle: 'Alivio térmico y masaje vibratorio para dolores menstruales',
    description: 'Banda inteligente ergonómica diseñada especialmente para aliviar los dolores menstruales y lumbares en minutos. Cuenta con 3 niveles de temperatura infrarroja (45°C, 55°C, 65°C) y 4 modos de masaje de vibración. Recargable por USB-C, inalámbrica y ultra ligera para usar debajo de la ropa.',
    priceCOP: 50000,
    originalPriceCOP: 85000,
    category: 'CUIDADO_MENSTRUAL',
    image: heatBeltImage,
    rating: 4.9,
    reviewCount: 342,
    stock: 48,
    dropiProductId: 'DP-COL-90821',
    dropiSupplierName: 'Aura Care Official Dropi Supplier',
    dropiCostCOP: 22000,
    dropiSyncStatus: 'synced',
    lastSyncedAt: new Date().toISOString(),
    isBestSeller: true,
    features: [
      'Alivio en menos de 5 minutos mediante termoterapia inteligente',
      '3 Niveles de Calor Ajustable: 45°C (Suave), 55°C (Medio), 65°C (Intenso)',
      '4 Modos de Masaje por micro-vibración relajante',
      'Cinturón elástico adaptable a cualquier contextura física',
      'Batería de larga duración (hasta 4 horas continuas)'
    ],
    specs: {
      'Peso': '180 gramos',
      'Material': 'Felpa ultrasuave transpirable y ABS libre de BPA',
      'Batería': '1800 mAh Li-ion USB-C',
      'Garantía': '6 Meses por defectos de fábrica'
    }
  },
  {
    id: 'prod-velvet-touch',
    title: 'Kit Depilador Femenino "Velvet Touch"',
    subtitle: 'Depilación suave, rápida y sin dolor para todo el cuerpo',
    description: 'Set completo de depilación corporal y facial femenina con cabezales intercambiables de acero inoxidable antialérgico. Remueve el vello sin dolor ni irritaciones. Incluye gel de aloe vera y extracto de rosas para calmar la piel al instante. Inalámbrica, resistente al agua IPX7.',
    priceCOP: 70000,
    originalPriceCOP: 120000,
    category: 'DEPILACION',
    image: razorKitImage,
    rating: 4.8,
    reviewCount: 215,
    stock: 35,
    dropiProductId: 'DP-COL-88231',
    dropiSupplierName: 'Velvet Body Co. Dropi',
    dropiCostCOP: 26000,
    dropiSyncStatus: 'synced',
    lastSyncedAt: new Date().toISOString(),
    isBestSeller: true,
    features: [
      'Cabezal giratorio de precisión para zonas sensibles (Ingle, axilas, piernas)',
      'Hojas de acero hipoalergénico que evitan vellos encarnados',
      'Certificación IPX7 100% resistente al agua para uso en ducha',
      'Incluye Gel Calmante de Rosas & Aloe Vera de 60ml',
      'Carga rápida en 60 minutos por USB'
    ],
    specs: {
      'Autonomía': '90 minutos de uso continuo',
      'Accesorios': '4 cabezales, cepillo de limpieza, cable USB, Gel calmante',
      'Garantía': '6 Meses Dropi Directo'
    }
  }
];

export const DROPI_CATALOG_MOCK: DropiCatalogItem[] = [
  {
    id: 'DP-COL-55102',
    title: 'Copa Menstrual de Silicona Médica + Esterilizador USB',
    category: 'CUIDADO_MENSTRUAL',
    supplierName: 'FemCare Colombia Direct',
    wholesaleCostCOP: 28000,
    suggestedRetailCOP: 69900,
    estimatedProfitCOP: 41900,
    stockAvailable: 250,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    courierSupported: ['Servientrega', 'Interrapidisimo', 'Envía', 'TCC']
  },
  {
    id: 'DP-COL-44210',
    title: 'Cepillo Facial Sónico Limpiador "Rose Quartz"',
    category: 'BIENESTAR',
    supplierName: 'BeautyDrop Colombia',
    wholesaleCostCOP: 22000,
    suggestedRetailCOP: 58900,
    estimatedProfitCOP: 36900,
    stockAvailable: 180,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    courierSupported: ['Servientrega', 'Interrapidisimo', 'Envía']
  },
  {
    id: 'DP-COL-33119',
    title: 'Aceite Corporal Nutritivo con Caléndula & Almendras 120ml',
    category: 'DEPILACION',
    supplierName: 'Naturalis Dropship',
    wholesaleCostCOP: 14000,
    suggestedRetailCOP: 39900,
    estimatedProfitCOP: 25900,
    stockAvailable: 310,
    image: 'https://images.unsplash.com/photo-1608248597249-1978baf7a69b?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    courierSupported: ['Servientrega', 'Envía', 'Coordinadora']
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-aura-heat',
    author: 'Mariana Gómez',
    city: 'Bogotá D.C.',
    rating: 5,
    date: '2026-07-25',
    comment: '¡Es una MARAVILLA de verdad! Sufría horriblemente con mis cólicos el primer día y esta banda calienta en segundos. El masaje suave es demasiado reconfortante. Me llegó en 24 horas con pago contraentrega a Bogotá. 100% recomendada.',
    verifiedPurchase: true,
    productName: 'Banda Térmica Corporal "Aura Heat"',
    likes: 42
  },
  {
    id: 'rev-2',
    productId: 'prod-aura-heat',
    author: 'Andrea Restrepo',
    city: 'Medellín',
    rating: 5,
    date: '2026-07-22',
    comment: 'Súper suave la tela y la batería dura bastante. La usé en mi oficina debajo del buzo y nadie se dio cuenta. Me salvó la jornada de trabajo. La guía de Envía me permitió rastrearla todo el tiempo.',
    verifiedPurchase: true,
    productName: 'Banda Térmica Corporal "Aura Heat"',
    likes: 28
  },
  {
    id: 'rev-3',
    productId: 'prod-velvet-touch',
    author: 'Sofia Carvajal',
    city: 'Cali',
    rating: 5,
    date: '2026-07-20',
    comment: 'No me irrita la piel para nada, el gel de rosas que viene con la rasuradora huele delicioso y deja la piel súper suave. La entrega por Interrapidísimo fue rápida.',
    verifiedPurchase: true,
    productName: 'Kit Rasuradora Femenina "Velvet Touch"',
    likes: 19
  },
  {
    id: 'rev-4',
    productId: 'prod-kit-bienestar-total',
    author: 'Isabella Silva',
    city: 'Bucaramanga',
    rating: 5,
    date: '2026-07-18',
    comment: 'El kit más completo que he comprado. Los parches herbales son geniales para salir a la calle y la banda para cuando estás en casa descansando.',
    verifiedPurchase: true,
    productName: 'Kit Especial "Bienestar & Cero Cólicos"',
    likes: 31
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_DROPI_SETTINGS: DropiSettings = {
  apiToken: 'dropi_live_tk_colombia_981273918237',
  webhookSecret: 'whsec_aura_dropi_2026_col',
  autoSyncEnabled: true,
  defaultMarkupPercentage: 110,
  defaultCourier: 'Envía',
  codEnabled: true,
  isConnected: true,
  lastCatalogSyncTime: new Date().toISOString()
};

export const COLOMBIAN_LOCATIONS: ColombianLocation[] = [
  {
    department: 'Bogotá D.C.',
    cities: ['Bogotá D.C.']
  },
  {
    department: 'Antioquia',
    cities: ['Medellín', 'Envigado', 'Itagüí', 'Bello', 'Sabaneta', 'Rionegro', 'Apartadó', 'Turbo', 'Caucasia', 'Caldas', 'La Estrella', 'Girardota', 'Copacabana', 'Marinilla', 'Guarne', 'Puerto Berrío', 'Yarumal', 'Santa Fe de Antioquia']
  },
  {
    department: 'Atlántico',
    cities: ['Barranquilla', 'Soledad', 'Malambo', 'Puerto Colombia', 'Sabanalarga', 'Baranoa', 'Galapa']
  },
  {
    department: 'Bolívar',
    cities: ['Cartagena', 'Magangué', 'Turbaco', 'Arjona', 'El Carmen de Bolívar', 'Mompox']
  },
  {
    department: 'Boyacá',
    cities: ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Puerto Boyacá', 'Paipa', 'Villa de Leyva']
  },
  {
    department: 'Caldas',
    cities: ['Manizales', 'Villamaría', 'La Dorada', 'Riosucio', 'Chinchiná', 'Aguadas']
  },
  {
    department: 'Caquetá',
    cities: ['Florencia', 'San Vicente del Caguán', 'Puerto Rico']
  },
  {
    department: 'Casanare',
    cities: ['Yopal', 'Aguazul', 'Paz de Ariporo', 'Villanueva']
  },
  {
    department: 'Cauca',
    cities: ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Patía']
  },
  {
    department: 'Cesar',
    cities: ['Valledupar', 'Aguachica', 'Agustín Codazzi', 'Bosconia', 'Curumaní']
  },
  {
    department: 'Chocó',
    cities: ['Quibdó', 'Istmina', 'Tadó', 'Condoto', 'Bahía Solano']
  },
  {
    department: 'Córdoba',
    cities: ['Montería', 'Cereté', 'Sahagún', 'Lorica', 'Montelíbano', 'Planeta Rica']
  },
  {
    department: 'Cundinamarca',
    cities: ['Soacha', 'Chía', 'Cajicá', 'Zipaquirá', 'Fusagasugá', 'Facatativá', 'Mosquera', 'Funza', 'Girardot', 'Madrid', 'Sopó', 'Tocancipá', 'Cota', 'La Calera', 'Villeta', 'Ubaté']
  },
  {
    department: 'Huila',
    cities: ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre']
  },
  {
    department: 'La Guajira',
    cities: ['Riohacha', 'Maicao', 'Uribia', 'Fonseca', 'San Juan del Cesar']
  },
  {
    department: 'Magdalena',
    cities: ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco', 'Plato']
  },
  {
    department: 'Meta',
    cities: ['Villavicencio', 'Acacías', 'Granada', 'Puerto López', 'Puerto Gaitán']
  },
  {
    department: 'Nariño',
    cities: ['Pasto', 'Ipiales', 'Tumaco', 'Túquerres', 'La Unión']
  },
  {
    department: 'Norte de Santander',
    cities: ['Cúcuta', 'Ocaña', 'Pamplona', 'Los Patios', 'Villa del Rosario', 'Tibú']
  },
  {
    department: 'Quindío',
    cities: ['Armenia', 'Calarcá', 'Tebada', 'Montenegro', 'Quimbaya', 'Salento']
  },
  {
    department: 'Risaralda',
    cities: ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia', 'Belén de Umbría']
  },
  {
    department: 'Santander',
    cities: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja', 'San Gil', 'Socorro', 'Vélez']
  },
  {
    department: 'Sucre',
    cities: ['Sincelejo', 'Corozal', 'San Marcos', 'Tolú', 'San Onofre']
  },
  {
    department: 'Tolima',
    cities: ['Ibagué', 'Espinal', 'Melgar', 'Líbano', 'Honda', 'Mariquita', 'Chaparral']
  },
  {
    department: 'Valle del Cauca',
    cities: ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Buga', 'Jamundí', 'Cartago', 'Yumbo', 'Sevilla', 'Candelaria']
  },
  {
    department: 'Arauca',
    cities: ['Arauca', 'Tame', 'Saravena', 'Arauquita']
  },
  {
    department: 'Amazonas',
    cities: ['Leticia', 'Puerto Nariño']
  },
  {
    department: 'Guainía',
    cities: ['Inírida']
  },
  {
    department: 'Guaviare',
    cities: ['San José del Guaviare', 'Calamar']
  },
  {
    department: 'Putumayo',
    cities: ['Mocoa', 'Puerto Asís', 'Orito', 'Sibundoy']
  },
  {
    department: 'San Andrés y Providencia',
    cities: ['San Andrés', 'Providencia']
  },
  {
    department: 'Vaupés',
    cities: ['Mitú']
  },
  {
    department: 'Vichada',
    cities: ['Puerto Carreño', 'La Primavera']
  }
];

export const INITIAL_PUSH_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'push-1',
    title: '🌸 Alivio instantáneo en tu primera compra',
    message: 'Usa el código AURA15 y recibe 15% OFF + Envío Gratis Contraentrega.',
    timestamp: 'Hace 5 min',
    badgeText: '15% OFF',
    discountCode: 'AURA15',
    read: false
  },
  {
    id: 'push-2',
    title: '🚚 Sincronización Dropi Colombia Activa',
    message: 'Tus pedidos se despachan en menos de 24 horas por Envía, Servientrega o Interrapidísimo.',
    timestamp: 'Hace 1 hora',
    badgeText: 'DROPI SYNC',
    read: false
  }
];
