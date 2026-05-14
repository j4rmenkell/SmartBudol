import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getBestPrice(products) {
  return Math.min(...products.map((p) => p.price));
}

export function getFastestDelivery(products) {
  const order = ['1–2 days', '2–3 days', '3–5 days', '4–7 days'];
  for (const label of order) {
    if (products.some((p) => p.deliveryDays === label)) return label;
  }
  return null;
}

export function formatPrice(n) {
  return '₱' + n.toLocaleString('en-PH');
}

export function addValueScoresToProducts(products) {
  if (!products || products.length === 0) return [];

  const maxReviews = Math.max(...products.map(p => parseInt(p.reviewCount) || 1));

  const withScores = products.map(p => {
    const ratingScore = (parseFloat(p.rating) || 0) / 5;
    const volumeScore = Math.log1p(parseInt(p.reviewCount) || 0) / Math.log1p(maxReviews);

    const qualityScore = (ratingScore * 0.7) + (volumeScore * 0.3);
    const rawDealIndex = qualityScore / (parseFloat(p.price) || 1);

    return {
      ...p,
      valueScore: (qualityScore * 10).toFixed(1),  // displayed number (quality only)
      rawDealIndex,                                  // used internally for best deal
    };
  });

  return withScores;
}

export function getBestDealId(products) {
  if (!products || products.length === 0) return null;

  return products.reduce((best, p) =>
    (p.rawDealIndex ?? 0) > (best.rawDealIndex ?? 0) ? p : best
  ).id;
}