import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  Review,
  Customer,
  DropiSettings,
  DropiCatalogItem,
  PushNotification,
  ProductCategory
} from '../types';
import confetti from 'canvas-confetti';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  reviews: Review[];
  customers: Customer[];
  dropiSettings: DropiSettings;
  dropiCatalog: DropiCatalogItem[];
  pushNotifications: PushNotification[];
  selectedCategory: ProductCategory;
  currency: 'COP' | 'USD';
  activeView: 'shop' | 'tracking' | 'admin';
  selectedProduct: Product | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isAuraBotOpen: boolean;
  isReviewModalOpen: boolean;
  activeOrderForTracking: Order | null;
  unreadNotificationsCount: number;
  loading: boolean;
  
  // Actions
  setSelectedCategory: (cat: ProductCategory) => void;
  setCurrency: (curr: 'COP' | 'USD') => void;
  setActiveView: (view: 'shop' | 'tracking' | 'admin') => void;
  setSelectedProduct: (prod: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsAuraBotOpen: (open: boolean) => void;
  setIsReviewModalOpen: (open: boolean) => void;
  setActiveOrderForTracking: (order: Order | null) => void;
  
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  formatPrice: (amountCOP: number) => string;
  
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchDropiStatus: () => Promise<void>;
  
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  generateDropiGuide: (orderId: string, courier?: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: string, description?: string) => Promise<void>;
  importDropiProduct: (dropiItemId: string, markupPercentage: number) => Promise<void>;
  syncDropiInventory: () => Promise<void>;
  connectDropi: (settings: Partial<DropiSettings>) => Promise<void>;
  addReview: (reviewData: Partial<Review>) => Promise<void>;
  markNotificationsAsRead: () => void;
  addPushNotification: (title: string, message: string, discountCode?: string) => void;
  
  // Product Admin Management
  addProduct: (productData: Partial<Product>) => Promise<void>;
  updateProduct: (productData: Product) => Promise<void>;
  toggleHideProduct: (productId: string) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [dropiSettings, setDropiSettings] = useState<DropiSettings>({
    apiToken: '',
    webhookSecret: '',
    autoSyncEnabled: true,
    defaultMarkupPercentage: 110,
    defaultCourier: 'Envía',
    codEnabled: true,
    isConnected: true,
    lastCatalogSyncTime: new Date().toISOString()
  });
  const [dropiCatalog, setDropiCatalog] = useState<DropiCatalogItem[]>([]);
  const [pushNotifications, setPushNotifications] = useState<PushNotification[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('TODOS');
  const [currency, setCurrency] = useState<'COP' | 'USD'>('COP');
  const [activeView, setActiveView] = useState<'shop' | 'tracking' | 'admin'>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuraBotOpen, setIsAuraBotOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activeOrderForTracking, setActiveOrderForTracking] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProducts(),
        fetchOrders(),
        fetchReviews(),
        fetchCustomers(),
        fetchDropiStatus(),
        fetchDropiCatalog()
      ]);
    } catch (err) {
      console.error('Error al cargar datos iniciales:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDropiStatus = async () => {
    try {
      const res = await fetch('/api/dropi/status');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setDropiSettings(data.settings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDropiCatalog = async () => {
    try {
      const res = await fetch('/api/dropi/catalog');
      if (res.ok) {
        const data = await res.json();
        setDropiCatalog(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Cart Management
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Price Formatting
  const formatPrice = (amountCOP: number): string => {
    if (currency === 'USD') {
      const usd = (amountCOP / 4000).toFixed(2);
      return `$${usd} USD`;
    }
    return `$${amountCOP.toLocaleString('es-CO')} COP`;
  };

  // Actions
  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      throw new Error('No se pudo procesar la orden');
    }
    const data = await res.json();
    await fetchOrders();
    await fetchProducts();
    await fetchCustomers();
    clearCart();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F472B6', '#FB7185', '#34D399', '#FBBF24']
      });
    } catch (e) {}

    return data.order;
  };

  const generateDropiGuide = async (orderId: string, courier?: string) => {
    const res = await fetch(`/api/orders/${orderId}/generate-guide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courier })
    });
    if (res.ok) {
      await fetchOrders();
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, description?: string) => {
    const res = await fetch(`/api/orders/${orderId}/update-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, description })
    });
    if (res.ok) {
      await fetchOrders();
    }
  };

  const importDropiProduct = async (dropiItemId: string, markupPercentage: number) => {
    const res = await fetch('/api/dropi/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dropiItemId, markupPercentage })
    });
    if (res.ok) {
      await fetchProducts();
    }
  };

  const syncDropiInventory = async () => {
    const res = await fetch('/api/dropi/sync-inventory', { method: 'POST' });
    if (res.ok) {
      await fetchProducts();
      await fetchDropiStatus();
    }
  };

  const connectDropi = async (settings: Partial<DropiSettings>) => {
    const res = await fetch('/api/dropi/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      await fetchDropiStatus();
    }
  };

  const addReview = async (reviewData: Partial<Review>) => {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (res.ok) {
      await fetchReviews();
      await fetchProducts();
    }
  };

  const markNotificationsAsRead = () => {
    setPushNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addPushNotification = (title: string, message: string, discountCode?: string) => {
    const newPush: PushNotification = {
      id: `push-${Date.now()}`,
      title,
      message,
      timestamp: 'Ahora mismo',
      badgeText: discountCode ? `${discountCode}` : 'PROMO',
      discountCode,
      read: false
    };
    setPushNotifications(prev => [newPush, ...prev]);
  };

  const addProduct = async (productData: Partial<Product>) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (res.ok) {
      await fetchProducts();
    }
  };

  const updateProduct = async (productData: Product) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (res.ok) {
      await fetchProducts();
    }
  };

  const toggleHideProduct = async (productId: string) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const updated = { ...target, hidden: !target.hidden };
    await updateProduct(updated);
  };

  const deleteProduct = async (productId: string) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      await fetchProducts();
    }
  };

  const unreadNotificationsCount = pushNotifications.filter(n => !n.read).length;

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        reviews,
        customers,
        dropiSettings,
        dropiCatalog,
        pushNotifications,
        selectedCategory,
        currency,
        activeView,
        selectedProduct,
        isCartOpen,
        isCheckoutOpen,
        isAuraBotOpen,
        isReviewModalOpen,
        activeOrderForTracking,
        unreadNotificationsCount,
        loading,
        
        setSelectedCategory,
        setCurrency,
        setActiveView,
        setSelectedProduct,
        setIsCartOpen,
        setIsCheckoutOpen,
        setIsAuraBotOpen,
        setIsReviewModalOpen,
        setActiveOrderForTracking,
        
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        formatPrice,
        
        fetchProducts,
        fetchOrders,
        fetchDropiStatus,
        createOrder,
        generateDropiGuide,
        updateOrderStatus,
        importDropiProduct,
        syncDropiInventory,
        connectDropi,
        addReview,
        markNotificationsAsRead,
        addPushNotification,
        addProduct,
        updateProduct,
        toggleHideProduct,
        deleteProduct
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore debe ser usado dentro de un StoreProvider');
  }
  return context;
};
