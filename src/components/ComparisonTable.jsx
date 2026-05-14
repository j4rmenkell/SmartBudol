'use client';

import { Star, Truck } from 'lucide-react';
import { PlatformBadge } from './PlatformBadge';
// Update your imports to bring in the new function
import { formatPrice, getBestDealId } from '@/lib/utils'; 

export function ComparisonTable({ products }) {
  // NEW LOGIC: Get the ID of the best overall deal, not just the lowest price
  const bestDealId = getBestDealId(products); 
  const bestRating = Math.max(...products.map((x) => parseFloat(x.rating) || 0));

  const features = [
    {
      key: 'score',
      label: 'Value Score',
      icon: '🎯',
      render: (p) => (
        <span className={`font-bold text-sm ${p.id === bestDealId ? 'text-primary' : 'text-on-surface'}`}>
          {p.valueScore}/10 
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      icon: '₱',
      render: (p) => (
        // Changed to check if it's the best deal, rather than best price
        <span className={`font-bold text-sm ${p.id === bestDealId ? 'text-primary' : 'text-on-surface'}`}>
          {formatPrice(p.price)}
        </span>
      ),
    },
    {
      key: 'platform',
      label: 'Platform',
      icon: '🏪',
      render: (p) => (
        <span className="text-sm text-on-surface">{p.platform ?? '—'}</span>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      icon: '★',
      render: (p) => (
        <span className={`text-sm font-medium ${parseFloat(p.rating) === bestRating ? 'text-primary' : 'text-on-surface'}`}>
          {p.rating && parseFloat(p.rating) > 0 ? `${parseFloat(p.rating).toFixed(1)} ★` : '—'}
        </span>
      ),
    },
    {
      key: 'vendor',
      label: 'Seller',
      icon: '🏷️',
      render: (p) => (
        <span className="text-sm text-on-surface">{p.vendor ?? '—'}</span>
      ),
    },
    {
      key: 'url',
      label: 'View Deal',
      icon: '🔗',
      render: (p) => (
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline hover:opacity-80"
        >
          Go to store
        </a>
      ),
    },
  ];

  return (
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
                // Updated highlight logic here
                className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-widest border-b border-outline-variant/30 text-center ${
                  p.id === bestDealId ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                <div className="flex items-center gap-1.5 justify-center">
                  <PlatformBadge platform={p.platform} />
                  {/* Updated badge logic here */}
                  {p.id === bestDealId && (
                    <span className="text-primary">(Best Deal)</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        {/* ... tbody remains the same ... */}
        <tbody>
          {features.map((feature, i) => (
            <tr
              key={feature.key}
              className={i % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/40'}
            >
              <td className="px-5 py-4 border-b border-outline-variant/20">
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
  );
}