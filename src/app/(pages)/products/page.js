// src/app/(pages)/products/page.js
import { getProducts } from '@/lib/services/productService';
import ProductBrowser from './ProductBrowser';

// This forces Next.js to ALWAYS grab the freshest data from Supabase!
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  // Fetch the data on the secure server
  const products = await getProducts();

  // Pass it into our interactive Client Component
  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <ProductBrowser initialProducts={products} />
    </div>
  );
}