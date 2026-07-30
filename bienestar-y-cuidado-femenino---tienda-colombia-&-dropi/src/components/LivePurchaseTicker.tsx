import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const RECENT_PURCHASES = [
  { name: 'Valeria M.', city: 'Medellín, Antioquia', product: 'Banda Térmica Corporal', time: 'Hace 3 minutos', payment: 'Pago Contraentrega (Dropi)' },
  { name: 'Camila O.', city: 'Bogotá D.C.', product: 'Kit Rasuradora Femenina', time: 'Hace 7 minutos', payment: 'Pago Contraentrega (Dropi)' },
  { name: 'Andrea K.', city: 'Cali, Valle del Cauca', product: 'Kit Bienestar & Cero Cólicos', time: 'Hace 12 minutos', payment: 'Pago Contraentrega (Dropi)' },
  { name: 'Isabella S.', city: 'Bucaramanga, Santander', product: 'Parches Térmicos Herbales (x6)', time: 'Hace 18 minutos', payment: 'Pago Contraentrega (Dropi)' },
  { name: 'Mariana G.', city: 'Barranquilla, Atlántico', product: 'Banda Térmica Corporal', time: 'Hace 24 minutos', payment: 'Pago Contraentrega (Dropi)' }
];

export const LivePurchaseTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % RECENT_PURCHASES.length);
        setIsVisible(true);
      }, 500);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  const purchase = RECENT_PURCHASES[currentIndex];

  return (
    <div className="fixed bottom-4 left-4 z-30 max-w-xs sm:max-w-sm pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl shadow-rose-200/50 border border-rose-100 flex items-start gap-3 relative"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-400 to-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>

            <div className="flex-1 pr-4">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-bold text-rose-950">{purchase.name}</span>
                <span className="text-[10px] text-rose-500 font-medium">• {purchase.city}</span>
              </div>

              <p className="text-xs font-semibold text-rose-800 leading-tight">
                {purchase.product}
              </p>

              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="text-[10px] text-emerald-700 font-medium">{purchase.payment}</span>
                <span className="text-[10px] text-rose-400 ml-auto">{purchase.time}</span>
              </div>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-rose-300 hover:text-rose-500 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
