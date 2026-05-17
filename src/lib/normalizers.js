// src/lib/normalizers.js

// Safely converts strings like "15.7K sold", "830 sold", or numeric formats into pure integers
function parseSalesVolume(soldValue) {
  if (soldValue === null || soldValue === undefined) return 0;
  
  let cleanString = String(soldValue).toLowerCase().replace(/sold/g, '').replace(/,/g, '').trim();
  
  let multiplier = 1;
  if (cleanString.includes('k')) {
    multiplier = 1000;
    cleanString = cleanString.replace('k', '');
  } else if (cleanString.includes('m')) {
    multiplier = 1000000;
    cleanString = cleanString.replace('m', '');
  }

  const numberValue = parseFloat(cleanString);
  return isNaN(numberValue) ? 0 : Math.round(numberValue * multiplier);
}

export function normalizeLazada(rawArray) {
  if (!Array.isArray(rawArray)) return [];

  // Filter out metadata nodes and only process genuine product items
  const productOnlyArray = rawArray.filter(raw => raw.record_type === 'product' && raw.product_name);

  return productOnlyArray.map(raw => {
    // Dig into the nested object layers provided by this actor structure
    const currentPrice = parseFloat(raw.pricing?.current_price ?? '0');
    const origPrice = raw.pricing?.original_price ? parseFloat(raw.pricing.original_price) : currentPrice;
    
    const calculatedDiscount = origPrice > currentPrice 
      ? Math.round(((origPrice - currentPrice) / origPrice) * 100) 
      : 0;

    return {
      platform: 'Lazada',
      external_id: String(raw.product_id ?? Math.random()),
      name: raw.product_name,
      url: raw.product_url ? (raw.product_url.startsWith('http') ? raw.product_url : `https:${raw.product_url}`) : '#',
      image_url: raw.media?.primary_image ?? '',
      price: Math.round(currentPrice),
      original_price: Math.round(origPrice),
      discount_percentage: calculatedDiscount,
      rating: raw.ratings?.rating_score ? parseFloat(Number(raw.ratings.rating_score).toFixed(1)) : 0,
      reviews_count: raw.ratings?.review_count ? parseInt(String(raw.ratings.review_count).replace(/[^0-9]/g, ''), 10) : 0,
      sales_volume: parseSalesVolume(raw.inventory?.item_sold),
      location: raw.vendor?.location ?? null,
      vendor: raw.vendor?.seller_name ?? 'Lazada Seller'
    };
  });
}

export function normalizeShopee(rawArray) {
  if (!Array.isArray(rawArray)) return [];

  // Exclude bad rows lacking product names
  const validProducts = rawArray.filter(raw => raw.name && raw.name !== 'Unknown Product');

  return validProducts.map(raw => {
    // The data file proves Shopee is already giving standard values, not cents
    const currentPrice = parseFloat(raw.price ?? '0');
    
    // Fall back to current price if original_price is missing or empty
    const origPrice = raw.original_price ? parseFloat(raw.original_price) : currentPrice;

    // Use source percentage if it exists, otherwise calculate manually
    const calculatedDiscount = raw.discount_pct ?? (origPrice > currentPrice 
      ? Math.round(((origPrice - currentPrice) / origPrice) * 100) 
      : 0);

    return {
      platform: 'Shopee',
      external_id: String(raw.item_id ?? raw.shop_id ?? Math.random()),
      name: raw.name,
      url: raw.url ?? '#',
      image_url: raw.image_url ?? '',
      price: Math.round(currentPrice),
      original_price: Math.round(origPrice),
      discount_percentage: calculatedDiscount,
      rating: raw.rating ? parseFloat(Number(raw.rating).toFixed(1)) : 0,
      reviews_count: raw.rating_count ? parseInt(String(raw.rating_count).replace(/[^0-9]/g, ''), 10) : 0,
      sales_volume: parseSalesVolume(raw.sold_count),
      location: raw.location ?? null,
      vendor: 'Shopee Seller'
    };
  });
}