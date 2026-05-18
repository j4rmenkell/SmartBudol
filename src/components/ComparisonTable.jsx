'use client';

import { PlatformBadge } from './PlatformBadge';
import { formatPrice, getBestDealId } from '@/lib/utils'; 

export function ComparisonTable({ products }) {
  // 1. Extract valid prices to check for a category mismatch
  const validPrices = products.map((p) => parseFloat(p.price) || 0).filter((price) => price > 0);
  const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : 0;
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  
  // Check if the highest price is more than 5x the lowest price
  const isPriceMismatch = minPrice > 0 && (maxPrice / minPrice) > 5;

  // 2. Conditionally assign Best Deal (nullified if prices vary too wildly)
  const bestDealId = isPriceMismatch ? null : getBestDealId(products); 
  
  // Safe max calculations for highlighting
  const bestRating = Math.max(...products.map((x) => parseFloat(x.rating) || 0));
  const bestSales = Math.max(...products.map((x) => parseInt(x.sales_volume) || 0));

  const features = [
    {
      key: 'score',
      label: 'Value Score',
      icon: '🎯',
      render: (p) => (
        <span className={`font-bold text-sm ${bestDealId && p.id === bestDealId ? 'text-primary' : 'text-on-surface'}`}>
          {p.valueScore ? `${p.valueScore}/10` : '—'} 
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      icon: '₱',
      render: (p) => (
        <div className="flex flex-col items-center justify-center">
          {/* Final Price */}
          <span className={`font-bold text-sm ${bestDealId && p.id === bestDealId ? 'text-primary' : 'text-on-surface'}`}>
            {p.price > 0 ? formatPrice(p.price) : '—'}
          </span>
          
          {/* Original Price + Discount Badge */}
          {(p.original_price > p.price || p.discount_percentage > 0) && (
            <div className="flex items-center gap-1.5 mt-1">
              {/* Note the change to p.original_price here 👇 */}
              {p.original_price > p.price && (
                <span className="text-[10px] text-on-surface-variant line-through">
                  {formatPrice(p.original_price)}
                </span>
              )}
              {p.discount_percentage > 0 && (
                <span className="text-[10px] font-semibold text-[#00694c] bg-[#e6f4ea] px-1.5 py-0.5 rounded-full leading-none">
                  -{p.discount_percentage}%
                </span>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'platform',
      label: 'Platform',
      icon: '🏪',
      render: (p) => (
        <span className="text-sm text-on-surface capitalize">{p.platform || '—'}</span>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      icon: '★',
      render: (p) => (
        <span className={`text-sm font-medium ${bestDealId && p.rating > 0 && parseFloat(p.rating) === bestRating ? 'text-primary' : 'text-on-surface'}`}>
          {p.rating > 0 ? `${parseFloat(p.rating).toFixed(1)} ★` : '—'}
        </span>
      ),
    },
    {
      key: 'reviews',
      label: 'Reviews',
      icon: '💬',
      render: (p) => (
        <span className="text-sm text-on-surface">
          {p.reviews_count > 0 ? parseInt(p.reviews_count).toLocaleString() : '0'}
        </span>
      ),
    },
    {
      key: 'sales',
      label: 'Items Sold',
      icon: '📦',
      render: (p) => (
        <span className={`text-sm ${bestDealId && p.sales_volume > 0 && parseInt(p.sales_volume) === bestSales ? 'font-semibold text-primary' : 'text-on-surface'}`}>
          {p.sales_volume > 0 ? `${parseInt(p.sales_volume).toLocaleString()}+` : '0'}
        </span>
      ),
    },
    {
      key: 'location',
      label: 'Ships From',
      icon: '📍',
      render: (p) => (
        <span className="text-sm text-on-surface capitalize">{p.location || '—'}</span>
      ),
    },
    {
      key: 'vendor',
      label: 'Seller',
      icon: '🏷️',
      render: (p) => (
        <span className="text-sm text-on-surface">{p.vendor || '—'}</span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4.5">
      {/* Dynamic Mismatch Warning Banner */}
      {isPriceMismatch && (
        <div className="p-4 text-xs font-medium bg-surface-container-low border border-outline-variant/30 text-on-surface-variant rounded-xl flex items-center gap-2.5 shadow-sm">
          <span className="text-sm leading-none">⚠️</span>
          <span>Prices vary widely. Choose the product that best fits your budget.</span>
        </div>
      )}

      {/* Main Table Container */}
      <div className="overflow-x-auto rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="bg-surface-container-low">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-on-surface-variant uppercase tracking-widest w-44 border-b border-outline-variant/30">
                Feature
              </th>
              {products.map((p) => (
                <th
                  key={p.id}
                  className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-widest border-b border-outline-variant/30 text-center ${
                    bestDealId && p.id === bestDealId ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  <div className="flex items-center gap-1.5 justify-center flex-col">
                    <PlatformBadge platform={p.platform || 'unknown'} />
                    {bestDealId && p.id === bestDealId && (
                      <span className="text-primary text-[10px] mt-1">(Best Deal)</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, i) => (
              <tr
                key={feature.key}
                className={i % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/40'}
              >
                <td className="px-5 py-4 border-b border-outline-variant/20 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                    <span className="text-sm">{feature.icon}</span>
                    {feature.label}
                  </div>
                </td>
                {products.map((p) => (
                  <td key={p.id} className="px-5 py-4 text-center border-b border-outline-variant/20">
                    {feature.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}