import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, ShieldCheck, ThumbsUp, Plus, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const VerifiedReviewsSection: React.FC = () => {
  const { reviews, products, addReview } = useStore();

  const [selectedProductId, setSelectedProductId] = useState<string>('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Review Form state
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('Bogotá D.C.');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [productId, setProductId] = useState(products[0]?.id || '');

  const filteredReviews = reviews.filter(
    r => selectedProductId === 'TODOS' || r.productId === selectedProductId
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    await addReview({
      productId,
      author,
      city,
      rating,
      comment
    });

    setIsModalOpen(false);
    setAuthor('');
    setComment('');
    alert('¡Gracias por tu reseña! Ha sido verificada y agregada con éxito.');
  };

  return (
    <section className="py-12 bg-rose-50/50 border-t border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Title & Summary Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-200 text-rose-900 text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>100% Compras Verificadas en Colombia</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-rose-950">
              Lo que dicen nuestras clientas
            </h2>
            <p className="text-xs text-rose-800/80 mt-1">
              Testimonios reales de mujeres en Bogotá, Medellín, Cali, Barranquilla y Bucaramanga.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs">
            <div className="text-center pr-4 border-r border-rose-200">
              <span className="text-3xl font-bold font-serif text-rose-950 block leading-tight">4.9</span>
              <div className="flex text-amber-400 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-rose-950 block">Excelente Reputación</span>
              <span className="text-[11px] text-rose-600 font-medium">Más de 800 pedidos entregados</span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-auto px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Escribir Reseña</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setSelectedProductId('TODOS')}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              selectedProductId === 'TODOS'
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'bg-white text-rose-900 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            Todas las Reseñas ({reviews.length})
          </button>
          {products.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProductId(p.id)}
              className={`px-4 py-2 rounded-full font-bold transition-all ${
                selectedProductId === p.id
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'bg-white text-rose-900 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map(r => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-white rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-rose-400 font-medium">{r.date}</span>
                </div>

                <p className="text-xs text-rose-900 leading-relaxed font-normal italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-rose-100/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-serif font-bold text-rose-950 block">{r.author}</span>
                  <span className="text-[10px] text-rose-500 font-medium">{r.city}</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Compradora Verificada</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4">
            <h3 className="font-serif font-bold text-lg text-rose-950">Escribir una Reseña Verificada</h3>

            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-rose-900 mb-1">Producto Adquirido</label>
                <select
                  value={productId}
                  onChange={e => setProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl font-semibold text-rose-950"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-rose-900 mb-1">Tu Nombre</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carolina Torres"
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl text-rose-950"
                />
              </div>

              <div>
                <label className="block font-bold text-rose-900 mb-1">Ciudad en Colombia</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Medellín, Antioquia"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl text-rose-950"
                />
              </div>

              <div>
                <label className="block font-bold text-rose-900 mb-1">Calificación (1 a 5 estrellas)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(st => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setRating(st)}
                      className={`p-2 rounded-xl border font-bold ${
                        rating >= st ? 'bg-amber-400 text-amber-950 border-amber-500' : 'bg-rose-50 text-rose-400 border-rose-200'
                      }`}
                    >
                      ★ {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-rose-900 mb-1">Tu Opinión</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Escribe tu experiencia de uso, sensación térmico, tiempo de entrega, etc."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl text-rose-950"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-100 text-rose-950 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-bold shadow-md"
                >
                  Publicar Reseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
