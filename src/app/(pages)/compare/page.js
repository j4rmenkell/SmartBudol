'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Bookmark } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ComparisonTable } from '@/components/ComparisonTable';
import { formatPrice, getBestDealId, addValueScoresToProducts } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client'; 
import { useToast } from '@/components/ui/toast';

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const comparisonId = searchParams.get('comparisonId');
  const { showToast } = useToast();
  
  // 1. Get IDs from URL (e.g., ?ids=1,2,3)
  const idString = searchParams.get('ids');
  const ids = idString ? idString.split(',').filter(Boolean) : [];

  // State Management
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [comparisonTitle, setComparisonTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
          .in('id', ids); 
          
        if (error) throw error;
        
        // Sort data to match the order of IDs in the URL
        const sortedData = data?.sort((a, b) => ids.indexOf(a.id.toString()) - ids.indexOf(b.id.toString()));
        setProducts(sortedData || []);

        const scoredData = addValueScoresToProducts(sortedData || []);
        
        setProducts(scoredData);
        
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComparedProducts();
  }, [idString]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist IDs to localStorage whenever they change
  useEffect(() => {
    if (ids.length > 0) {
      localStorage.setItem('compareIds', JSON.stringify(ids));
    }
  }, [idString, ids]);

  // On mount, restore from localStorage if URL has no IDs
  useEffect(() => {
    if (!idString) {
      const saved = JSON.parse(localStorage.getItem('compareIds') || '[]');
      if (saved.length > 0) {
        router.replace(`/compare?ids=${saved.join(',')}`);
      }
    }
  }, [idString, router]);

  useEffect(() => {
    // Create a comparison ID if there are products but no comparisonId yet
    if (ids.length > 0 && !comparisonId) {
      const newComparisonId = `cmp_${crypto.randomUUID().slice(0, 8)}`;
      router.replace(
        `/compare?comparisonId=${newComparisonId}&ids=${ids.join(',')}`
      );
    }
  }, [idString, comparisonId, ids, router]);

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

  // 4. Save comparison of products
  const handleSaveComparison = async (e) => {
    e.preventDefault(); 
    setIsSaving(true);
    const supabase = createClient();

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        showToast("Please log in to save comparisons.", "error"); 
        setIsSaving(false);
        setIsSaveModalOpen(false);
        return;
      }

      const finalTitle = comparisonTitle.trim() || `${products.length} Items Compared`;

      const { error: insertError } = await supabase
        .from('saved_comparisons')
        .insert({
          user_id: user.id,
          comparison_id: comparisonId,
          product_ids: ids,
          title: finalTitle
        });

      if (insertError) throw insertError;

      showToast("Comparison saved successfully!", "success");
      setIsSaveModalOpen(false);
      setComparisonTitle(''); 
      
    } catch (error) {
      console.error("Error saving comparison:", error);
      showToast("Failed to save. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // --- DERIVED STATE ---
  const isEmpty = products.length === 0;

  // 1. Dynamically calculate and attach the scores to the products in state
  const scoredProducts = addValueScoresToProducts(products);

  // 2. Calculate the best deal ID using the newly scored products
  const bestDealId = scoredProducts.length > 0 ? getBestDealId(scoredProducts) : null;
  
  const placeholdersNeeded = Math.max(0, 3 - scoredProducts.length);

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
                onClick={() => setIsSaveModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm bg-surface-variant/20 text-on-surface border border-outline-variant hover:bg-surface-variant/40 transition-colors"
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
              
              {scoredProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard 
                    product={product} 
                    isBest={product.id === bestDealId} 
                  />
                  
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
                <ComparisonTable products={scoredProducts} />
              </div>
            )}
          </>
        )}
      </div>

      {/* --- Save Comparison Modal --- */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          {/* Modal Box */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-on-surface font-headline mb-2">
              Save Comparison
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Give this comparison a name so you can easily find it later in your account.
            </p>
            
            <form onSubmit={handleSaveComparison}>
              <div className="mb-6">
                <label htmlFor="comparison-title" className="block text-sm font-medium text-[#191c1e] mb-1.5">
                  Comparison Name
                </label>
                <input
                  id="comparison-title"
                  type="text"
                  placeholder='e.g., "Laptop Options for School"'
                  value={comparisonTitle}
                  onChange={(e) => setComparisonTitle(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-[#bccac1]/40 rounded-lg text-[#191c1e] placeholder:text-[#bccac1] transition-all duration-150 focus:outline-none focus:border-[#00694c] focus:ring-2 focus:ring-[#86f8c9]/30"
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#00694c] to-[#008560] hover:shadow-[0_4px_16px_rgba(0,105,76,0.3)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {isSaving ? 'Saving...' : 'Save Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}