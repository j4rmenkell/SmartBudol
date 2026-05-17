'use client'; // This tells Next.js this file can use State and listen to Clicks!

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

// Shadcn UI Imports
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompareButton } from '@/components/CompareButton';

const CATEGORIES = ['Keyboard', 'Mouse', 'Monitor', 'Headset'];

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
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Automatically update local state if the Server fetches new data (after Apify finishes)
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // ==========================================
  // SMART SEARCH LOGIC (API TRIGGER)
  // ==========================================
  const executeSearch = async () => {
    setActiveSearch(searchInput); // Applies local filter immediately

    // Check if we have any local results for this search
    const localMatches = products.filter(p => 
      p.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    // IF EMPTY: Trigger Apify!
    if (localMatches.length === 0 && searchInput.trim() !== "") {
      setIsScraping(true);
      try {
        const res = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchQuery: searchInput })
        });

        if (res.ok) {
          // Tell Next.js to silently reload the Server Component to grab the new DB items!
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

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  // ==========================================
  // FILTERING & SORTING ENGINE
  // ==========================================
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Store Filter
      if (p.platform === 'Lazada' && !stores.Lazada) return false;
      if (p.platform === 'Shopee' && !stores.Shopee) return false;

      // 2. Search Filter
      if (activeSearch && !p.name.toLowerCase().includes(activeSearch.toLowerCase())) return false;

      // 3. Price Filter
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;

      // 4. Category Filter
      if (selectedCategories.length > 0) {
        const matchesCategory = selectedCategories.some(cat => 
          p.name.toLowerCase().includes(cat.toLowerCase())
        );
        if (!matchesCategory) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      if (sortOrder === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, activeSearch, stores, minPrice, maxPrice, selectedCategories, sortOrder]);


  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* =========================================
          LEFT COLUMN: SIDEBAR FILTERS
      ========================================= */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-6">Filter by</h2>

          {/* Sort By */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Sort By</label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-6" />

          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Price Range</label>
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                placeholder="Min ₱" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-muted-foreground">-</span>
              <Input 
                type="number" 
                placeholder="Max ₱" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <Separator className="my-6" />

          {/* Store Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">Store</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="store-lazada" 
                  checked={stores.Lazada} 
                  onCheckedChange={(checked) => setStores(prev => ({ ...prev, Lazada: checked }))} 
                />
                <label htmlFor="store-lazada" className="text-sm font-medium leading-none cursor-pointer">
                  Lazada
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="store-shopee" 
                  checked={stores.Shopee} 
                  onCheckedChange={(checked) => setStores(prev => ({ ...prev, Shopee: checked }))}
                />
                <label htmlFor="store-shopee" className="text-sm font-medium leading-none cursor-pointer">
                  Shopee
                </label>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold mb-3">Category</label>
            <div className="space-y-3">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${category}`} 
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label htmlFor={`cat-${category}`} className="text-sm font-medium leading-none cursor-pointer">
                    {category}
                  </label>
                </div>
              ))}
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
              placeholder="Search products..." 
              className="flex-1"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={executeSearch} className="bg-slate-900 text-white hover:bg-slate-800">
              Search
            </Button>
          </div>

          {/* APIFY LOADING NOTIFICATION */}
          {isScraping && (
            <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-3 border border-blue-200 animate-in fade-in slide-in-from-top-2">
              <Loader2 className="animate-spin h-5 w-5" />
              <p className="text-sm font-medium">
                No local results for "<strong>{searchInput}</strong>". Deploying Apify scrapers to Lazada & Shopee... <br/>
                <span className="text-xs font-normal">This usually takes about 30-60 seconds. Do not refresh the page.</span>
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-4">
            Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> results
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={`${product.platform}-${product.external_id}`} className="flex flex-col overflow-hidden group hover:shadow-md transition-all">
              
              <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardContent className="p-4 flex-grow flex flex-col">
                <div className="mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    product.platform.toLowerCase() === 'shopee' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {product.platform}
                  </span>
                </div>

                <h2 className="text-sm font-medium line-clamp-2 mb-2 leading-snug">
                  {product.name}
                </h2>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-xl font-bold">₱{product.price.toFixed(2)}</span>
                    {product.rating > 0 && (
                      <span className="text-xs font-semibold text-amber-500">★ {product.rating}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    Store: {product.vendor}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex gap-2 border-none border-t-0">
                <Link 
                  href={`/products/${product.id}`} 
                  className={buttonVariants({ 
                    className: "flex-1 bg-[#00694c] text-white hover:bg-[#008560] hover:text-white transition-colors" 
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