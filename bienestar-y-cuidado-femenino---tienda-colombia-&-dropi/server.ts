import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_REVIEWS,
  DROPI_CATALOG_MOCK,
  INITIAL_DROPI_SETTINGS
} from './src/data/mockData.js';
import {
  Product,
  Order,
  Review,
  Customer,
  DropiSettings,
  DropiCatalogItem,
  OrderStatus
} from './src/types.js';

// Initialize in-memory database
let products: Product[] = [...INITIAL_PRODUCTS];
let orders: Order[] = [...INITIAL_ORDERS];
let customers: Customer[] = [...INITIAL_CUSTOMERS];
let reviews: Review[] = [...INITIAL_REVIEWS];
let dropiCatalog: DropiCatalogItem[] = [...DROPI_CATALOG_MOCK];
let dropiSettings: DropiSettings = { ...INITIAL_DROPI_SETTINGS };

// Helper to generate IDs
const generateId = (prefix: string) => `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // --- API ENDPOINTS ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', dropiConnected: dropiSettings.isConnected });
  });

  // 1. PRODUCTS API
  app.get('/api/products', (req, res) => {
    res.json(products);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: req.body.id || generateId('prod'),
      lastSyncedAt: new Date().toISOString()
    };
    const index = products.findIndex(p => p.id === newProduct.id);
    if (index >= 0) {
      products[index] = newProduct;
    } else {
      products.unshift(newProduct);
    }
    res.json(newProduct);
  });

  app.delete('/api/products/:id', (req, res) => {
    products = products.filter(p => p.id !== req.params.id);
    res.json({ success: true, id: req.params.id });
  });

  // 2. DROPI INTEGRATION API
  app.get('/api/dropi/status', (req, res) => {
    const syncedCount = products.filter(p => p.dropiSyncStatus === 'synced').length;
    const pendingOrdersCount = orders.filter(o => o.status === 'PENDIENTE' || o.status === 'ENVIADO_DROPI').length;
    res.json({
      settings: dropiSettings,
      syncedProductsCount: syncedCount,
      totalProductsCount: products.length,
      pendingOrdersCount
    });
  });

  app.post('/api/dropi/connect', (req, res) => {
    const { apiToken, webhookSecret, defaultCourier, autoSyncEnabled } = req.body;
    dropiSettings = {
      ...dropiSettings,
      apiToken: apiToken || dropiSettings.apiToken,
      webhookSecret: webhookSecret || dropiSettings.webhookSecret,
      defaultCourier: defaultCourier || dropiSettings.defaultCourier,
      autoSyncEnabled: autoSyncEnabled !== undefined ? autoSyncEnabled : dropiSettings.autoSyncEnabled,
      isConnected: true,
      lastCatalogSyncTime: new Date().toISOString()
    };
    res.json({ success: true, settings: dropiSettings });
  });

  app.get('/api/dropi/catalog', (req, res) => {
    res.json(dropiCatalog);
  });

  app.post('/api/dropi/import', (req, res) => {
    const { dropiItemId, markupPercentage } = req.body;
    const item = dropiCatalog.find(i => i.id === dropiItemId);
    if (!item) {
      return res.status(404).json({ error: 'Producto de Dropi no encontrado' });
    }

    const markup = markupPercentage || dropiSettings.defaultMarkupPercentage || 100;
    const priceCOP = Math.round((item.wholesaleCostCOP * (1 + markup / 100)) / 100) * 100;

    const importedProduct: Product = {
      id: generateId('prod-dropi'),
      title: item.title,
      subtitle: `Importado de red Dropi Colombia - ${item.supplierName}`,
      description: `Producto de alta demanda sincronizado directamente de la bodega de ${item.supplierName} en Colombia. Garantía directa y despacho contraentrega.`,
      priceCOP,
      originalPriceCOP: Math.round(priceCOP * 1.3),
      category: item.category as any,
      image: item.image,
      rating: item.rating,
      reviewCount: Math.floor(Math.random() * 50) + 10,
      stock: item.stockAvailable,
      dropiProductId: item.id,
      dropiSupplierName: item.supplierName,
      dropiCostCOP: item.wholesaleCostCOP,
      dropiSyncStatus: 'synced',
      lastSyncedAt: new Date().toISOString(),
      features: [
        'Despacho rápido directo de bodega en Colombia',
        'Sostenible para Pago Contraentrega',
        `Sincronizado con Dropi ID ${item.id}`
      ]
    };

    products.unshift(importedProduct);
    res.json({ success: true, product: importedProduct });
  });

  app.post('/api/dropi/sync-inventory', (req, res) => {
    // Simulate updating stock and price from Dropi network
    products = products.map(p => {
      if (p.dropiProductId) {
        return {
          ...p,
          stock: Math.max(5, p.stock + Math.floor(Math.random() * 10) - 2),
          dropiSyncStatus: 'synced' as const,
          lastSyncedAt: new Date().toISOString()
        };
      }
      return p;
    });
    dropiSettings.lastCatalogSyncTime = new Date().toISOString();
    res.json({
      success: true,
      syncedAt: dropiSettings.lastCatalogSyncTime,
      totalSynced: products.filter(p => p.dropiSyncStatus === 'synced').length
    });
  });

  // 3. ORDERS & CHECKOUT API
  app.get('/api/orders', (req, res) => {
    res.json(orders);
  });

  app.post('/api/orders', (req, res) => {
    const {
      customerName,
      email,
      phone,
      department,
      city,
      address,
      complement,
      notes,
      paymentMethod,
      items,
      totalCOP
    } = req.body;

    if (!customerName || !phone || !city || !items || items.length === 0) {
      return res.status(400).json({ error: 'Faltan datos requeridos para el envío' });
    }

    const newOrder: Order = {
      id: generateId('ORD'),
      customerName,
      email: email || `${phone}@client.tienda.co`,
      phone,
      department,
      city,
      address,
      complement,
      notes,
      paymentMethod: 'COD',
      paymentStatus: 'cod_pending',
      totalCOP,
      items,
      status: 'PENDIENTE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          timestamp: new Date().toISOString(),
          status: 'PENDIENTE',
          description: 'Pedido recibido en tienda. Método de pago: Pago Contraentrega (COD)',
          location: `${city}, ${department}`
        }
      ]
    };

    // Auto-Sync with Dropi Colombia if connected
    if (dropiSettings.isConnected) {
      newOrder.dropiOrderId = generateId('DP-ORD');
      newOrder.status = 'ENVIADO_DROPI';
      newOrder.statusHistory.push({
        timestamp: new Date().toISOString(),
        status: 'ENVIADO_DROPI',
        description: `Orden enviada exitosamente a la API de Dropi Colombia (Dropi ID: ${newOrder.dropiOrderId})`,
        location: 'Servidor Dropi Colombia'
      });
    }

    orders.unshift(newOrder);

    // Update Customer CRM record or add new
    const existingCustIndex = customers.findIndex(c => c.phone === phone || c.email === email);
    if (existingCustIndex >= 0) {
      customers[existingCustIndex].totalSpentCOP += totalCOP;
      customers[existingCustIndex].orderCount += 1;
      customers[existingCustIndex].lastOrderDate = new Date().toISOString().split('T')[0];
    } else {
      customers.unshift({
        id: generateId('cust'),
        name: customerName,
        email: email || `${phone}@auracare.co`,
        phone,
        city,
        department,
        totalSpentCOP: totalCOP,
        orderCount: 1,
        lastOrderDate: new Date().toISOString().split('T')[0]
      });
    }

    // Reduce product stock
    items.forEach((it: any) => {
      const prod = products.find(p => p.id === it.productId);
      if (prod && prod.stock > 0) {
        prod.stock = Math.max(0, prod.stock - it.quantity);
      }
    });

    res.json({ success: true, order: newOrder });
  });

  // Generate Dropi Shipping Guide (Servientrega, Envía, Interrapidísimo, TCC)
  app.post('/api/orders/:id/generate-guide', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const courier = (req.body.courier || dropiSettings.defaultCourier || 'Envía') as any;
    const prefixMap: Record<string, string> = {
      Servientrega: 'SER',
      Interrapidisimo: 'INT',
      Envía: 'ENV',
      TCC: 'TCC',
      Coordinadora: 'COO'
    };
    const prefix = prefixMap[courier] || 'DRO';
    const guideNumber = `${prefix}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    order.dropiGuideNumber = guideNumber;
    order.courierName = courier;
    order.status = 'GUIA_GENERADA';
    order.updatedAt = new Date().toISOString();

    order.statusHistory.push({
      timestamp: new Date().toISOString(),
      status: 'GUIA_GENERADA',
      description: `Guía oficial de envío #${guideNumber} generada en Dropi con la transportadora ${courier}`,
      location: `Bodega Dropi ${order.department}`
    });

    res.json({ success: true, order, guideNumber, courier });
  });

  // Advance Order Status (Admin or Webhook trigger)
  app.post('/api/orders/:id/update-status', (req, res) => {
    const { status, description, location } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    order.status = status as OrderStatus;
    order.updatedAt = new Date().toISOString();

    if (status === 'ENTREGADO' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'paid';
    }

    order.statusHistory.push({
      timestamp: new Date().toISOString(),
      status: status as OrderStatus,
      description: description || `Estado actualizado a ${status}`,
      location: location || order.city
    });

    res.json({ success: true, order });
  });

  // 4. TRACKING API
  app.get('/api/tracking/:query', (req, res) => {
    const q = req.params.query.trim().toUpperCase();
    const order = orders.find(
      o => o.id.toUpperCase() === q || (o.dropiGuideNumber && o.dropiGuideNumber.toUpperCase() === q)
    );

    if (!order) {
      return res.status(404).json({ error: 'No se encontró ninguna guía o pedido con el código ingresado' });
    }

    res.json(order);
  });

  // 5. REVIEWS API
  app.get('/api/reviews', (req, res) => {
    res.json(reviews);
  });

  app.post('/api/reviews', (req, res) => {
    const { productId, author, city, rating, comment, userPhoto } = req.body;
    const product = products.find(p => p.id === productId);

    const newReview: Review = {
      id: generateId('rev'),
      productId,
      productName: product ? product.title : 'Producto Aura Care',
      author,
      city: city || 'Colombia',
      rating: Number(rating) || 5,
      date: new Date().toISOString().split('T')[0],
      comment,
      verifiedPurchase: true,
      userPhoto,
      likes: 1
    };

    reviews.unshift(newReview);

    // Recalculate product rating
    if (product) {
      const prodReviews = reviews.filter(r => r.productId === productId);
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      product.rating = Number(avg.toFixed(1));
      product.reviewCount = prodReviews.length;
    }

    res.json({ success: true, review: newReview });
  });

  // 6. CUSTOMERS CRM API
  app.get('/api/customers', (req, res) => {
    res.json(customers);
  });

  // 7. ANALYTICS API
  app.get('/api/analytics', (req, res) => {
    const totalSalesCOP = orders.reduce((sum, o) => sum + o.totalCOP, 0);
    const totalOrdersCount = orders.length;
    const codOrdersCount = orders.filter(o => o.paymentMethod === 'COD').length;
    const codPercentage = totalOrdersCount > 0 ? Math.round((codOrdersCount / totalOrdersCount) * 100) : 0;
    const deliveredCount = orders.filter(o => o.status === 'ENTREGADO').length;

    // City distribution
    const cityMap: Record<string, number> = {};
    orders.forEach(o => {
      cityMap[o.city] = (cityMap[o.city] || 0) + o.totalCOP;
    });

    const topCities = Object.entries(cityMap)
      .map(([city, total]) => ({ city, total }))
      .sort((a, b) => b.total - a.total);

    res.json({
      totalSalesCOP,
      totalOrdersCount,
      codPercentage,
      deliveredCount,
      topCities,
      dropiConnected: dropiSettings.isConnected
    });
  });

  // 8. AI ASSISTANT API (GEMINI)
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({
          reply: '✨ ¡Hola! Soy Aura Bot, tu asesora de bienestar femenino. Actualmente estoy en modo offline, pero puedo responderte que la Banda Térmica "Aura Heat" es excelente para aliviar cólicos en 5 minutos y que enviamos con Pago Contraentrega a toda Colombia a través de Dropi.'
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Eres "Aura Bot", la asesora virtual experta en cuidado personal femenino, salud menstrual y bienestar de la tienda Aura Care Colombia.
Tu tono es cálido, empático, estético, amable, con modismos colombianos amigables (ej. "¡Hola linda!", "con mucho gusto", "un abrazo").

Contexto de la tienda:
- Productos principales:
  1. Banda Térmica "Aura Heat" ($129.900 COP): 3 niveles de temperatura (45°C, 55°C, 65°C), 4 modos de vibración, inalámbrica recargable USB-C. Ideal para cólicos.
  2. Kit Rasuradora Femenina "Velvet Touch" ($98.900 COP): Inalámbrica IPX7 con gel calmante de rosas y aloe vera.
  3. Parches Térmicos Herbales "Aura Herbal" ($45.000 COP pack x6): 8 horas de calor constante con artemisa y manzanilla.
  4. Kit "Bienestar & Cero Cólicos" ($159.900 COP): Incluye Banda + Parches + Termo.
- Métodos de pago en Colombia: Pago Contraentrega (COD) en efectivo al recibir, PSE, Nequi, Daviplata, Tarjetas de Crédito.
- Logística: Despachamos en tiempo real con Dropi Colombia usando Servientrega, Envía, Interrapidísimo o TCC. Tiempo de entrega: 24 a 48 horas en ciudades principales.

Responde la siguiente duda del usuario de forma breve, concisa y empática (máximo 3 párrafos cortos):
Usuario: "${message}"
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = response.text || 'Disculpa, no pude procesar tu solicitud. ¿En qué te puedo ayudar sobre nuestros productos Aura Care?';
      res.json({ reply: text });
    } catch (error: any) {
      console.error('Error en Gemini AI Chat:', error);
      res.json({
        reply: '¡Hola! Todos nuestros productos para el cuidado femenino cuentan con envío gratis y Pago Contraentrega en Colombia a través de la red Dropi. ¿Te gustaría saber más sobre la Banda Térmica Aura Heat o el Kit Velvet Touch?'
      });
    }
  });

  // Serve static assets or Vite dev server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Servidor Aura Care + Dropi Colombia escuchando en puerto ${PORT}`);
  });
}

startServer();
