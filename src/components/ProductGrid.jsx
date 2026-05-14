import { ProductCard } from './ProductCard'; 
import { getBestDealId } from '@/lib/utils';

export function ProductGrid({ products }) {
  // Calculate the best deal ID based on multiple factors
  const bestDealId = getBestDealId(products);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((item) => (
        <ProductCard 
          key={item.id} 
          product={item} 
          isBest={item.id === bestDealId} 
        />
      ))}
    </div>
  );
}