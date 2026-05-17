"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { FavoritesCard } from "./FavoritesCard";

export function FavoritesTab() {
  const [savedFavorites, setSavedFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [favoriteToDelete, setFavoriteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function getFavorites() {
      setIsLoading(true);
      const supabase = createClient();

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          throw new Error("You must be logged in to view favorites.");
        }

        // Left join favorites with products based on the schema
        const { data: favs, error: fetchError } = await supabase
          .from("favorites")
          .select(
            `id, 
             created_at,
             products (
               id,
               name,
               price,
               image_url,
               platform,
               url
             )
            `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        const formattedFavorites = (favs || []).map((fav) => ({
          id: fav.id,
          created_at: fav.created_at,
          // Since product_id is a single reference to products table
          product: Array.isArray(fav.products) ? fav.products[0] : fav.products,
        }));

        setSavedFavorites(formattedFavorites);
      } catch (error) {
        console.error("Mahiwagang error: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    getFavorites();
  }, []);

  // Opens the delete confirmation modal
  const openDeleteModal = (favorite) => {
    setFavoriteToDelete(favorite);
    setIsDeleteModalOpen(true);
  };

  // Handle Delete Logic (called from modal confirmation)
  const handleConfirmDelete = async () => {
    if (!favoriteToDelete) return;
    setIsDeleting(true);

    const dbId = favoriteToDelete.id;
    const previousFavorites = [...savedFavorites];
    // Optimistic UI update
    setSavedFavorites((prev) => prev.filter((fav) => fav.id !== dbId));

    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", dbId);

      if (error) throw error;

      showToast("Removed from favorites", "success");
    } catch (error) {
      console.error("Error removing favorite: ", error);
      // Revert if error occurs
      setSavedFavorites(previousFavorites);
      showToast("Failed to remove. Please try again.", "error");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setFavoriteToDelete(null);
    }
  };

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-sm animate-pulse"
          >
            {/* Date + delete icon row */}
            <div className="flex justify-between items-start mb-3">
              <div className="h-3 w-28 bg-surface-container-high/50 rounded" />
              <div className="h-4 w-4 bg-surface-container-high/50 rounded" />
            </div>
            {/* Title */}
            <div className="h-5 w-3/4 bg-surface-container-high/50 rounded mb-1.5" />
            <div className="h-5 w-1/2 bg-surface-container-high/50 rounded mb-3" />
            {/* Platform badge */}
            <div className="flex gap-2 mb-4">
              <div className="h-4 w-14 bg-surface-container-high/50 rounded-full" />
            </div>
            {/* Price bar */}
            <div className="flex justify-between items-center bg-surface-container-low rounded-lg p-3 mb-4">
              <div className="h-4 w-10 bg-surface-container-high/50 rounded" />
              <div className="h-4 w-14 bg-surface-container-high/50 rounded" />
            </div>
            {/* Button */}
            <div className="h-10 w-full bg-surface-container-high/50 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {savedFavorites.length === 0 ? (
        <div className="bg-surface-container-lowest border-2 border-dashed border-outline-variant/40 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
          {/* Muted heart icon */}
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
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <p className="text-sm font-medium text-on-surface-variant mb-1">
            No favorites saved yet
          </p>
          <p className="text-xs text-on-surface-variant/60">
            Browse products and tap the heart to save your favorites here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedFavorites.map((fav) => (
            <FavoritesCard
              key={fav.id}
              date={`Added ${new Date(fav.created_at).toLocaleDateString()}`}
              product={fav.product}
              onDelete={() => openDeleteModal(fav)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-on-surface font-headline mb-2">
              Remove Favorite
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-on-surface">
                &ldquo;{favoriteToDelete?.product?.name}&rdquo;
              </span>{" "}
              from your favorites?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setFavoriteToDelete(null);
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
                {isDeleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
