import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, ShoppingBag, Truck, Flame, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, formatPrice, setSelectedProduct, setIsCheckoutOpen } = useStore();

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group bg-white rounded-3xl border border-rose-100/80 p-4 shadow-sm hover:shadow-xl hover:shadow-rose-100/60 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
    >
      {/* Best Seller or Discount Badge */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {product.isBestSeller && (
          <span className="bg-gradient-to-r from-rose-500 to-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-200" />
            Top Colombia
          </span>
        )}
        {product.originalPriceCOP && (
          <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
            -{Math.round((1 - product.priceCOP / product.originalPriceCOP) * 100)}%
          </span>
        )}
      </div>

      {/* Dropi Sync Badge Top Right */}
      <div className="absolute top-6 right-6 z-10 pointer-events-none">
        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
          <Truck className="w-3 h-3 text-emerald-600" />
          Dropi COD
        </span>
      </div>

      {/* Image Showcase */}
      <div>
        <div className="relative aspect-square rounded-2xl bg-rose-50/50 overflow-hidden mb-4">
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Rating & Category */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-rose-950">{product.rating}</span>
            <span className="text-[11px] text-rose-400">({product.reviewCount})</span>
          </div>

          <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider bg-rose-100/60 px-2 py-0.5 rounded-md">
            {product.category.replace('_', ' ')}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-serif font-bold text-base text-rose-950 group-hover:text-rose-600 transition-colors leading-snug line-clamp-1">
          {product.title}
        </h3>
        <p className="text-xs text-rose-800/80 leading-relaxed line-clamp-2 mt-1 mb-3">
          {product.subtitle}
        </p>
      </div>

      {/* Price & Action Buttons */}
      <div className="pt-3 border-t border-rose-100/80 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-lg font-bold text-rose-950 block leading-tight">
              {formatPrice(product.priceCOP)}
            </span>
            {product.originalPriceCOP && (
              <span className="text-xs text-rose-400 line-through">
                {formatPrice(product.originalPriceCOP)}
              </span>
            )}
          </div>

          <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
            Stock: {product.stock} un.
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="w-full py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Al Carrito</span>
          </button>

          <button
            onClick={handleQuickBuy}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-rose-200/60 transition-all hover:scale-102"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Comprar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
