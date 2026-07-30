import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { COLOMBIAN_LOCATIONS, calculateDropiShippingFee } from '../data/mockData';
import { PaymentMethod } from '../types';
import {
  X,
  Truck,
  ShieldCheck,
  CreditCard,
  Phone,
  MapPin,
  CheckCircle2,
  Lock,
  QrCode,
  Sparkles,
  Building2,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    createOrder,
    formatPrice,
    setActiveView,
    setActiveOrderForTracking
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(COLOMBIAN_LOCATIONS[0].department);
  const [city, setCity] = useState(COLOMBIAN_LOCATIONS[0].cities[0]);
  const [address, setAddress] = useState('');
  const [complement, setComplement] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCheckoutOpen) return null;

  const currentDepObj = COLOMBIAN_LOCATIONS.find(d => d.department === department);

  const subtotalCOP = cart.reduce((sum, item) => sum + item.product.priceCOP * item.quantity, 0);
  const shippingFeeCOP = calculateDropiShippingFee(department, city);
  const totalCOP = subtotalCOP + shippingFeeCOP;

  const handleDepartmentChange = (dep: string) => {
    setDepartment(dep);
    const found = COLOMBIAN_LOCATIONS.find(d => d.department === dep);
    if (found && found.cities.length > 0) {
      setCity(found.cities[0]);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address || !city) {
      setErrorMsg('Por favor completa los campos obligatorios (*)');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        quantity: item.quantity,
        unitPriceCOP: item.product.priceCOP,
        image: item.product.image
      }));

      const newOrder = await createOrder({
        customerName,
        email,
        phone,
        department,
        city,
        address,
        complement,
        notes,
        paymentMethod,
        items: orderItems,
        totalCOP: totalCOP
      });

      setIsCheckoutOpen(false);
      setActiveOrderForTracking(newOrder);
      setActiveView('tracking');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el pedido con Dropi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-rose-950/40 backdrop-blur-md">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-rose-100 bg-gradient-to-r from-rose-100 to-amber-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500 text-white">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-rose-950">
                  Checkout Express Colombia (Dropi Sync)
                </h2>
                <p className="text-xs text-rose-700">Envío Gratis • Pago Contraentrega o Digital</p>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 space-y-6">
            
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            {/* Step 1: Customer Contact Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-rose-500" />
                1. Datos de Contacto para la Entrega
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Valeria Mendoza"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-xs text-rose-950 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">Teléfono Móvil (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 312 456 7890"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-xs text-rose-950 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">Correo Electrónico (Opcional para factura)</label>
                  <input
                    type="email"
                    placeholder="valeria@ejemplo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-xs text-rose-950 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address in Colombia */}
            <div className="space-y-3 pt-3 border-t border-rose-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                2. Dirección de Envío (Colombia)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">Departamento *</label>
                  <select
                    value={department}
                    onChange={e => handleDepartmentChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-xs text-rose-950 font-semibold focus:outline-none focus:border-rose-500"
                  >
                    {COLOMBIAN_LOCATIONS.map(d => (
                      <option key={d.department} value={d.department}>
                        {d.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">Ciudad / Municipio *</label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-xs text-rose-950 font-semibold focus:outline-none focus:border-rose-500"
                  >
                    {currentDepObj?.cities.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">Dirección Exacta *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Calle 10 # 43E - 21"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-xs text-rose-950 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">Apto / Casa / Barrio</label>
                  <input
                    type="text"
                    placeholder="Ej. Apto 502, Barrio El Poblado"
                    value={complement}
                    onChange={e => setComplement(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-xs text-rose-950 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">Notas para el Mensajero</label>
                  <input
                    type="text"
                    placeholder="Ej. Dejar en portería"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-rose-50/40 border border-rose-200 rounded-xl text-xs text-rose-950 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-2 text-xs">
              <span className="font-bold text-rose-950 block">Resumen del Pedido</span>
              <div className="flex justify-between text-rose-900">
                <span>Subtotal productos ({cart.length}):</span>
                <span className="font-semibold">{formatPrice(subtotalCOP)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-medium">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Costo de Envío Dropi ({city || department}):
                </span>
                <span className="font-bold text-emerald-700">GRATIS ($0 COP)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-rose-200 text-sm font-bold text-rose-950">
                <span>Total a Pagar (Pago Contra Entrega):</span>
                <span className="text-rose-600 text-base font-extrabold">{formatPrice(totalCOP)}</span>
              </div>
            </div>

            {/* Aviso Destacado: PAGO CONTRA ENTREGA (Exactamente Arriba del Botón de Comprar) */}
            <div className="p-3.5 bg-emerald-500/10 border-2 border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-950 shadow-2xs">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
                <Truck className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="block text-xs font-black uppercase tracking-wider text-emerald-950">
                  🚚 PAGO CONTRA ENTREGA CON ENVÍO GRATIS
                </span>
                <span className="text-xs font-semibold text-emerald-800 leading-snug block">
                  Pagas en efectivo únicamente cuando te llegue el producto a tu casa u oficina
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold text-base shadow-xl shadow-rose-300/80 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98"
            >
              {isSubmitting ? (
                <span>Generando Guía Dropi Colombia...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-amber-200" />
                  <span>Comprar ({formatPrice(totalCOP)})</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-rose-500">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Transacción 100% Segura • Despachado por Dropi Colombia</span>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
