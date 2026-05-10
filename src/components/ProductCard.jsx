import { Star, CheckCircle, ExternalLink } from 'lucide-react';
import { PlatformBadge } from './PlatformBadge';
import { formatPrice, getBestPrice } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function BestDealBadge() {
  return (
    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
      <span className="flex items-center gap-1 bg-primary text-on-primary text-xs font-semibold px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
        <CheckCircle size={11} strokeWidth={2.5} />
        Best deal
      </span>
    </div>
  );
}

function StarRating({ rating, count }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1.5">
      <Star size={13} className="fill-amber-400 text-amber-400" strokeWidth={0} />
      <span className="text-sm font-semibold text-on-surface">{rating}</span>
      <span className="text-xs text-on-surface-variant">
        ({count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count})
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────────────────
export function ProductCard({ product, isBest }) {
  return (
    <div
      className={`relative bg-surface-container-lowest flex flex-col overflow-visible rounded-xl transition-shadow duration-200
        ${isBest
          ? 'border-2 border-primary shadow-sm pt-3'
          : 'border border-outline-variant/20 hover:shadow-md'
        }`}
    >
      {isBest && <BestDealBadge />}

      {/* Image */}
      <div className="relative overflow-hidden rounded-t-xl">
        <div className="absolute top-3 right-3 z-10">
          <PlatformBadge platform={product.store} />
        </div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover bg-surface-container"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x300/eeedf7/6d7a73?text=No+Image';
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <h3 className="text-sm font-semibold text-on-surface leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-end gap-2">
          <span
            className={`font-extrabold tracking-tight ${isBest ? 'text-primary' : 'text-on-surface'}`}
            style={{ fontSize: '22px', lineHeight: '1' }}
          >
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-on-surface-variant line-through mb-0.5">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <StarRating rating={product.rating} count={product.reviewCount} />

        <p className="text-xs text-on-surface-variant">
          Seller: <span className="text-on-surface font-medium">{product.seller}</span>
        </p>

        {product.location && (
          <p className="text-xs text-on-surface-variant">
            Ships from: <span className="text-on-surface font-medium">{product.location}</span>
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-outline-variant/30">
          <a
            href={product.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isBest
                ? 'bg-primary text-on-primary hover:bg-primary-container'
                : 'border border-outline-variant/30 text-on-surface hover:border-primary hover:text-primary'
              }`}
          >
            Go to store
            <ExternalLink size={13} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  );
}