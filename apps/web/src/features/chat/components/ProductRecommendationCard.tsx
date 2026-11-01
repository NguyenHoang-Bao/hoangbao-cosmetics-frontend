import React from 'react';
import { Link } from 'react-router-dom';
import type { ProductRecommendation } from '../types';

interface ProductRecommendationCardProps {
  product: ProductRecommendation;
  onProductClick?: () => void;
}

export const ProductRecommendationCard: React.FC<ProductRecommendationCardProps> = ({
  product,
  onProductClick
}) => {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.price);

  return (
    <div className="p-2.5 rounded-xl bg-neutral-50/80 hover:bg-slate-50/90 border border-neutral-200 flex items-center gap-3 transition-colors mt-2">
      <img
        src={product.thumbnail}
        alt={product.name}
        className="w-12 h-12 object-cover rounded-lg bg-white border border-neutral-200 shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block truncate">
          {product.brandName} • Chính Hãng
        </span>
        <h4 className="font-semibold text-xs text-neutral-900 truncate" title={product.name}>
          {product.name}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-semibold text-xs text-neutral-900">{formattedPrice}</span>
          {product.inStock !== false && (
            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-medium border border-emerald-200">
              Còn hàng
            </span>
          )}
        </div>
      </div>
      <Link
        to={`/products/${product.idProduct}`}
        onClick={onProductClick}
        className="px-2.5 py-1.5 rounded-lg bg-[#0F1E36] text-white text-[11px] font-semibold hover:bg-[#162B4D] transition-colors shrink-0"
      >
        Xem
      </Link>
    </div>
  );
};
