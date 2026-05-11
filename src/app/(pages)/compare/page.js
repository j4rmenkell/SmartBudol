'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Bookmark, Check } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ComparisonTable } from '@/components/ComparisonTable';
import { formatPrice, getBestPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client'; // Adjust this import path if needed based on your project structure

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const comparisonId = searchParams.get('comparisonId');
  
  // 1. Get IDs from URL (e.g., ?ids=1,2,3)
  const idString = searchParams.get('ids');
  const ids = idString ? idString.split(',').filter(Boolean) : [];

  // State Management
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch products from Supabase whenever the URL changes
  useEffect(() => {
    async function fetchComparedProducts() {
      if (ids.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      const supabase = createClient();
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', ids); // Matches the 'id' column against our array of ids from the URL
          
        if (error) throw error;
        
        // Optional: Sort data to match the order of IDs in the URL
        const sortedData = data?.sort((a, b) => ids.indexOf(a.id.toString()) - ids.indexOf(b.id.toString()));
        setProducts(sortedData || []);
        
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComparedProducts();
  }, [idString]);

  // Persist IDs to localStorage whenever they change
  useEffect(() => {
    if (ids.length > 0) {
      localStorage.setItem('compareIds', JSON.stringify(ids));
    }
  }, [idString]);

  // On mount, restore from localStorage if URL has no IDs
  useEffect(() => {
    if (!idString) {
      const saved = JSON.parse(localStorage.getItem('compareIds') || '[]');
      if (saved.length > 0) {
        router.replace(`/compare?ids=${saved.join(',')}`);
      }
    }
  }, []);

  useEffect(() => {
    // Create a comparison ID if there are products but no comparisonId yet
    if (ids.length > 0 && !comparisonId) {
      const newComparisonId = `cmp_${crypto.randomUUID().slice(0, 8)}`;

      router.replace(
        `/compare?comparisonId=${newComparisonId}&ids=${ids.join(',')}`
      );
    }
  }, [idString, comparisonId]);

  // 3. Remove a product from the comparison
  const handleRemoveProduct = (idToRemove) => {
    const newIds = ids.filter((id) => id !== idToRemove.toString());
    localStorage.setItem('compareIds', JSON.stringify(newIds));
    if (newIds.length > 0) {
      router.push(`/compare?ids=${newIds.join(',')}`);
    } else {
      localStorage.removeItem('compareIds');
      router.push('/compare');
    }
  };



  // Derived state for the UI
  const isEmpty = products.length === 0;
  const bestPrice = products.length > 0 ? getBestPrice(products) : 0;
  const placeholdersNeeded = Math.max(0, 3 - products.length);

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans pb-20 md:pb-8 flex flex-col">
      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 pt-8 md:pt-12 flex-grow space-y-8">
        
        {/* --- Header Section --- */}
        <div className="space-y-2">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            {isEmpty ? 'Browse Products' : 'Back to results'}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface font-headline">
                Compare Products
              </h1>
              {!isEmpty && (
                <p className="text-sm text-on-surface-variant mt-1">
                  {products.length} item(s) selected
                </p>
              )}
            </div>

            {/* Save Comparison Button */}
            {!isEmpty && (
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm bg-surface-variant/20 text-on-surface border border-outline-variant"
              >
                <Bookmark size={16} />
                Save Comparison
              </button>
            )}
          </div>
        </div>

        {/* --- Main Content Area --- */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[350px]">
             <p className="text-on-surface-variant animate-pulse">Loading comparison...</p>
          </div>
        ) : (
          <>
            {/* Grid Section for Cards and Placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Render Fetched Products */}
              {products.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard product={product} isBest={product.price === bestPrice} />
                  
                  {/* Remove Item Button */}
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10 cursor-pointer" 
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {/* Render Empty Placeholders (up to 3 total slots) */}
              {Array.from({ length: placeholdersNeeded }).map((_, index) => (
                <Link
                  href="/products"
                  key={`empty-slot-${index}`}
                  className="flex flex-col items-center justify-center min-h-[350px] border-2 border-dashed border-outline-variant/60 rounded-xl bg-surface-variant/5 hover:bg-surface-variant/20 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 mb-3 rounded-full bg-surface-variant/40 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Plus size={24} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-medium text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                    Add a product
                  </span>
                </Link>
              ))}
            </div>

            {/* --- Table / Empty State Section --- */}
            {isEmpty ? (
              <div className="mt-8 p-8 md:p-12 text-center rounded-xl border border-dashed border-outline-variant/50 bg-surface-variant/5">
                <p className="text-on-surface-variant font-medium">
                  Select products from the list to see their features compared side-by-side.
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
          </>
        )}
      </div>
    </div>
  );
}