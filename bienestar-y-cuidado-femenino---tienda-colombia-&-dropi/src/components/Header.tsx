import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Truck,
  Sparkles,
  Menu,
  X,
  Lock,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const brandLogoImage = '/src/assets/images/bienestar_femenino_logo_1785357642273.jpg';

export const Header: React.FC = () => {
  const {
    cart,
    activeView,
    setActiveView,
    setIsCartOpen
  } = useStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogoDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdminAuthModalOpen(true);
    setAdminPasswordInput('');
    setAdminAuthError('');
  };

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput.trim() === '1981#') {
      setActiveView('admin');
      setIsAdminAuthModalOpen(false);
      setAdminPasswordInput('');
      setAdminAuthError('');
    } else {
      setAdminAuthError('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-rose-50/90 backdrop-blur-md border-b border-rose-100 transition-all">
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-rose-400 via-rose-300 to-amber-200 text-rose-950 text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-xs">
        <span className="bg-rose-900 text-rose-100 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full">
          COLOMBIA
        </span>
        <span>🚚 Envío Gratis & <b>Pago Contra Entrega</b> en toda Colombia con Dropi</span>
        <span className="hidden md:inline">• ⚡ Despachos en 24-48 horas</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setActiveView('shop')}
              onDoubleClick={handleLogoDoubleClick}
              title="Doble clic para acceder al modo Administrador"
              className="flex items-center gap-3 cursor-pointer group text-left select-none"
            >
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-rose-300 shadow-md shadow-rose-200/60 group-hover:scale-105 transition-transform bg-white shrink-0">
                <img
                  src={brandLogoImage}
                  alt="Bienestar y Cuidado Femenino Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-serif font-bold text-rose-950 tracking-tight block leading-tight">
                  Bienestar
                </span>
                <span className="text-[10px] text-rose-700 uppercase font-bold tracking-wider block -mt-0.5">
                  & Cuidado Femenino
                </span>
              </div>
            </div>
          </div>

          {/* Nav Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-white/60 p-1.5 rounded-full border border-rose-100 shadow-2xs">
            <button
              onClick={() => setActiveView('shop')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeView === 'shop'
                  ? 'bg-rose-400 text-white shadow-xs'
                  : 'text-rose-900 hover:bg-rose-100/50'
              }`}
            >
              Tienda
            </button>
            
            <button
              onClick={() => setActiveView('tracking')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'tracking'
                  ? 'bg-rose-400 text-white shadow-xs'
                  : 'text-rose-900 hover:bg-rose-100/50'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Rastrear Guía
            </button>
          </nav>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-rose-300/50 transition-all hover:scale-102"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Carrito</span>
              {cartItemsCount > 0 && (
                <span className="bg-white text-rose-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-rose-900 hover:bg-rose-100/50"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-rose-50 border-b border-rose-200 overflow-hidden"
          >
            <div className="p-4 space-y-3 text-xs">
              <button
                onClick={() => {
                  setActiveView('shop');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left font-semibold text-rose-950 p-2 rounded-lg hover:bg-rose-100"
              >
                🌸 Tienda Virtual
              </button>
              <button
                onClick={() => {
                  setActiveView('tracking');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left font-semibold text-rose-950 p-2 rounded-lg hover:bg-rose-100 flex items-center justify-between"
              >
                <span>🚚 Rastrear Guía de Envío</span>
                <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-bold">Dropi</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Password Modal */}
      <AnimatePresence>
        {isAdminAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-rose-100 shadow-2xl p-6 sm:p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => setIsAdminAuthModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-rose-400 hover:text-rose-700 hover:bg-rose-50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-rose-950">
                    Modo Administrador
                  </h3>
                  <p className="text-xs text-rose-700/80 mt-1">
                    Ingresa la contraseña de administrador para gestionar pedidos, productos e inventario Dropi.
                  </p>
                </div>
              </div>

              {adminAuthError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold text-center">
                  {adminAuthError}
                </div>
              )}

              <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-rose-900 mb-1">
                    Contraseña de Acceso
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      autoFocus
                      required
                      placeholder="Ingresa la contraseña..."
                      value={adminPasswordInput}
                      onChange={e => setAdminPasswordInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-rose-50/40 border border-rose-200 rounded-2xl text-xs font-mono font-bold text-rose-950 focus:outline-none focus:border-rose-500 shadow-2xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Ingresar al Administrador</span>
                </button>
              </form>


            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
