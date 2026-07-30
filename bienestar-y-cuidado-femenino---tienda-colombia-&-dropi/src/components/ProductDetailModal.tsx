import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  Truck,
  ShieldCheck,
  Flame,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    formatPrice,
    setIsCheckoutOpen,
    reviews
  } = useStore();

  const [activeTempLevel, setActiveTempLevel] = useState<'45' | '55' | '65'>('55');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!selectedProduct) return null;

  const productReviews = reviews.filter(r => r.productId === selectedProduct.id);

  const images = [
    selectedProduct.image,
    ...(selectedProduct.secondaryImages || [])
  ];

  const handleBuyNow = () => {
    addToCart(selectedProduct, 1);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-rose-950/40 backdrop-blur-md">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-rose-950 border border-rose-100 flex items-center justify-center shadow-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Product Gallery Left */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl bg-rose-50 overflow-hidden border border-rose-100 shadow-sm">
                  <img
                    src={images[selectedImageIndex]}
                    alt={selectedProduct.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-rose-900/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Truck className="w-3 h-3 text-amber-300" />
                    <span>Dropi Despacho Inmediato</span>
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImageIndex === idx ? 'border-rose-500 scale-105' : 'border-rose-100 opacity-70'
                        }`}
                      >
                        <img src={img} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Right */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      {selectedProduct.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      En Stock Dropi ({selectedProduct.stock} unidades)
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-rose-950 leading-tight">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-xs text-rose-800 font-medium mt-1">
                    {selectedProduct.subtitle}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-rose-950">{selectedProduct.rating}</span>
                  <span className="text-xs text-rose-500">({selectedProduct.reviewCount} valoraciones verificadas)</span>
                </div>

                {/* Price Display */}
                <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100 flex items-center justify-between">
                  <div>
                    <span className="text-2xl sm:text-3xl font-bold text-rose-950">
                      {formatPrice(selectedProduct.priceCOP)}
                    </span>
                    {selectedProduct.originalPriceCOP && (
                      <span className="text-sm text-rose-400 line-through ml-2">
                        {formatPrice(selectedProduct.originalPriceCOP)}
                      </span>
                    )}
                  </div>
                  <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs">
                    Envío Gratis Contraentrega
                  </span>
                </div>

                {/* Interactive Temperature Control Demo for Heat Belt */}
                {selectedProduct.id.includes('heat') && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-amber-600" />
                        Simulador de Temperatura Térmica
                      </span>
                      <span className="text-[11px] font-mono font-bold text-amber-800">{activeTempLevel}°C</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setActiveTempLevel('45')}
                        className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          activeTempLevel === '45'
                            ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs'
                            : 'bg-white text-amber-900 border-amber-200'
                        }`}
                      >
                        45°C - Suave
                      </button>
                      <button
                        onClick={() => setActiveTempLevel('55')}
                        className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          activeTempLevel === '55'
                            ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                            : 'bg-white text-amber-900 border-amber-200'
                        }`}
                      >
                        55°C - Recomendado
                      </button>
                      <button
                        onClick={() => setActiveTempLevel('65')}
                        className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          activeTempLevel === '65'
                            ? 'bg-red-600 text-white border-red-700 shadow-xs'
                            : 'bg-white text-amber-900 border-amber-200'
                        }`}
                      >
                        65°C - Intenso
                      </button>
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-rose-900/80 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Features List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-rose-950 uppercase tracking-wider block">
                    Beneficios Principales
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {selectedProduct.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-rose-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Añadir al Carrito</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-300/60 transition-all hover:scale-102"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Comprar</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Specifications & Dropi Shipping info */}
            <div className="border-t border-rose-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-2">
                <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Garantía & Envíos Dropi Colombia
                </span>
                <ul className="text-xs text-rose-800 space-y-1">
                  <li>• Despachos directos desde bodega Bogotá / Medellín</li>
                  <li>• Transportadoras oficiales: Servientrega, Envía, Interrapidísimo</li>
                  <li>• Revisa tu paquete al recibirlo y paga en efectivo</li>
                </ul>
              </div>

              {/* Reviews Snippet */}
              <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100 space-y-2">
                <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Opiniones Recientes ({productReviews.length})
                </span>
                {productReviews.length > 0 ? (
                  <div className="text-xs space-y-1">
                    <p className="italic text-rose-900">"{productReviews[0].comment.slice(0, 100)}..."</p>
                    <p className="font-semibold text-rose-950 text-[11px]">— {productReviews[0].author} ({productReviews[0].city})</p>
                  </div>
                ) : (
                  <p className="text-xs text-rose-500">Sé la primera persona en calificar este producto.</p>
                )}
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
