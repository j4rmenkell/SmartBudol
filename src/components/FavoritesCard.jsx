import Link from "next/link";
import { PlatformBadge } from "@/components/PlatformBadge";

export function FavoritesCard({ date, product, onDelete }) {
  if (!product) return null; // Fallback in case product data is missing

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-on-surface-variant font-medium">
          {date}
        </span>
        <button
          onClick={onDelete}
          className="text-on-surface-variant hover:text-error transition-colors p-1"
          aria-label="Remove from favorites"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      <h3 className="font-semibold text-base leading-tight text-on-surface mb-3 line-clamp-2" title={product.name}>
        {product.name}
      </h3>
      <div className="flex gap-2 mb-4">
        <PlatformBadge platform={product.platform} />
      </div>
      <div className="flex justify-between items-center bg-surface-container-low rounded-lg p-3 mb-4">
        <span className="text-sm text-on-surface-variant">Price</span>
        <span className="text-sm font-bold text-primary">&#8369;{product.price}</span>
      </div>
      {/* Assuming you want to link out to the external product URL since it's in the schema */}
      <Link
        href={`/products/${product.id}`}
        className="w-full py-2.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
      >
        View Detail
      </Link>
    </div>
  );
}
