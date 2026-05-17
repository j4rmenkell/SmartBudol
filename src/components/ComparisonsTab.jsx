"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { ComparisonCard } from "./ComparisonCard";

// EXISTING TABS (Comparisons)
export function ComparisonsTab() {
  const [savedComparisons, setSavedComparisons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [comparisonToDelete, setComparisonToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function getComparison() {
      setIsLoading(true);
      const supabase = createClient();

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          throw new Error("You must be logged in to view saved comparisons.");
        }

        const { data: savedComp, error: fetchError } = await supabase
          .from("saved_comparisons")
          .select(
            `id, 
              comparison_id, 
              title, 
              created_at,
              comparison_items (
                products (
                  id,
                  name,
                  price,
                  image_url,
                  vendor,
                  platform
                )
              )
            `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        const formattedComparisons = (savedComp || []).map((comp) => ({
          id: comp.id,
          comparison_id: comp.comparison_id,
          title: comp.title,
          created_at: comp.created_at,
          products: comp.comparison_items
            .map((item) => item.products)
            .filter(Boolean),
        }));

        setSavedComparisons(formattedComparisons);
      } catch (error) {
        console.error("Mahiwagang error: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    getComparison();
  }, []);

  // Opens the delete confirmation modal
  const openDeleteModal = (comparison) => {
    setComparisonToDelete(comparison);
    setIsDeleteModalOpen(true);
  };

  // Handle Delete Logic (called from modal confirmation)
  const handleConfirmDelete = async () => {
    if (!comparisonToDelete) return;
    setIsDeleting(true);

    const dbId = comparisonToDelete.id;
    const previousComparisons = [...savedComparisons];
    setSavedComparisons((prev) => prev.filter((comp) => comp.id !== dbId));

    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("saved_comparisons")
        .delete()
        .eq("id", dbId);

      if (error) throw error;

      showToast("Comparison deleted", "success");
    } catch (error) {
      console.error("Error deleting comparison: ", error);
      setSavedComparisons(previousComparisons);
      showToast("Failed to delete. Please try again.", "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setComparisonToDelete(null);
    }
  };

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-sm animate-pulse"
          >
            {/* Date + delete icon row */}
            <div className="flex justify-between items-start mb-3">
              <div className="h-3 w-24 bg-surface-container-high/50 rounded" />
              <div className="h-4 w-4 bg-surface-container-high/50 rounded" />
            </div>
            {/* Title */}
            <div className="h-5 w-3/4 bg-surface-container-high/50 rounded mb-3" />
            {/* Products list area */}
            <div className="flex flex-col gap-3 bg-surface-container-low rounded-lg p-3 mb-4">
              {[1, 2].map((j) => (
                <div
                  key={j}
                  className="flex justify-between items-center pb-2 last:pb-0"
                >
                  <div className="flex flex-col gap-1.5 pr-4">
                    <div className="h-4 w-40 bg-surface-container-high/50 rounded" />
                    <div className="h-4 w-14 bg-surface-container-high/50 rounded-full" />
                  </div>
                  <div className="h-4 w-12 bg-surface-container-high/50 rounded" />
                </div>
              ))}
            </div>
            {/* Button */}
            <div className="h-10 w-full bg-surface-container-high/50 rounded-lg mt-4" />
          </div>
        ))}
      </div>
    );
  }

  // Map the fetched comparisons into the ComparisonCard
  return (
    <div className="space-y-4">
      {savedComparisons.length === 0 ? (
        <div className="bg-surface-container-lowest border-2 border-dashed border-outline-variant/40 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
          {/* Muted comparison icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-on-surface-variant/30 mb-4"
          >
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="9" rx="1" />
            <path d="M10 7h4" />
            <path d="M3 16h18" />
            <path d="M3 20h18" />
          </svg>
          <p className="text-sm font-medium text-on-surface-variant mb-1">
            No saved comparisons yet
          </p>
          <p className="text-xs text-on-surface-variant/60">
            Compare products and save them here for easy access later.
          </p>
        </div>
      ) : (
        savedComparisons.map((comp) => (
          <ComparisonCard
            key={comp.id}
            id={comp.id}
            comparisonId={comp.comparison_id}
            date={new Date(comp.created_at).toLocaleDateString()}
            title={comp.title}
            products={comp.products}
            onDelete={() => openDeleteModal(comp)}
          />
        ))
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-on-surface font-headline mb-2">
              Delete Comparison
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-on-surface">
                &ldquo;{comparisonToDelete?.title}&rdquo;
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setComparisonToDelete(null);
                }}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#ba1a1a] to-[#d32f2f] hover:shadow-[0_4px_16px_rgba(186,26,26,0.3)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
