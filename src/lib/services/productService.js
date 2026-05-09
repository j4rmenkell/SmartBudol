import { createClient } from '@/lib/supabase/server';

export async function getProducts() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('price', { ascending: true });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return products;
}