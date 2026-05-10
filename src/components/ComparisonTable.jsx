import { Star, Truck } from 'lucide-react';
import { PlatformBadge } from './PlatformBadge';
import { formatPrice, getBestPrice } from '@/lib/utils';

export function ComparisonTable({ products }) {
  const bestPrice = getBestPrice(products);

  const features = [
    {
      key: 'price',
      label: 'Price',
      icon: <span className="text-sm font-bold">₱</span>,
      render: (p) => (
        <span className={`font-bold text-sm ${p.price === bestPrice ? 'text-primary' : 'text-on-surface'}`}>
          {formatPrice(p.price)}
        </span>
      ),
    },
    {
      key: 'originalPrice',
      label: 'Original Price',
      icon: <span className="text-sm">↩</span>,
      render: (p) => (
        <span className="text-sm text-on-surface-variant">
          {p.originalPrice ? formatPrice(p.originalPrice) : '—'}
        </span>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      icon: <Star size={14} />,
      render: (p) => {
        const best = Math.max(...products.map((x) => x.rating ?? 0));
        return (
          <span className={`text-sm font-medium ${p.rating === best ? 'text-primary' : 'text-on-surface'}`}>
            {p.rating ? `${p.rating} ★` : '—'}
          </span>
        );
      },
    },
    {
      key: 'reviews',
      label: 'Reviews',
      icon: <span className="text-sm">💬</span>,
      render: (p) => (
        <span className="text-sm text-on-surface">
          {p.reviewCount >= 1000
            ? (p.reviewCount / 1000).toFixed(1) + 'k'
            : p.reviewCount}
        </span>
      ),
    },
    {
      key: 'location',
      label: 'Ships From',
      icon: <Truck size={14} />,
      render: (p) => (
        <span className="text-sm text-on-surface">{p.location ?? '—'}</span>
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
                className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-widest border-b border-outline-variant/30 text-center
                  ${p.price === bestPrice ? 'text-primary' : 'text-on-surface-variant'}`}
              >
                <div className="flex items-center gap-1.5 justify-center">
                  <PlatformBadge platform={p.store} />
                  {p.price === bestPrice && (
                    <span className="text-primary">(Best)</span>
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
              <td className="px-5 py-4 border-b border-outline-variant/20">
                <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                  {feature.icon}
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