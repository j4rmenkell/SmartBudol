'use client'; 

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Star, MapPin } from 'lucide-react'; 
import Link from 'next/link';

// Shadcn UI Imports
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompareButton } from '@/components/CompareButton';

export default function ProductBrowser({ initialProducts }) {
  const router = useRouter();
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [products, setProducts] = useState(initialProducts);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [isScraping, setIsScraping] = useState(false);

  // Filters State
  const [sortOrder, setSortOrder] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [stores, setStores] = useState({ Lazada: true, Shopee: true });

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // ==========================================
  // SEARCH LOGIC
  // ==========================================
  const executeSearch = async () => {
    setActiveSearch(searchInput); 

    const localMatches = products.filter(p => 
      p.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (localMatches.length === 0 && searchInput.trim() !== "") {
      const ENABLE_LIVE_SCRAPING = true; 
      
      if (!ENABLE_LIVE_SCRAPING) {
        alert("Live scraping is currently disabled to save our Apify credits! 💸 \n\nPlease search for something we already have in the database.");
        return; 
      }

      setIsScraping(true);
      try {
        const res = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchQuery: searchInput })
        });

        if (res.ok) {
          router.refresh(); 
        }
      } catch (error) {
        console.error("Scrape failed:", error);
      } finally {
        setIsScraping(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') executeSearch();
  };

  const toggleStore = (storeName) => {
    setStores(prev => ({ ...prev, [storeName]: !prev[storeName] }));
  };

  // ==========================================
  // FILTERING & SORTING
  // ==========================================
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.platform === 'Lazada' && !stores.Lazada) return false;
      if (p.platform === 'Shopee' && !stores.Shopee) return false;
      if (activeSearch && !p.name.toLowerCase().includes(activeSearch.toLowerCase())) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    }).sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      if (sortOrder === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, activeSearch, stores, minPrice, maxPrice, sortOrder]);


  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* =========================================
          LEFT COLUMN: SIDEBAR FILTERS
      ========================================= */}
      <aside className="w-full md:w-56 flex-shrink-0">
        <Card className="p-4 sticky top-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Filters</h2>
            <span className="text-[11px] font-medium text-slate-400">{filteredProducts.length} items</span>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Sort By</label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full h-8 text-xs capitalize">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default" className="text-xs capitalize">Default</SelectItem>
                <SelectItem value="price-asc" className="text-xs">Price: Low to High</SelectItem>
                <SelectItem value="price-desc" className="text-xs">Price: High to Low</SelectItem>
                <SelectItem value="rating" className="text-xs">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-3" />

          {/* Price Range */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Price Range</label>
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                placeholder="Min ₱" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-8 text-xs w-full"
              />
              <span className="text-slate-300">-</span>
              <Input 
                type="number" 
                placeholder="Max ₱" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-8 text-xs w-full"
              />
            </div>
          </div>

          <Separator className="my-3" />

          {/* Store Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Store</label>
            <div className="flex gap-2">
              <button 
                onClick={() => toggleStore('Lazada')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-md border transition-all ${
                  stores.Lazada 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Lazada
              </button>
              <button 
                onClick={() => toggleStore('Shopee')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-md border transition-all ${
                  stores.Shopee 
                    ? 'bg-orange-50 text-orange-600 border-orange-200' 
                    : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Shopee
              </button>
            </div>
          </div>
        </Card>
      </aside>

      {/* =========================================
          RIGHT COLUMN: SEARCH & PRODUCT GRID
      ========================================= */}
      <section className="flex-1">
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-2">
            <Input 
              type="text" 
              placeholder="Search for gaming mice, mechanical keyboards..." 
              className="flex-1 h-11"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={executeSearch} className="h-11 px-8 bg-slate-900 text-white hover:bg-slate-800">
              Search
            </Button>
          </div>

          {/* APIFY LOADING NOTIFICATION */}
          {isScraping && (
            <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3 border border-blue-200 animate-in fade-in slide-in-from-top-2 shadow-sm">
              <Loader2 className="animate-spin h-5 w-5" />
              <p className="text-sm font-medium">
                No local results for "<strong>{searchInput}</strong>". Deploying Apify scrapers to Lazada & Shopee... <br/>
                <span className="text-xs text-blue-600/80 font-normal">This usually takes about 30-60 seconds. Do not refresh the page.</span>
              </p>
            </div>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={`${product.platform}-${product.external_id}`} className="flex flex-col overflow-hidden group hover:shadow-md transition-all relative">
              
              {/* Discount Badge */}
              {product.discount_percentage > 0 && (
                <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm">
                  -{product.discount_percentage}%
                </div>
              )}

              <div className="relative aspect-square w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                {product.image_url && product.image_url.trim() !== "" ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-xs text-slate-400 font-medium select-none">
                    No Image Available
                  </div>
                )}
              </div>

              <CardContent className="p-4 flex-grow flex flex-col">
                <div className="mb-2 flex justify-between items-start">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    product.platform.toLowerCase() === 'shopee' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {product.platform}
                  </span>
                  
                  {/* Rating & Reviews */}
                  {product.reviews_count > 0 && product.rating > 0 && (
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span className="text-amber-600 font-bold">{product.rating}</span>
                      <span className="text-slate-400">({product.reviews_count.toLocaleString()})</span>
                    </div>
                  )}
                </div>

                <h2 className="text-sm font-medium line-clamp-2 mb-2 leading-snug">
                  {product.name}
                </h2>
                
                <div className="mt-auto">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-xl font-bold text-slate-900">₱{product.price?.toLocaleString()}</span>
                    {product.original_price > product.price && (
                      <span className="text-xs text-slate-400 line-through mb-1">
                        ₱{product.original_price?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  {/* Location & Sales Data with Lucide MapPin Icon */}
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1 min-h-[16px]">
                    <span className="line-clamp-1 truncate max-w-[60%] flex items-center">
                      {product.location && (
                        <>
                          <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                          {product.location}
                        </>
                      )}
                    </span>
                    <span>{product.sales_volume > 0 ? `${product.sales_volume.toLocaleString()} sold` : ''}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex gap-2 border-none border-t-0">
                <Link 
                  href={`/products/${product.id}`} 
                  className={buttonVariants({ 
                    className: "flex-1 h-12 bg-[#00694c] text-white hover:bg-[#008560] hover:text-white transition-colors" 
                  })}
                >
                  View Details
                </Link>
                <CompareButton productId={product.id} />
              </CardFooter>

            </Card>
          ))}
        </div>
        
        {/* Empty State */}
        {!isScraping && filteredProducts.length === 0 && (
           <div className="text-center py-20 text-slate-500">
             <p className="text-lg font-semibold">No products found</p>
             <p className="text-sm mt-1">Try adjusting your filters or searching for something else.</p>
           </div>
        )}

      </section>
    </main>
  );
}