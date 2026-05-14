import { Star, CheckCircle, ExternalLink } from 'lucide-react';
import { PlatformBadge } from './PlatformBadge';
import { formatPrice, getBestPrice } from '@/lib/utils'
import { BestDealBadge } from './BestDealBadge'; // <-- Import here
import { StarRating } from './StarRating';;

export function ProductCard({ product, isBest }) {
  // Compute a small "Value Badge" if you want to show the score
  // This is based on the logic used in getBestDealId
  const displayScore = product.valueScore; 

  return (
    <div
      className={`relative bg-surface-container-lowest flex flex-col overflow-visible rounded-xl transition-all duration-300
        ${isBest
          ? 'border-2 border-primary shadow-lg scale-[1.02] z-10 pt-3' 
          : 'border border-outline-variant/20 hover:shadow-md'
        }`}
    >
      {/* 1. Updated Badge logic */}
      {isBest && <BestDealBadge />}

      <div className="relative overflow-hidden rounded-t-xl">
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
          <PlatformBadge platform={product.platform || product.store} />
        </div>
        
        <img
          src={product.image_url || product.image}
          alt={product.name}
          className="w-full h-48 object-cover bg-surface-container"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x300/eeedf7/6d7a73?text=No+Image';
          }}
        />
      </div>

      <div className="flex flex-col gap-3 p-5 flex-1">
        <h3 className="text-sm font-semibold text-on-surface leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-end gap-2">
          {/* 2. Highlight Price ONLY if it's the Best Deal overall */}
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

        {/* 3. Ratings and Reviews (Crucial for the "Best Deal" algorithm) */}
        <StarRating rating={product.rating} count={product.reviewCount} />

        <div className="space-y-1">
          <p className="text-xs text-on-surface-variant">
            Seller: <span className="text-on-surface font-medium">{product.vendor || product.seller}</span>
          </p>

          {product.location && (
            <p className="text-xs text-on-surface-variant">
              Ships from: <span className="text-on-surface font-medium">{product.location}</span>
            </p>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-outline-variant/30">
          <a
            href={product.url || product.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium transition-all
              ${isBest
                ? 'bg-primary text-on-primary hover:bg-primary/90 shadow-md ring-2 ring-primary/20'
                : 'border border-outline-variant/30 text-on-surface hover:border-primary hover:text-primary'
              }`}
          >
            View on {product.platform || product.store}
            <ExternalLink size={13} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  );
}