export function normalizeLazada(lazadaData) {
  const productsOnly = lazadaData.filter(item => item.record_type === "product");

  return productsOnly.map(item => {
    return {
      platform: "Lazada",
      id: item.product_id,
      name: item.product_name,
      url: item.product_url,
      image_url: item.media?.primary_image || "",
      price: parseFloat(item.pricing?.current_price || 0),
      rating: parseFloat(item.ratings?.rating_score || 0).toFixed(1),
      vendor: item.vendor?.seller_name || "Unknown Vendor",
    };
  });
}

export function normalizeShopee(shopeeData) {
  return shopeeData.map(item => {
    return {
      platform: "Shopee",
      id: item.item_id.toString(),
      name: item.name,
      url: item.url,
      image_url: item.image_url || "",
      price: parseFloat(item.price || 0),
      rating: item.rating ? parseFloat(item.rating).toFixed(1) : "0.0",
      vendor: `Shop ID: ${item.shop_id}`,
    };
  });
}