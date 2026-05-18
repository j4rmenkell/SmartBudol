"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Bookmark } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ComparisonTable } from "@/components/ComparisonTable";
import {
  formatPrice,
  getBestDealId,
  addValueScoresToProducts,
} from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const comparisonId = searchParams.get("comparisonId");
  const { showToast } = useToast();

  /* =========================================
     STATE MANAGEMENT & URL QUERY PARSING
     ========================================= */
  
  // Extract product IDs from the URL query string (e.g., ?ids=14,22,5)
  const idString = searchParams.get("ids");
  const ids = idString ? idString.split(",").filter(Boolean) : [];

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [comparisonTitle, setComparisonTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  /* =========================================
     SUPABASE DATA FETCHING & SYNCHRONIZATION
     ========================================= */

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
        // Ensure IDs match the database data type (handles numeric IDs safely)
        const safeIds = ids.map(id => isNaN(id) ? id : Number(id));

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', safeIds); 
          
        if (error) {
          console.error("Raw Supabase Error:", error);
          throw error;
        }
        
        // Sort fetched rows to maintain the precise selection order chosen by the user
        const sortedData = data?.sort((a, b) => ids.indexOf(a.id.toString()) - ids.indexOf(b.id.toString()));
        const scoredData = addValueScoresToProducts(sortedData || []);
        
        setProducts(scoredData);
        
      } catch (error) {
        console.error("Error fetching products:", error.message || JSON.stringify(error, null, 2));
      } finally {
        setIsLoading(false);
      }
    }

    fetchComparedProducts();
  }, [idString]); // eslint-disable-line react-hooks/exhaustive-deps

  /* =========================================
     LOCAL STORAGE PERSISTENCE RECOVERY
     ========================================= */

  // Backup active comparison selections in local storage whenever they change
  useEffect(() => {
    if (ids.length > 0) {
      localStorage.setItem("compareIds", JSON.stringify(ids));
    }
  }, [idString, ids]);

  // Lifecycle recovery: Hydrate state from local storage if page reloads with empty query parameters
  useEffect(() => {
    if (!idString) {
      const saved = JSON.parse(localStorage.getItem("compareIds") || "[]");
      if (saved.length > 0) {
        router.replace(`/compare?ids=${saved.join(",")}`);
      }
    }
  }, [idString, router]);

  // Sync a unique comparison string session token directly with the URL state
  useEffect(() => {
    if (ids.length > 0 && !comparisonId) {
      const newComparisonId = `cmp_${crypto.randomUUID().slice(0, 8)}`;
      router.replace(
        `/compare?comparisonId=${newComparisonId}&ids=${ids.join(",")}`,
      );
    }
  }, [idString, comparisonId, ids, router]);

  /* =========================================
     MUTATION HANDLERS & DATABASE SAVING
     ========================================= */

  const handleRemoveProduct = (idToRemove) => {
    const newIds = ids.filter((id) => id !== idToRemove.toString());
    localStorage.setItem("compareIds", JSON.stringify(newIds));
    
    if (newIds.length > 0) {
      router.push(`/compare?ids=${newIds.join(",")}`);
    } else {
      localStorage.removeItem("compareIds");
      router.push("/compare");
    }
  };

  const handleOpenSaveModal = () => {
    if (ids.length < 2) {
      showToast("Please select at least 2 products to save a comparison.", "error");
      return;
    }
    setIsSaveModalOpen(true);
  };

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

      // Check if a comparison row with this exact title already exists for this user profile
      const { data: existingComparisons, error: fetchError } = await supabase
        .from("saved_comparisons")
        .select("id")
        .eq("user_id", user.id)
        .eq("title", finalTitle);

      if (fetchError) throw fetchError;

      const existingComparison = existingComparisons?.[0];
      let targetComparisonId;

      if (existingComparison) {
        // Upsert strategy: Clear former configuration items to replace them cleanly
        targetComparisonId = existingComparison.id;

        const { error: deleteError } = await supabase
          .from("comparison_items")
          .delete()
          .eq("saved_comparison_id", targetComparisonId);

        if (deleteError) throw deleteError;
        
        await supabase
          .from("saved_comparisons")
          .update({ comparison_id: comparisonId })
          .eq("id", targetComparisonId);

      } else {
        // Creation strategy: Build brand new parent row record
        const { data: newComparison, error: insertError } = await supabase
          .from("saved_comparisons")
          .insert({
            user_id: user.id,
            comparison_id: comparisonId,
            title: finalTitle,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        targetComparisonId = newComparison.id;
      }

      // Populate associative mapping tables using the validated parent ID reference
      const itemsToInsert = ids.map((productId) => ({
        saved_comparison_id: targetComparisonId,
        product_id: productId,
      }));

      const { error: itemsError } = await supabase
        .from("comparison_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      showToast(
        existingComparison 
          ? "Comparison updated successfully!" 
          : "Comparison saved successfully!", 
        "success"
      );
      
      setIsSaveModalOpen(false);
      setComparisonTitle("");
    } catch (error) {
      console.error("Error saving comparison:", error);
      showToast("Failed to save. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================
     BUSINESS LOGIC & DERIVED VIEW STATES
     ========================================= */
  
  const isEmpty = products.length === 0;

  // Append calculated dynamic analytics engine metrics across retrieved entries
  const scoredProducts = addValueScoresToProducts(products);

  // Compute boundaries to determine whether to apply safety overrides on the visual layer
  const validPrices = scoredProducts.map((p) => parseFloat(p.price) || 0).filter((price) => price > 0);
  const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : 0;
  const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  
  // UX Safeguard: Catch cross-category comparison mismatches (e.g., accessory vs flagship machine)
  const isPriceMismatch = minPrice > 0 && (maxPrice / minPrice) > 5;

  // Compute best algorithmic deal index value (suppressed completely if dataset is heavily disparate)
  const bestDealId = (!isPriceMismatch && scoredProducts.length > 0) 
    ? getBestDealId(scoredProducts) 
    : null;

  const placeholdersNeeded = Math.max(0, 3 - scoredProducts.length);

  /* =========================================
     PAGE TEMPLATE RENDERING LAYOUT
     ========================================= */

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans pb-20 md:pb-8 flex flex-col">
      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 pt-8 md:pt-12 flex-grow space-y-8">
        
        {/* TOP NAVIGATION & CONTROLS */}
        <div className="space-y-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            {isEmpty ? "Browse Products" : "Back to results"}
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

            {!isEmpty && (
              <button
                onClick={handleOpenSaveModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm bg-surface-variant/20 text-on-surface border border-outline-variant hover:bg-surface-variant/40 transition-colors"
              >
                <Bookmark size={16} />
                Save Comparison
              </button>
            )}
          </div>
        </div>

        {/* COMPARED PRODUCT CARDS / PLACEHOLDERS GRID */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[350px]">
            <p className="text-on-surface-variant animate-pulse">
              Loading comparison...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {scoredProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard
                    product={product}
                    isBest={product.id === bestDealId}
                  />

                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {Array.from({ length: placeholdersNeeded }).map((_, index) => (
                <Link
                  href="/products"
                  key={`empty-slot-${index}`}
                  className="flex flex-col items-center justify-center min-h-[350px] border-2 border-dashed border-outline-variant/60 rounded-xl bg-surface-variant/5 hover:bg-surface-variant/20 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 mb-3 rounded-full bg-surface-variant/40 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Plus
                      size={24}
                      className="text-on-surface-variant group-hover:text-primary transition-colors"
                    />
                  </div>
                  <span className="font-medium text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                    Add a product
                  </span>
                </Link>
              ))}
            </div>

            {/* DETAILED DATA ATTRIBUTE COMPARISON TABLE */}
            {isEmpty ? (
              <div className="mt-8 p-8 md:p-12 text-center rounded-xl border border-dashed border-outline-variant/50 bg-surface-variant/5">
                <p className="text-on-surface-variant font-medium">
                  Select products from the list to see their features compared
                  side-by-side.
                </p>
              </div>
            ) : (
              <div className="space-y-3 mt-8">
                <h2 className="text-lg font-semibold tracking-tight text-on-surface">
                  Side-by-side comparison
                </h2>
                <ComparisonTable 
                  products={scoredProducts} 
                  bestDealId={bestDealId} 
                  isPriceMismatch={isPriceMismatch} 
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* SAVE BACKEND MODAL INTERFACE */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-on-surface font-headline mb-2">
              Save Comparison
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Give this comparison a name so you can easily find it later in
              your account.
            </p>

            <form onSubmit={handleSaveComparison}>
              <div className="mb-6">
                <label
                  htmlFor="comparison-title"
                  className="block text-sm font-medium text-[#191c1e] mb-1.5"
                >
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
                  {isSaving ? "Saving..." : "Save Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}