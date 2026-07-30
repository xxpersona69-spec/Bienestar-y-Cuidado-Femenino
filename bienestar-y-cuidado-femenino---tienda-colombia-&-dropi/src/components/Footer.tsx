import React from 'react';
import { ShieldCheck, Truck, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-rose-950 text-rose-100 pt-12 pb-8 border-t border-rose-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/bienestar_femenino_logo_1785357642273.jpg"
                alt="Bienestar & Cuidado Femenino"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-rose-800 shadow-sm"
              />
              <span className="text-lg font-serif font-bold text-white tracking-tight">
                Bienestar & Cuidado Femenino
              </span>
            </div>

            <p className="text-xs text-rose-300/80 leading-relaxed">
              Tienda virtual especializada en cuidado personal femenino, tecnología térmica para alivio de cólicos y depilación delicada en Colombia.
            </p>

            <div className="inline-flex items-center gap-2 text-[10px] text-amber-200 font-semibold bg-rose-900 px-3 py-1 rounded-full">
              <Truck className="w-3.5 h-3.5 text-amber-300" />
              <span>Logística Integrada Dropi Colombia</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs">
            <span className="font-serif font-bold text-white block text-sm mb-3">
              Cuidado Femenino
            </span>
            <ul className="space-y-2 text-rose-300/80">
              <li>• Banda Térmica para Cólicos</li>
              <li>• Kit Rasuradora Femenina</li>
              <li>• Parches Herbales Autocalentables</li>
              <li>• Masajeador Guasha Térmico</li>
              <li>• Combos Especiales Cero Cólicos</li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="space-y-2 text-xs">
            <span className="font-serif font-bold text-white block text-sm mb-3">
              Garantías & Pago
            </span>
            <ul className="space-y-2 text-rose-300/80">
              <li>🚚 <b>Envío GRATIS</b> a toda Colombia</li>
              <li>💵 <b>Pago Contra Entrega</b> en efectivo</li>
              <li>🛡️ 6 Meses de Garantía directa</li>
              <li>⏱️ Despachos inmediatos en 24-48 horas</li>
            </ul>
          </div>

          {/* Contact Colombia */}
          <div className="space-y-2 text-xs">
            <span className="font-serif font-bold text-white block text-sm mb-3">
              Atención al Cliente
            </span>
            <div className="space-y-2 text-rose-300/80">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <span>+57 312 456 7890 (WhatsApp)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <span>soporte@bienestarfemenino.co</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Bodegas Principales: Bogotá D.C. / Medellín</span>
              </div>
            </div>
          </div>

        </div>

        {/* Payment Badges & Copyright */}
        <div className="pt-8 border-t border-rose-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rose-400/80">
          <p>© 2026 Bienestar & Cuidado Femenino Colombia. Todos los derechos reservados.</p>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-900/80 text-emerald-200 text-[10px] font-bold px-3 py-1 rounded-md border border-emerald-700/50">
              🚚 ENVÍO GRATIS Y PAGO CONTRAENTREGA EN EFECTIVO
            </span>
            <span className="bg-rose-900 text-rose-200 text-[10px] font-bold px-2.5 py-1 rounded-md">
              SERVIENTREGA
            </span>
            <span className="bg-rose-900 text-rose-200 text-[10px] font-bold px-2.5 py-1 rounded-md">
              ENVÍA
            </span>
            <span className="bg-rose-900 text-rose-200 text-[10px] font-bold px-2.5 py-1 rounded-md">
              INTERRAPIDÍSIMO
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
