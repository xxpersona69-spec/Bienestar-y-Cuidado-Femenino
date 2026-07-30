export type ProductCategory = 'TODOS' | 'CUIDADO_MENSTRUAL' | 'DEPILACION' | 'KITS_ESPECIALES' | 'BIENESTAR';

export type DropiSyncStatus = 'synced' | 'pending' | 'error';

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  priceCOP: number;
  originalPriceCOP?: number;
  category: ProductCategory;
  image: string;
  secondaryImages?: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  dropiProductId: string;
  dropiSupplierName: string;
  dropiCostCOP: number;
  dropiSyncStatus: DropiSyncStatus;
  lastSyncedAt: string;
  features: string[];
  specs?: Record<string, string>;
  isBestSeller?: boolean;
  hidden?: boolean;
}

export interface DropiCatalogItem {
  id: string;
  title: string;
  category: string;
  supplierName: string;
  suggestedRetailCOP: number;
  wholesaleCostCOP: number;
  estimatedProfitCOP: number;
  stockAvailable: number;
  image: string;
  rating: number;
  courierSupported: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type PaymentMethod = 'COD';

export type CourierName = 'Servientrega' | 'Interrapidisimo' | 'Envía' | 'TCC' | 'Coordinadora';

export type OrderStatus =
  | 'PENDIENTE'
  | 'ENVIADO_DROPI'
  | 'GUIA_GENERADA'
  | 'EN_TRANSITO'
  | 'EN_REPARTO'
  | 'ENTREGADO'
  | 'CANCELADO';

export interface OrderStatusLog {
  timestamp: string;
  status: OrderStatus;
  description: string;
  location?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  unitPriceCOP: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  complement?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'cod_pending' | 'failed';
  totalCOP: number;
  items: OrderItem[];
  dropiOrderId?: string;
  dropiGuideNumber?: string;
  courierName?: CourierName;
  status: OrderStatus;
  statusHistory: OrderStatusLog[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  userPhoto?: string;
  productName: string;
  likes: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  department: string;
  totalSpentCOP: number;
  orderCount: number;
  lastOrderDate: string;
}

export interface DropiSettings {
  apiToken: string;
  webhookSecret: string;
  autoSyncEnabled: boolean;
  defaultMarkupPercentage: number;
  defaultCourier: CourierName;
  codEnabled: boolean;
  isConnected: boolean;
  lastCatalogSyncTime: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  badgeText?: string;
  discountCode?: string;
  targetProductId?: string;
  read: boolean;
}

export interface ColombianLocation {
  department: string;
  cities: string[];
}
