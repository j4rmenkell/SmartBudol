"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";

export function FavoriteButton({ productId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    async function checkFavorite() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (data) setIsFavorite(true);
      setIsLoading(false);
    }
    checkFavorite();
  }, [productId, supabase]);

  const toggleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      showToast("Please log in to save favorites.", "error");
      return;
    }

    setIsLoading(true);

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (!error) {
        setIsFavorite(false);
        showToast("Removed from favorites", "success");
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, product_id: productId });

      if (!error) {
        setIsFavorite(true);
        showToast("Added to favorites", "success");
      }
    }
    setIsLoading(false);
  };

  return (
    <button 
      onClick={toggleFavorite}
      disabled={isLoading}
      // Using a subtle 0.5px border and 6px radius for the minimalist style
      className="p-2 rounded-md border-[0.5px] border-transparent hover:border-[#e4e4e7] hover:bg-white transition-all disabled:opacity-50"
      aria-label="Toggle Favorite"
    >
      <Heart 
        className={`w-6 h-6 transition-colors ${
          isFavorite ? "fill-[#ba1a1a] text-[#ba1a1a]" : "text-[#1a1b22]"
        }`} 
        strokeWidth={1.5}
      />
    </button>
  );
}