import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    formatPrice,
    setIsCheckoutOpen
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountMsg, setDiscountMsg] = useState('');

  if (!isCartOpen) return null;

  const subtotalCOP = cart.reduce(
    (sum, item) => sum + item.product.priceCOP * item.quantity,
    0
  );

  const discountAmountCOP = Math.round((subtotalCOP * appliedDiscount) / 100);
  const totalCOP = Math.max(0, subtotalCOP - discountAmountCOP);

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'AURA15') {
      setAppliedDiscount(15);
      setDiscountMsg('¡Cupón AURA15 aplicado! 15% de descuento adicional');
    } else {
      setDiscountMsg('Cupón no válido. Intenta con AURA15');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-rose-950/40 backdrop-blur-xs">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-rose-100"
        >
          {/* Cart Header */}
          <div className="p-5 border-b border-rose-100 bg-rose-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-600" />
              <h2 className="font-serif font-bold text-lg text-rose-950">Tu Carrito de Compra</h2>
              <span className="bg-rose-200 text-rose-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* Free Shipping Banner */}
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><b>¡ENVÍO GRATIS Y CONTRAENTREGA!</b> Despacho inmediato por Dropi Colombia.</span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-rose-100 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-rose-950">Tu carrito está vacío</p>
                <p className="text-xs text-rose-500">Agrega productos de bienestar para iniciar tu compra.</p>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.product.id}
                  className="p-3 bg-rose-50/40 rounded-2xl border border-rose-100/80 flex items-center gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-rose-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-xs text-rose-950 truncate">
                      {item.product.title}
                    </h3>
                    <span className="text-xs font-bold text-rose-600 block mt-0.5">
                      {formatPrice(item.product.priceCOP)}
                    </span>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-white rounded-lg border border-rose-200">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded-l-lg"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-rose-950">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded-r-lg"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-rose-400 hover:text-rose-600 p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Coupon Code Section */}
            {cart.length > 0 && (
              <div className="pt-2 border-t border-rose-100">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-rose-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Cupón (ej: AURA15)"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl text-xs text-rose-950 uppercase font-mono"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3 py-2 bg-rose-200 hover:bg-rose-300 text-rose-950 font-bold text-xs rounded-xl transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
                {discountMsg && (
                  <p className={`text-[10px] mt-1 ${appliedDiscount > 0 ? 'text-emerald-700 font-bold' : 'text-rose-500'}`}>
                    {discountMsg}
                  </p>
                )}
              </div>
            )}

          </div>

          {/* Cart Footer Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-rose-100 bg-rose-50/40 space-y-3">
              <div className="space-y-1.5 text-xs text-rose-900">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatPrice(subtotalCOP)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Descuento (15% AURA15):</span>
                    <span>-{formatPrice(discountAmountCOP)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío Express Dropi:</span>
                  <span className="font-bold text-emerald-600">GRATIS</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-rose-200 text-base font-bold text-rose-950">
                  <span>Total a Pagar:</span>
                  <span className="text-rose-600">{formatPrice(totalCOP)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-300 transition-all hover:scale-102"
              >
                <span>Ir al Pago Contraentrega</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-center text-rose-600/80 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pagas en efectivo al repartidor de Servientrega / Envía</span>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
