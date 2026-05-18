import { getProducts } from '@/lib/services/productService';
import ProductBrowser from './ProductBrowser';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <ProductBrowser initialProducts={products} />
    </div>
  );
}