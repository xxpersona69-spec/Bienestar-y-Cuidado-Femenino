import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  PackageCheck,
  FileText,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export const OrderTrackingView: React.FC = () => {
  const { orders, activeOrderForTracking, setActiveOrderForTracking, formatPrice } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(activeOrderForTracking || orders[0] || null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeOrderForTracking) {
      setTrackedOrder(activeOrderForTracking);
    }
  }, [activeOrderForTracking]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim().toUpperCase();
    const found = orders.find(
      o =>
        o.id.toUpperCase() === q ||
        (o.dropiGuideNumber && o.dropiGuideNumber.toUpperCase() === q) ||
        o.phone.includes(q)
    );

    if (found) {
      setTrackedOrder(found);
      setError('');
    } else {
      setError(`No se encontró ningún pedido ni guía Dropi con el código "${searchQuery}"`);
    }
  };

  const getStepStatus = (status: OrderStatus) => {
    const steps: OrderStatus[] = [
      'PENDIENTE',
      'ENVIADO_DROPI',
      'GUIA_GENERADA',
      'EN_TRANSITO',
      'EN_REPARTO',
      'ENTREGADO'
    ];

    if (!trackedOrder) return 0;
    const currentIndex = steps.indexOf(trackedOrder.status);
    const stepIndex = steps.indexOf(status);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getWhatsAppLink = (order: Order) => {
    const text = `Hola ${order.customerName}, tu pedido de Aura Care #${order.id} con guía Dropi ${order.dropiGuideNumber || 'En preparación'} está actualmente en estado: ${order.status}. Seguimiento: ${window.location.origin}`;
    return `https://wa.me/57${order.phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold">
          <Truck className="w-4 h-4 text-rose-600" />
          <span>Sincronización en Tiempo Real con Transportadoras en Colombia</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-rose-950">
          Seguimiento de Pedido & Guía Dropi
        </h1>
        <p className="text-xs sm:text-sm text-rose-800/80 max-w-xl mx-auto">
          Ingresa tu número de pedido (ej: <b>ORD-89210</b>) o el código de tu guía de transporte (ej: <b>ENV-9081273</b> o <b>SER-4431209</b>).
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-rose-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Escribe tu ID de Pedido o Número de Guía..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-32 py-3.5 rounded-2xl bg-white border border-rose-200 text-sm font-semibold text-rose-950 shadow-md focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Buscar Guía
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Tracking Results Card */}
      {trackedOrder ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-rose-100 shadow-xl overflow-hidden p-6 sm:p-8 space-y-8"
        >
          {/* Order Header Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-rose-50/70 border border-rose-100/80">
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-500 block">Número de Pedido</span>
              <span className="font-mono font-bold text-base text-rose-950">{trackedOrder.id}</span>
              <span className="text-xs text-rose-700 block">{trackedOrder.customerName} ({trackedOrder.city})</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-rose-500 block">Guía de Transporte Dropi</span>
              {trackedOrder.dropiGuideNumber ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base text-emerald-800">
                    {trackedOrder.dropiGuideNumber}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    {trackedOrder.courierName || 'Servientrega'}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-amber-800 font-semibold">Generando guía en bodega...</span>
              )}
            </div>

            <div className="md:text-right">
              <span className="text-[10px] uppercase font-bold text-rose-500 block">Estado Actual</span>
              <span className="inline-block bg-rose-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-2xs mt-0.5">
                {trackedOrder.status.replace('_', ' ')}
              </span>
              <span className="text-xs text-rose-700 block font-semibold mt-1">
                Total: {formatPrice(trackedOrder.totalCOP)} ({trackedOrder.paymentMethod === 'COD' ? 'Pago Contraentrega' : 'Pagado'})
              </span>
            </div>
          </div>

          {/* Interactive Step-By-Step Progress Bar */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base text-rose-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              Línea de Tiempo de Despacho
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {[
                { status: 'PENDIENTE' as OrderStatus, label: '1. Recibido' },
                { status: 'ENVIADO_DROPI' as OrderStatus, label: '2. Bodega' },
                { status: 'GUIA_GENERADA' as OrderStatus, label: '3. Guía Lista' },
                { status: 'EN_TRANSITO' as OrderStatus, label: '4. En Tránsito' },
                { status: 'EN_REPARTO' as OrderStatus, label: '5. En Reparto' },
                { status: 'ENTREGADO' as OrderStatus, label: '6. Entregado' }
              ].map(step => {
                const st = getStepStatus(step.status);
                let bgClass = 'bg-rose-100 text-rose-400 border-rose-200';
                if (st === 'completed') bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-2xs';
                if (st === 'current') bgClass = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200 shadow-md animate-pulse';

                return (
                  <div key={step.status} className={`p-3 rounded-2xl border text-center transition-all ${bgClass}`}>
                    <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[11px] font-bold block leading-tight">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Status Log Timeline */}
          <div className="space-y-3 pt-4 border-t border-rose-100">
            <h3 className="font-serif font-bold text-base text-rose-950 flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-500" />
              Historial Detallado de Eventos
            </h3>

            <div className="space-y-3 relative pl-4 border-l-2 border-rose-200">
              {trackedOrder.statusHistory.slice().reverse().map((log, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-white shadow-2xs" />
                  <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-rose-950">
                      <span>{log.status.replace('_', ' ')}</span>
                      <span className="text-[10px] text-rose-400">
                        {new Date(log.timestamp).toLocaleString('es-CO')}
                      </span>
                    </div>
                    <p className="text-rose-800">{log.description}</p>
                    {log.location && (
                      <div className="flex items-center gap-1 text-[10px] text-rose-500">
                        <MapPin className="w-3 h-3" />
                        <span>{log.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions & WhatsApp Share */}
          <div className="pt-4 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-rose-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Transportadora integrada: <b>{trackedOrder.courierName || 'Envía / Servientrega'}</b></span>
            </div>

            <a
              href={getWhatsAppLink(trackedOrder)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-200 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Notificar Estado por WhatsApp</span>
            </a>
          </div>

        </motion.div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-rose-100 p-8">
          <p className="text-sm font-semibold text-rose-950">No hay información de pedido para mostrar</p>
        </div>
      )}

    </div>
  );
};
