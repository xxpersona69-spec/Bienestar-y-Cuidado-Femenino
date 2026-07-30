import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ShieldCheck, Truck, CreditCard, Flame, ArrowRight, CheckCircle, Heart, Star } from 'lucide-react';

const heatBeltImg = '/src/assets/images/banda_termica_colombia_1785357617957.jpg';
const razorKitImg = '/src/assets/images/kit_depilador_femenino_1785357630428.jpg';

export const Hero: React.FC = () => {
  const { setSelectedProduct, products, formatPrice, addToCart, setIsCheckoutOpen } = useStore();

  const beltProduct = products.find(p => p.id === 'prod-aura-heat') || products[0];
  const razorProduct = products.find(p => p.id === 'prod-velvet-touch') || products[1];

  const handleBuyProduct = (product: any) => {
    if (!product) return;
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-rose-100/80 via-rose-50 to-white pt-8 pb-14">
      {/* Background soft glow blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-200/80 border border-rose-300 text-rose-950 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>Tienda Oficial Colombia • Envío por Dropi con Pago Contra Entrega</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-rose-950 tracking-tight leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-rose-600 to-amber-700">
              Bienestar & Cuidado Femenino
            </span>
          </h1>

          <p className="text-sm sm:text-base text-rose-900/80 font-medium leading-relaxed">
            Pide en 1 minuto con Envío Gratis. Pagas únicamente cuando recibas el producto en tu puerta en cualquier lugar de Colombia.
          </p>

          <div className="inline-flex items-center gap-2 bg-emerald-100/90 border border-emerald-300 text-emerald-950 px-4 py-1.5 rounded-2xl text-xs font-bold shadow-xs mt-1">
            <Truck className="w-4 h-4 text-emerald-700 animate-bounce" />
            <span>🚚 ENVÍO GRATIS Y PAGO CONTRA ENTREGA — Pagas al recibir en tu casa</span>
          </div>
        </div>

        {/* 2 Star Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* STAR PRODUCT 1: Banda Térmica ($50.000 COP) */}
          <div className="bg-white rounded-3xl border-2 border-rose-200 p-6 shadow-xl hover:shadow-2xl hover:border-rose-400 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            
            <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-200" />
              <span>Top 1 Menstrual</span>
            </div>

            <div>
              {/* Product Image */}
              <div className="relative aspect-4/3 rounded-2xl bg-rose-50 overflow-hidden mb-5 border border-rose-100">
                <img
                  src={heatBeltImg}
                  alt="Banda Térmica para Cólicos Aura Heat"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-rose-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-xl">
                  🔥 Alivio en 5 Minutos
                </div>
              </div>

              {/* Product Info */}
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-rose-950 ml-1">4.9 (342 opiniones)</span>
              </div>

              <h2 className="text-xl font-serif font-bold text-rose-950 mb-1">
                Banda Térmica para Cólicos "Aura Heat"
              </h2>

              <p className="text-xs text-rose-800/80 leading-relaxed mb-4">
                Calor infrarrojo inteligente a 3 temperaturas (45°C - 65°C) con 4 modos de masaje vibratorio. Inalámbrica y recargable por USB-C.
              </p>

              {/* Features list */}
              <ul className="space-y-1.5 text-xs text-rose-900 font-medium mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>3 niveles de calor relajante inmediato</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>4 modos de masaje vibratorio para cólicos y espalda</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Súper ligera, se usa fácil debajo de la ropa</span>
                </li>
              </ul>
            </div>

            {/* Pricing & Buying */}
            <div className="pt-4 border-t border-rose-100 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-rose-950">
                    $50.000 COP
                  </span>
                  <span className="text-xs text-rose-400 line-through ml-2">
                    $85.000 COP
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Envío GRATIS • -41%
                </span>
              </div>

              {/* COD notice box above button */}
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-semibold flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pagas $50.000 en efectivo al recibir en casa (Envío Gratis)</span>
              </div>

              <button
                onClick={() => handleBuyProduct(beltProduct)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold text-base shadow-lg shadow-rose-300/60 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98"
              >
                <span>Comprar</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* STAR PRODUCT 2: Kit Depilador Femenino ($70.000 COP) */}
          <div className="bg-white rounded-3xl border-2 border-rose-200 p-6 shadow-xl hover:shadow-2xl hover:border-rose-400 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
            
            <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-purple-500 to-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Depilación Suave</span>
            </div>

            <div>
              {/* Product Image */}
              <div className="relative aspect-4/3 rounded-2xl bg-rose-50 overflow-hidden mb-5 border border-rose-100">
                <img
                  src={razorKitImg}
                  alt="Kit Depilador Femenino Velvet Touch"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-purple-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-xl">
                  ✨ Sin Dolor ni Irritación
                </div>
              </div>

              {/* Product Info */}
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-rose-950 ml-1">4.8 (215 opiniones)</span>
              </div>

              <h2 className="text-xl font-serif font-bold text-rose-950 mb-1">
                Kit Depilador Femenino "Velvet Touch"
              </h2>

              <p className="text-xs text-rose-800/80 leading-relaxed mb-4">
                Set completo de depilación para rostro, axilas, bikini y piernas. Hojas de acero hipoalergénico con Gel Calmante de Rosas de regalo.
              </p>

              {/* Features list */}
              <ul className="space-y-1.5 text-xs text-rose-900 font-medium mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cabezales de alta precisión para zonas sensibles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Resistente al agua IPX7 para usar en ducha</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Incluye gratis Gel de Aloe Vera & Extracto de Rosas</span>
                </li>
              </ul>
            </div>

            {/* Pricing & Buying */}
            <div className="pt-4 border-t border-rose-100 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-rose-950">
                    $70.000 COP
                  </span>
                  <span className="text-xs text-rose-400 line-through ml-2">
                    $120.000 COP
                  </span>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  Envío GRATIS • -41%
                </span>
              </div>

              {/* COD notice box above button */}
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-semibold flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pagas $70.000 en efectivo al recibir en casa (Envío Gratis)</span>
              </div>

              <button
                onClick={() => handleBuyProduct(razorProduct)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold text-base shadow-lg shadow-rose-300/60 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98"
              >
                <span>Comprar</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

