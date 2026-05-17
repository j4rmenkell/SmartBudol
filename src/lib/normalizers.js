function parseSalesVolume(soldString) {
  if (!soldString) return 0;
  
  let cleanString = String(soldString).toLowerCase().replace(/sold/g, '').replace(/,/g, '').trim();
  
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
  return rawArray.map(raw => {
    const currentPrice = parseInt(String(raw.price ?? '0').replace(/[^0-9]/g, ''), 10);
    const origPrice = raw.originalPrice ? parseInt(String(raw.originalPrice).replace(/[^0-9]/g, ''), 10) : currentPrice;
    
    const calculatedDiscount = origPrice > currentPrice 
      ? Math.round(((origPrice - currentPrice) / origPrice) * 100) 
      : 0;

    return {
      platform: 'Lazada',
      external_id: String(raw.itemId ?? raw.nid ?? Math.random()),
      name: raw.name ?? 'Unknown Product',
      url: raw.itemUrl ? (raw.itemUrl.startsWith('http') ? raw.itemUrl : `https://www.lazada.com.ph${raw.itemUrl}`) : '#',
      image_url: raw.image ?? '',
      price: currentPrice,
      rating: raw.ratingScore ? parseFloat(Number(raw.ratingScore).toFixed(1)) : 0,
      vendor: raw.seller?.name ?? raw.brandName ?? 'Lazada Seller',
      original_price: origPrice,
      discount_percentage: calculatedDiscount,
      reviews_count: raw.review ? parseInt(String(raw.review).replace(/[^0-9]/g, ''), 10) : 0,
      sales_volume: parseSalesVolume(raw.item_sold ?? raw.sold ?? "0"),
      location: raw.location ?? null,
    };
  });
}

export function normalizeShopee(rawArray) {
  return rawArray.map(raw => {
    const rawPrice = raw.price ?? raw.priceMin ?? 0;
    const currentPrice = Math.round(rawPrice / 100);
    const origPrice = raw.originalPrice ? Math.round(raw.originalPrice / 100) : currentPrice;

    const calculatedDiscount = raw.discount_pct ?? (origPrice > currentPrice 
      ? Math.round(((origPrice - currentPrice) / origPrice) * 100) 
      : 0);

    return {
      platform: 'Shopee',
      external_id: String(raw.itemId ?? raw.shopid ?? raw.item_id ?? Math.random()),
      name: raw.name ?? 'Unknown Product',
      url: raw.itemUrl ?? raw.url ?? '#',
      image_url: Array.isArray(raw.images) ? raw.images[0] : (raw.image ?? raw.image_url ?? ''),
      price: currentPrice,
      rating: raw.ratingScore ?? raw.rating ? parseFloat(Number(raw.ratingScore ?? raw.rating).toFixed(1)) : 0,
      vendor: raw.shopName ?? raw.shop_name ?? raw.brandName ?? 'Shopee Seller',
      original_price: origPrice,
      discount_percentage: calculatedDiscount,
      reviews_count: raw.reviewCount ?? raw.cmt_count ?? raw.rating_count ?? 0,
      sales_volume: parseSalesVolume(raw.sold ?? raw.historical_sold ?? raw.sold_count ?? "0"),
      location: raw.location ?? raw.shop_location ?? null,
    };
  });
}