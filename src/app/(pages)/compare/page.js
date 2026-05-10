'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react'; // Added Plus icon
import { ProductCard } from '@/components/ProductCard';
import { ComparisonTable } from '@/components/ComparisonTable';
import { formatPrice, getBestPrice } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — delete once the real API route is wired up
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_RESULTS = {
  'wireless earphones': [
    {
      id: '1',
      name: 'Sony WH-1000XM4 Wireless Noise Cancelling Headphones',
      price: 14999,
      originalPrice: 17999,
      rating: 4.9,
      reviewCount: 1200,
      seller: 'TechGadgetsPH',
      store: 'Shopee',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      storeUrl: '#',
      location: 'Metro Manila',
    },
    {
      id: '2',
      name: 'Sony WH-1000XM4 Wireless Noise Cancelling Headphones – Silver',
      price: 13500,
      originalPrice: null,
      rating: 4.8,
      reviewCount: 850,
      seller: 'Sony Official Store',
      store: 'Lazada',
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
      storeUrl: '#',
      location: 'Pasig City',
    },
    {
      id: '3',
      name: 'Sony WH-1000XM4 Active Noise Cancelling Wireless',
      price: 15200,
      originalPrice: 16500,
      rating: 4.7,
      reviewCount: 320,
      seller: 'AudioMart',
      store: 'Shopee',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
      storeUrl: '#',
      location: 'Quezon City',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  // If there's no query or it doesn't match mock data, return an empty array
  const products = query ? (MOCK_RESULTS[query.toLowerCase()] || []) : [];
  
  // Derived state to check if we are in the "Empty State"
  const isEmpty = products.length === 0;
  
  // Calculate best price only if we have products to prevent errors
  const bestPrice = products.length > 0 ? getBestPrice(products) : 0;

  // We want to always show 3 slots total. If we have 1 product, show 2 placeholders.
  const placeholdersNeeded = Math.max(0, 3 - products.length);

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans pb-20 md:pb-8 flex flex-col">
      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 pt-8 md:pt-12 flex-grow space-y-8">

        {/* Back + Title */}
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            {isEmpty ? 'Browse Products' : 'Back to results'}
          </Link>
          
          {isEmpty ? (
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface font-headline">
              Compare Products
            </h1>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface font-headline">
                Comparing results for <span className="text-primary">'{query}'</span>
              </h1>
              <p className="text-sm text-on-surface-variant">
                {products.length} listings found · Best price{' '}
                <span className="font-semibold text-primary">{formatPrice(bestPrice)}</span>
              </p>
            </>
          )}
        </div>

        {/* Product Cards & Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Render actual products if they exist */}
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isBest={product.price === bestPrice}
            />
          ))}

          {/* Render empty placeholders to fill out the remaining of the 3 slots */}
          {Array.from({ length: placeholdersNeeded }).map((_, index) => (
            <button
              key={`empty-slot-${index}`}
              onClick={() => {
                 // TODO: Open your search modal or redirect here
                 console.log("Trigger search to add product");
              }}
              className="flex flex-col items-center justify-center min-h-[350px] border-2 border-dashed border-outline-variant/60 rounded-xl bg-surface-variant/5 hover:bg-surface-variant/20 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 mb-3 rounded-full bg-surface-variant/40 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Plus size={24} className="text-on-surface-variant group-hover:text-primary transition-colors" />
              </div>
              <span className="font-medium text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                Add a product
              </span>
            </button>
          ))}
        </div>

        {/* Comparison Table / Empty State Message */}
        {isEmpty ? (
           <div className="mt-8 p-8 md:p-12 text-center rounded-xl border border-dashed border-outline-variant/50 bg-surface-variant/5">
             <p className="text-on-surface-variant font-medium">
               Select products above to see their features compared side-by-side.
             </p>
           </div>
        ) : (
          <div className="space-y-3 mt-8">
            <h2 className="text-lg font-semibold tracking-tight text-on-surface">
              Side-by-side comparison
            </h2>
            <ComparisonTable products={products} />
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto p-4 md:px-8 py-6 mt-12 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
        <div className="flex items-center gap-4">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container font-headline text-base">
            SmartBudol
          </span>
          <span className="opacity-70">© 2024 SmartBudol. Finding the best value for savvy shoppers.</span>
        </div>
        <div className="flex gap-4 opacity-80">
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-primary transition-colors">Contact Us</Link>
          <Link href="#" className="hover:text-primary transition-colors">About</Link>
        </div>
      </footer>
    </div>
  );
}