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

  const maxReviews = Math.max(...products.map(p => parseInt(p.reviews_count) || 1));
  const maxSales = Math.max(...products.map(p => parseInt(p.sales_volume) || 1));

  const withScores = products.map(p => {
    // 1. Base Quality Score
    const ratingScore = (parseFloat(p.rating) || 0) / 5;
    const reviewScore = Math.log1p(parseInt(p.reviews_count) || 0) / Math.log1p(maxReviews);
    const salesScore = Math.log1p(parseInt(p.sales_volume) || 0) / Math.log1p(maxSales);

    const volumeScore = (reviewScore * 0.4) + (salesScore * 0.6);
    let qualityScore = (ratingScore * 0.7) + (volumeScore * 0.3);

    // 2. Raw Deal Index (Using Square Root to prevent cheap-item bias)
    const price = parseFloat(p.price) || 1;
    let rawDealIndex = qualityScore / Math.sqrt(price);

    // 3. Discount Boost
    const discountFromField = parseFloat(p.discount_percentage) || 0;
    const originalPrice = parseFloat(p.original_price);
    const discountFromPrice = originalPrice > 0
      ? ((originalPrice - price) / originalPrice) * 100
      : 0;
    const discount = Math.max(discountFromField, discountFromPrice);

    if (discount > 0) {
      rawDealIndex *= (1 + (discount / 100) * 0.2); 
    }

    return {
      ...p,
      valueScore: (qualityScore * 10).toFixed(1),
      rawDealIndex,
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