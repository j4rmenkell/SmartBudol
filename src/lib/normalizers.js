// ─────────────────────────────────────────────────────────────────────────────
// APIFY RAW FIELD REFERENCE
// When you wire up the real API route, these are the raw fields each scraper
// returns. The normalizers below map them into the shape this page expects.
//
// fatihtahta/lazada-scraper returns per product:
//   name, price (string e.g. "41328"), originalPrice, ratingScore, review (count),
//   itemId, itemUrl, image, location, brandName, seller { ... }
//
// fatihtahta/shopee-scraper returns per product:
//   name, price (number, in cents), originalPrice, ratingScore, reviewCount,
//   itemId, itemUrl, images[0], shopName, brand, shippingFee
// ─────────────────────────────────────────────────────────────────────────────

export function normalizeLazada(raw) {
  return {
    id:            String(raw.itemId ?? raw.nid ?? Math.random()),
    name:          raw.name ?? 'Unknown Product',
    price:         parseInt(String(raw.price ?? '0').replace(/[^0-9]/g, ''), 10),
    originalPrice: raw.originalPrice
                     ? parseInt(String(raw.originalPrice).replace(/[^0-9]/g, ''), 10)
                     : null,
    rating:        raw.ratingScore ? parseFloat(Number(raw.ratingScore).toFixed(1)) : null,
    reviewCount:   raw.review ? parseInt(String(raw.review).replace(/[^0-9]/g, ''), 10) : 0,
    seller:        raw.seller?.name ?? raw.brandName ?? 'Lazada Seller',
    store:         'Lazada',
    image:         raw.image ?? '',
    storeUrl:      raw.itemUrl ? `https://www.lazada.com.ph${raw.itemUrl}` : '#',
    location:      raw.location ?? null,
  };
}

export function normalizeShopee(raw) {
  // Shopee returns price in cents (e.g. 1499900 = ₱14,999.00)
  const rawPrice = raw.price ?? raw.priceMin ?? 0;
  return {
    id:            String(raw.itemId ?? raw.shopid ?? Math.random()),
    name:          raw.name ?? 'Unknown Product',
    price:         Math.round(rawPrice / 100),
    originalPrice: raw.originalPrice ? Math.round(raw.originalPrice / 100) : null,
    rating:        raw.ratingScore ? parseFloat(Number(raw.ratingScore).toFixed(1)) : null,
    reviewCount:   raw.reviewCount ?? raw.cmt_count ?? 0,
    seller:        raw.shopName ?? raw.brandName ?? 'Shopee Seller',
    store:         'Shopee',
    image:         Array.isArray(raw.images) ? raw.images[0] : (raw.image ?? ''),
    storeUrl:      raw.itemUrl ?? '#',
    location:      raw.location ?? null,
  };
}