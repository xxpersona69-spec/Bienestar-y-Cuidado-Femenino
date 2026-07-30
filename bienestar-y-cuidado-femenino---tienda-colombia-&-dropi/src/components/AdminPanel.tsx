import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CourierName, OrderStatus, Product, ProductCategory } from '../types';
import {
  SlidersHorizontal,
  RefreshCw,
  CheckCircle2,
  Truck,
  DollarSign,
  Package,
  Users,
  Bell,
  BarChart3,
  Search,
  Download,
  Plus,
  Send,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Printer,
  FileCheck,
  Building2,
  Trash2,
  Eye,
  EyeOff,
  Edit3,
  X,
  Check,
  ShoppingBag,
  Tag
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export const AdminPanel: React.FC = () => {
  const {
    products,
    orders,
    customers,
    dropiSettings,
    dropiCatalog,
    formatPrice,
    generateDropiGuide,
    updateOrderStatus,
    importDropiProduct,
    syncDropiInventory,
    connectDropi,
    addPushNotification,
    addProduct,
    updateProduct,
    toggleHideProduct,
    deleteProduct
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'sync' | 'catalog' | 'analytics' | 'crm'>('orders');

  // Order Delivery Filter
  const [orderDeliveryFilter, setOrderDeliveryFilter] = useState<'TODOS' | 'FALTAN_ENTREGAR' | 'ENTREGADOS' | 'CANCELADOS'>('TODOS');

  // Credentials form
  const [apiToken, setApiToken] = useState(dropiSettings.apiToken);
  const [webhookSecret, setWebhookSecret] = useState(dropiSettings.webhookSecret);
  const [defaultCourier, setDefaultCourier] = useState<CourierName>(dropiSettings.defaultCourier);
  const [autoSync, setAutoSync] = useState(dropiSettings.autoSyncEnabled);
  const [saveMsg, setSaveMsg] = useState('');

  // Import Markup percentage
  const [markup, setMarkup] = useState(110);

  // Filter orders
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedCourierFilter, setSelectedCourierFilter] = useState<string>('TODOS');

  // Product Search / Filter in Admin
  const [productSearch, setProductSearch] = useState('');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form State
  const [prodTitle, setProdTitle] = useState('');
  const [prodSubtitle, setProdSubtitle] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('BIENESTAR');
  const [prodPriceCOP, setProdPriceCOP] = useState(40000);
  const [prodOriginalPriceCOP, setProdOriginalPriceCOP] = useState(75000);
  const [prodStock, setProdStock] = useState(50);
  const [prodImage, setProdImage] = useState('');
  const [prodFeatures, setProdFeatures] = useState('');
  const [prodDropiId, setProdDropiId] = useState('');
  const [prodDropiSupplier, setProdDropiSupplier] = useState('');
  const [prodDropiCost, setProdDropiCost] = useState(20000);

  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => setAnalyticsData(data))
      .catch(e => console.error(e));
  }, [orders]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await connectDropi({
      apiToken,
      webhookSecret,
      defaultCourier,
      autoSyncEnabled: autoSync
    });
    setSaveMsg('¡Configuración de Dropi Colombia guardada con éxito!');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  // Open Create Product Modal
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProdTitle('');
    setProdSubtitle('Producto de Alta Calidad');
    setProdDescription('');
    setProdCategory('BIENESTAR');
    setProdPriceCOP(40000);
    setProdOriginalPriceCOP(70000);
    setProdStock(50);
    setProdImage('/src/assets/images/bienestar_femenino_logo_1785357642273.jpg');
    setProdFeatures('Envío rápido a toda Colombia, Garantía de satisfacción, Pago contraentrega');
    setProdDropiId(`DROPI-COL-${Math.floor(1000 + Math.random() * 9000)}`);
    setProdDropiSupplier('Proveedor Nacional Colombia');
    setProdDropiCost(20000);
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdTitle(p.title);
    setProdSubtitle(p.subtitle || '');
    setProdDescription(p.description || '');
    setProdCategory(p.category || 'BIENESTAR');
    setProdPriceCOP(p.priceCOP);
    setProdOriginalPriceCOP(p.originalPriceCOP || Math.round(p.priceCOP * 1.5));
    setProdStock(p.stock || 50);
    setProdImage(p.image);
    setProdFeatures(p.features ? p.features.join(', ') : '');
    setProdDropiId(p.dropiProductId || '');
    setProdDropiSupplier(p.dropiSupplierName || '');
    setProdDropiCost(p.dropiCostCOP || 20000);
    setIsProductModalOpen(true);
  };

  // Save Product Form Handler
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const featuresList = prodFeatures
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const productPayload: any = {
      title: prodTitle,
      subtitle: prodSubtitle,
      description: prodDescription,
      category: prodCategory,
      priceCOP: Number(prodPriceCOP),
      originalPriceCOP: Number(prodOriginalPriceCOP),
      stock: Number(prodStock),
      image: prodImage || '/src/assets/images/bienestar_femenino_logo_1785357642273.jpg',
      features: featuresList.length > 0 ? featuresList : ['Envío rápido', 'Pago contraentrega'],
      dropiProductId: prodDropiId,
      dropiSupplierName: prodDropiSupplier,
      dropiCostCOP: Number(prodDropiCost),
      dropiSyncStatus: 'synced',
      lastSyncedAt: new Date().toISOString(),
      rating: editingProduct ? editingProduct.rating : 4.9,
      reviewCount: editingProduct ? editingProduct.reviewCount : 12
    };

    if (editingProduct) {
      productPayload.id = editingProduct.id;
      productPayload.hidden = editingProduct.hidden;
      await updateProduct(productPayload);
    } else {
      productPayload.hidden = false;
      await addProduct(productPayload);
    }

    setIsProductModalOpen(false);
  };

  // Filter Orders
  const pendingOrdersCount = orders.filter(o => o.status !== 'ENTREGADO' && o.status !== 'CANCELADO').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'ENTREGADO').length;
  const cancelledOrdersCount = orders.filter(o => o.status === 'CANCELADO').length;

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.city.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.dropiGuideNumber && o.dropiGuideNumber.toLowerCase().includes(orderSearch.toLowerCase()));

    const matchesCourier =
      selectedCourierFilter === 'TODOS' || o.courierName === selectedCourierFilter;

    let matchesDelivery = true;
    if (orderDeliveryFilter === 'FALTAN_ENTREGAR') {
      matchesDelivery = o.status !== 'ENTREGADO' && o.status !== 'CANCELADO';
    } else if (orderDeliveryFilter === 'ENTREGADOS') {
      matchesDelivery = o.status === 'ENTREGADO';
    } else if (orderDeliveryFilter === 'CANCELADOS') {
      matchesDelivery = o.status === 'CANCELADO';
    }

    return matchesSearch && matchesCourier && matchesDelivery;
  });

  // Filter Products for admin view
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.dropiProductId && p.dropiProductId.toLowerCase().includes(productSearch.toLowerCase()))
  );

  // Recharts Colors
  const COLORS = ['#F472B6', '#FB7185', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Admin Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-800/80 text-amber-200 text-xs font-bold mb-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-300" />
            <span>Panel de Control de Tienda • Sincronización Dropi Colombia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            Gestión de Pedidos, Catálogo & Dropi
          </h1>
          <p className="text-xs text-rose-200/80 mt-1">
            Administra tus productos, oculta/muestra artículos, visualiza envíos pendientes y entregados, e integra con Dropi.
          </p>
        </div>

        <button
          onClick={() => syncDropiInventory()}
          className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-rose-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-102"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sincronizar Inventario Dropi</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-rose-500 text-white shadow-xs' : 'text-rose-900 hover:bg-rose-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Pedidos & Guías ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'products' ? 'bg-rose-500 text-white shadow-xs' : 'text-rose-900 hover:bg-rose-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Gestión de Productos ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sync')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'sync' ? 'bg-rose-500 text-white shadow-xs' : 'text-rose-900 hover:bg-rose-100'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Conexión Dropi</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'catalog' ? 'bg-rose-500 text-white shadow-xs' : 'text-rose-900 hover:bg-rose-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Catálogo Dropi ({dropiCatalog.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-rose-500 text-white shadow-xs' : 'text-rose-900 hover:bg-rose-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analíticas</span>
        </button>

        <button
          onClick={() => setActiveTab('crm')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'crm' ? 'bg-rose-500 text-white shadow-xs' : 'text-rose-900 hover:bg-rose-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Clientes ({customers.length})</span>
        </button>
      </div>

      {/* TAB 1: PEDIDOS & GUÍAS DE ENVÍO */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Order Delivery Status Filter Tabs */}
          <div className="flex overflow-x-auto gap-2 border-b border-rose-200 pb-2 text-xs">
            <button
              onClick={() => setOrderDeliveryFilter('TODOS')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                orderDeliveryFilter === 'TODOS'
                  ? 'bg-rose-950 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
              }`}
            >
              Todos los Pedidos ({orders.length})
            </button>

            <button
              onClick={() => setOrderDeliveryFilter('FALTAN_ENTREGAR')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                orderDeliveryFilter === 'FALTAN_ENTREGAR'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Faltan por entregar ({pendingOrdersCount})</span>
            </button>

            <button
              onClick={() => setOrderDeliveryFilter('ENTREGADOS')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                orderDeliveryFilter === 'ENTREGADOS'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Entregados con éxito ({deliveredOrdersCount})</span>
            </button>

            <button
              onClick={() => setOrderDeliveryFilter('CANCELADOS')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                orderDeliveryFilter === 'CANCELADOS'
                  ? 'bg-rose-800 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Cancelados ({cancelledOrdersCount})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-rose-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar cliente, ciudad o guía..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-semibold text-rose-950"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-rose-700 font-bold">Transportadora:</span>
              <select
                value={selectedCourierFilter}
                onChange={e => setSelectedCourierFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-rose-200 rounded-xl font-semibold text-rose-950"
              >
                <option value="TODOS">Todas las Transportadoras</option>
                <option value="Envía">Envía</option>
                <option value="Servientrega">Servientrega</option>
                <option value="Interrapidisimo">Interrapidísimo</option>
                <option value="TCC">TCC</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-rose-100 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-rose-950">
                <thead className="bg-rose-50/70 border-b border-rose-100 text-rose-900 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Pedido ID</th>
                    <th className="p-4">Cliente & Dirección</th>
                    <th className="p-4">Método Pago</th>
                    <th className="p-4">Total COP</th>
                    <th className="p-4">Guía Dropi</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acción Guía</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-rose-100/80">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-rose-400">
                        No se encontraron pedidos con el filtro especificado.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-rose-50/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-rose-950">
                          {o.id}
                          <span className="block text-[10px] text-rose-400 font-sans">
                            {new Date(o.createdAt).toLocaleDateString('es-CO')}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-bold block text-rose-950">{o.customerName}</span>
                          <span className="text-[11px] text-rose-700 block">{o.city}, {o.department}</span>
                          <span className="text-[10px] text-rose-500">{o.phone}</span>
                        </td>

                        <td className="p-4">
                          <span className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            o.paymentMethod === 'COD' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {o.paymentMethod === 'COD' ? 'Contraentrega' : o.paymentMethod}
                          </span>
                        </td>

                        <td className="p-4 font-bold text-rose-950">
                          {formatPrice(o.totalCOP)}
                        </td>

                        <td className="p-4">
                          {o.dropiGuideNumber ? (
                            <div>
                              <span className="font-mono font-bold text-emerald-800 block text-xs">
                                {o.dropiGuideNumber}
                              </span>
                              <span className="text-[10px] text-rose-500 font-semibold">
                                {o.courierName || 'Envía'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
                              Sin Guía
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <select
                            value={o.status}
                            onChange={e => updateOrderStatus(o.id, e.target.value)}
                            className="px-2 py-1 rounded-lg border border-rose-200 text-[11px] font-bold text-rose-950 bg-rose-50/50"
                          >
                            <option value="PENDIENTE">PENDIENTE</option>
                            <option value="ENVIADO_DROPI">ENVIADO DROPI</option>
                            <option value="GUIA_GENERADA">GUIA GENERADA</option>
                            <option value="EN_TRANSITO">EN TRANSITO</option>
                            <option value="EN_REPARTO">EN REPARTO</option>
                            <option value="ENTREGADO">ENTREGADO</option>
                            <option value="CANCELADO">CANCELADO</option>
                          </select>
                        </td>

                        <td className="p-4 text-right">
                          {!o.dropiGuideNumber ? (
                            <button
                              onClick={() => generateDropiGuide(o.id, 'Envía')}
                              className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] shadow-2xs"
                            >
                              Generar Guía
                            </button>
                          ) : (
                            <button
                              onClick={() => alert(`🖨️ Imprimiendo Rótulo de Envío Dropi\nGuía: ${o.dropiGuideNumber}\nTransportadora: ${o.courierName}\nDestinatario: ${o.customerName} (${o.city})`)}
                              className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-950 font-bold text-[11px] flex items-center gap-1 ml-auto"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Imprimir Rótulo</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GESTIÓN DE PRODUCTOS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-rose-100 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-rose-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por nombre o ID Dropi..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-rose-50/40 border border-rose-200 rounded-xl text-xs font-semibold text-rose-950 focus:outline-none focus:border-rose-400"
              />
            </div>

            <button
              onClick={handleOpenCreateProduct}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-200 transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nuevo Producto</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-rose-100 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-rose-950">
                <thead className="bg-rose-50/70 border-b border-rose-100 text-rose-900 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Producto</th>
                    <th className="p-4">Precio Venta</th>
                    <th className="p-4">Costo Dropi</th>
                    <th className="p-4">Proveedor Dropi</th>
                    <th className="p-4">Estado Tienda</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-rose-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-rose-400">
                        No hay productos registrados en el catálogo.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-rose-50/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover bg-rose-50 border border-rose-200 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-rose-950 block text-xs">{p.title}</span>
                              <span className="text-[10px] text-rose-500 block">{p.subtitle}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-bold text-rose-950">
                          {formatPrice(p.priceCOP)}
                          {p.originalPriceCOP && (
                            <span className="block text-[10px] text-rose-400 line-through font-normal">
                              {formatPrice(p.originalPriceCOP)}
                            </span>
                          )}
                        </td>

                        <td className="p-4 font-bold text-emerald-800">
                          {p.dropiCostCOP ? formatPrice(p.dropiCostCOP) : '$0 COP'}
                        </td>

                        <td className="p-4">
                          <span className="font-semibold block text-xs">{p.dropiSupplierName || 'Dropi Colombia'}</span>
                          <span className="text-[10px] text-rose-400 font-mono block">ID: {p.dropiProductId || 'N/A'}</span>
                        </td>

                        <td className="p-4">
                          {p.hidden ? (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                              <EyeOff className="w-3 h-3 text-amber-700" />
                              <span>Oculto</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                              <Eye className="w-3 h-3 text-emerald-700" />
                              <span>En Tienda</span>
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle Hide */}
                            <button
                              onClick={() => toggleHideProduct(p.id)}
                              title={p.hidden ? "Mostrar en la tienda" : "Ocultar de la tienda"}
                              className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                                p.hidden
                                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                              }`}
                            >
                              {p.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              title="Editar Producto"
                              className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (confirm(`¿Seguro que deseas eliminar el producto "${p.title}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              title="Eliminar Producto"
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-200 text-rose-600 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SINCRONIZACIÓN DROPI COLOMBIA */}
      {activeTab === 'sync' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-lg space-y-4">
            <h2 className="font-serif font-bold text-lg text-rose-950 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-rose-500" />
              Credenciales & Conexión API Dropi Colombia
            </h2>

            {saveMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                {saveMsg}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-rose-900 mb-1">Token de API Live Dropi Colombia</label>
                <input
                  type="password"
                  value={apiToken}
                  onChange={e => setApiToken(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl font-mono text-rose-950"
                  placeholder="dropi_live_tk_colombia_..."
                />
              </div>

              <div>
                <label className="block font-bold text-rose-900 mb-1">Clave Secreta para Webhooks (Notificaciones en tiempo real)</label>
                <input
                  type="password"
                  value={webhookSecret}
                  onChange={e => setWebhookSecret(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl font-mono text-rose-950"
                  placeholder="whsec_aura_dropi_..."
                />
              </div>

              <div>
                <label className="block font-bold text-rose-900 mb-1">Transportadora Predeterminada en Colombia</label>
                <select
                  value={defaultCourier}
                  onChange={e => setDefaultCourier(e.target.value as CourierName)}
                  className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-rose-950 font-bold"
                >
                  <option value="Envía">Envía (Recomendada para COD)</option>
                  <option value="Servientrega">Servientrega</option>
                  <option value="Interrapidisimo">Interrapidísimo</option>
                  <option value="TCC">TCC</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="autosync"
                  checked={autoSync}
                  onChange={e => setAutoSync(e.target.checked)}
                  className="w-4 h-4 text-rose-500 rounded-md"
                />
                <label htmlFor="autosync" className="font-semibold text-rose-950">
                  Auto-Sincronizar inventario y guías cada 15 minutos
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all"
              >
                Guardar Configuración Dropi
              </button>
            </form>
          </div>

          {/* Sync Stats Box */}
          <div className="bg-rose-50/60 rounded-3xl border border-rose-100 p-6 space-y-4">
            <h2 className="font-serif font-bold text-lg text-rose-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Estado del Motor de Sincronización
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-2xl border border-rose-100 flex justify-between items-center">
                <span className="font-semibold text-rose-900">Estado de API:</span>
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
                  CONECTADO
                </span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-rose-100 flex justify-between items-center">
                <span className="font-semibold text-rose-900">Productos Vinculados:</span>
                <span className="font-bold text-rose-950">{products.length} productos</span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-rose-100 flex justify-between items-center">
                <span className="font-semibold text-rose-900">Última Sincronización:</span>
                <span className="font-mono text-rose-950">{new Date(dropiSettings.lastCatalogSyncTime).toLocaleTimeString('es-CO')}</span>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <b>Nota sobre Pago Contraentrega:</b> Dropi Colombia liquida el dinero recaudado de tus pedidos COD semanalmente directo a tu cuenta de ahorros o Nequi configurado.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: CATÁLOGO DROPI PARA IMPORTAR */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-serif font-bold text-rose-950 block text-sm">
                Red de Proveedores Dropi Colombia
              </span>
              <span className="text-rose-700">Importa productos ganadores con 1-click y define tu margen de ganancia en COP.</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-rose-900">Margen sugerido:</span>
              <input
                type="number"
                value={markup}
                onChange={e => setMarkup(Number(e.target.value))}
                className="w-16 px-2 py-1 bg-white border border-rose-200 rounded-lg text-center font-bold text-rose-950"
              />
              <span className="font-bold">%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dropiCatalog.map(item => {
              const suggestedCOP = Math.round((item.wholesaleCostCOP * (1 + markup / 100)) / 100) * 100;
              const profitCOP = suggestedCOP - item.wholesaleCostCOP;

              return (
                <div key={item.id} className="bg-white rounded-3xl border border-rose-100 p-4 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-44 rounded-2xl object-cover bg-rose-50"
                    />

                    <div>
                      <span className="text-[10px] font-bold text-rose-500 uppercase bg-rose-100 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      <h3 className="font-serif font-bold text-sm text-rose-950 mt-1">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-rose-400">Proveedor: {item.supplierName}</p>
                    </div>

                    <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 text-xs space-y-1">
                      <div className="flex justify-between text-rose-900">
                        <span>Costo Mayorista Dropi:</span>
                        <span className="font-bold">{formatPrice(item.wholesaleCostCOP)}</span>
                      </div>
                      <div className="flex justify-between text-rose-900">
                        <span>Precio de Venta Sugerido:</span>
                        <span className="font-bold text-rose-950">{formatPrice(suggestedCOP)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-extrabold pt-1 border-t border-rose-200">
                        <span>Tu Ganancia estimada:</span>
                        <span>+{formatPrice(profitCOP)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => importDropiProduct(item.id, markup)}
                    className="w-full mt-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Importar a Mi Tienda</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ANALÍTICAS & VENTAS RECHARTS */}
      {activeTab === 'analytics' && analyticsData && (
        <div className="space-y-8">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-rose-100 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-400 block">Ventas Totales (COP)</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-rose-950">
                {formatPrice(analyticsData.totalSalesCOP)}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block">+18.5% esta semana</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-rose-100 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-400 block">Total Pedidos</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-rose-950">
                {analyticsData.totalOrdersCount}
              </span>
              <span className="text-[10px] text-rose-600 font-bold block">Despachados Dropi</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-rose-100 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-400 block">% Pago Contraentrega</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-rose-950">
                {analyticsData.codPercentage}%
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block">Alta conversión en Colombia</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-rose-100 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-400 block">Entregados con Éxito</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-rose-950">
                {analyticsData.deliveredCount}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block">Tasa recaudación 98%</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Top Cities Chart */}
            <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-rose-950">
                Ventas por Ciudades Principales en Colombia
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.topCities}>
                    <XAxis dataKey="city" stroke="#9F1239" fontSize={11} />
                    <YAxis stroke="#9F1239" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="total" fill="#F472B6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Method Distribution */}
            <div className="p-6 bg-white rounded-3xl border border-rose-100 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-rose-950">
                Distribución por Método de Pago
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Pago Contraentrega (100% COD)', value: 100 }
                      ]}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      <Cell fill="#10B981" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: CLIENTES CRM */}
      {activeTab === 'crm' && (
        <div className="bg-white rounded-3xl border border-rose-100 shadow-lg overflow-hidden p-6 space-y-4">
          <h2 className="font-serif font-bold text-lg text-rose-950">Gestión de Clientes (CRM)</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-rose-950">
              <thead className="bg-rose-50/70 border-b border-rose-100 text-rose-900 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Contacto</th>
                  <th className="p-3">Ubicación</th>
                  <th className="p-3">Total Comprado (COP)</th>
                  <th className="p-3">Pedidos</th>
                  <th className="p-3 text-right">Acción WhatsApp</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-rose-100">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-rose-400">
                      No hay clientes registrados actualmente.
                    </td>
                  </tr>
                ) : (
                  customers.map(c => (
                    <tr key={c.id} className="hover:bg-rose-50/40">
                      <td className="p-3 font-bold text-rose-950">{c.name}</td>
                      <td className="p-3 text-rose-700">{c.phone}<br />{c.email}</td>
                      <td className="p-3">{c.city}, {c.department}</td>
                      <td className="p-3 font-bold text-rose-950">{formatPrice(c.totalSpentCOP)}</td>
                      <td className="p-3">{c.orderCount} ordenes</td>
                      <td className="p-3 text-right">
                        <a
                          href={`https://wa.me/57${c.phone}?text=Hola%20${encodeURIComponent(c.name)},%20te%20saludamos.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-bold text-[11px] inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3 text-emerald-700" />
                          <span>Escribir por WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCT CREATION / EDITING MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-rose-100 shadow-2xl p-6 sm:p-8 max-w-2xl w-full my-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-rose-400 hover:text-rose-700 hover:bg-rose-50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-rose-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-rose-950">
                  {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
                </h2>
                <p className="text-xs text-rose-700">
                  Configura los detalles del producto y la conexión con proveedores de Dropi.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-rose-900 mb-1">Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    value={prodTitle}
                    onChange={e => setProdTitle(e.target.value)}
                    placeholder="Ej. Banda Térmica para Cólicos"
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl font-semibold text-rose-950 focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-rose-900 mb-1">Subtítulo / Eslogan</label>
                  <input
                    type="text"
                    value={prodSubtitle}
                    onChange={e => setProdSubtitle(e.target.value)}
                    placeholder="Ej. Alivio inmediato en 5 min"
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-rose-950 focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-rose-900 mb-1">Descripción del Producto</label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={e => setProdDescription(e.target.value)}
                  placeholder="Describe los beneficios principales del producto..."
                  className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-rose-950 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-rose-900 mb-1">Precio Venta (COP) *</label>
                  <input
                    type="number"
                    required
                    value={prodPriceCOP}
                    onChange={e => setProdPriceCOP(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl font-mono font-bold text-rose-950"
                  />
                </div>

                <div>
                  <label className="block font-bold text-rose-900 mb-1">Precio Original / Tachado (COP)</label>
                  <input
                    type="number"
                    value={prodOriginalPriceCOP}
                    onChange={e => setProdOriginalPriceCOP(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl font-mono text-rose-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-rose-900 mb-1">Inventario / Stock</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={e => setProdStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl font-mono text-rose-950"
                  />
                </div>

                <div>
                  <label className="block font-bold text-rose-900 mb-1">URL de la Imagen</label>
                  <input
                    type="text"
                    value={prodImage}
                    onChange={e => setProdImage(e.target.value)}
                    placeholder="/src/assets/images/..."
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl font-mono text-rose-950"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-rose-900 mb-1">Características Clave (Separadas por coma)</label>
                <input
                  type="text"
                  value={prodFeatures}
                  onChange={e => setProdFeatures(e.target.value)}
                  placeholder="3 niveles de temperatura, Carga rápida USB, 4 modos de masaje"
                  className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-rose-950"
                />
              </div>

              {/* DROPI CONNECTION BOX */}
              <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200 space-y-3">
                <div className="flex items-center gap-2 font-serif font-bold text-rose-950 text-sm">
                  <RefreshCw className="w-4 h-4 text-rose-500" />
                  <span>Conexión de Producto con Dropi Colombia</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-rose-900 text-[11px] mb-1">ID Producto Dropi</label>
                    <input
                      type="text"
                      value={prodDropiId}
                      onChange={e => setProdDropiId(e.target.value)}
                      placeholder="DROPI-10492"
                      className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl font-mono text-rose-950"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-rose-900 text-[11px] mb-1">Proveedor Dropi</label>
                    <input
                      type="text"
                      value={prodDropiSupplier}
                      onChange={e => setProdDropiSupplier(e.target.value)}
                      placeholder="Bodega Nacional Dropi"
                      className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-rose-950"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-rose-900 text-[11px] mb-1">Costo Mayorista COP</label>
                    <input
                      type="number"
                      value={prodDropiCost}
                      onChange={e => setProdDropiCost(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl font-mono text-rose-950"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="w-1/3 py-3 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200"
                >
                  {editingProduct ? 'Guardar Cambios del Producto' : 'Crear & Publicar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
