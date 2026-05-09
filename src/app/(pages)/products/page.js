// src/app/(pages)/products/page.js
import { getProducts } from '@/lib/services/productService';

// Shadcn UI Imports
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <main className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* =========================================
            LEFT COLUMN: SIDEBAR FILTERS
        ========================================= */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-6">Filter by</h2>

            {/* Sort By using Shadcn Select */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Sort By</label>
              <Select defaultValue="default">
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

            {/* Price Range using Shadcn Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Price Range</label>
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Min ₱" />
                <span className="text-muted-foreground">-</span>
                <Input type="number" placeholder="Max ₱" />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Store Filter using Shadcn Checkbox */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">Store</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="store-lazada" />
                  <label htmlFor="store-lazada" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Lazada
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="store-shopee" />
                  <label htmlFor="store-shopee" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                {['Keyboards', 'Mice', 'Monitors', 'Headsets'].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={`cat-${category}`} />
                    <label htmlFor={`cat-${category}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
          
          {/* Search Bar using Shadcn Input & Button */}
          <div className="mb-6">
            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="Search products..." 
                className="flex-1"
              />
              <Button>Search</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Showing <span className="font-semibold text-foreground">{products.length}</span> results
            </p>
          </div>

          {/* Product Grid using Shadcn Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={`${product.platform}-${product.external_id}`} className="flex flex-col overflow-hidden group hover:shadow-md transition-all">
                
                {/* Image & Badge */}
                <div className="relative aspect-square w-full bg-muted">
                  <Badge 
                    variant={product.platform.toLowerCase() === 'shopee' ? 'destructive' : 'default'}
                    className={`absolute top-2 left-2 z-10 ${product.platform.toLowerCase() === 'lazada' ? 'bg-[#0f146d] hover:bg-[#0f146d]' : ''}`}
                  >
                    {product.platform}
                  </Badge>
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <CardContent className="p-4 flex-grow flex flex-col">
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

                {/* Footer / Button */}
                <CardFooter className="p-4 pt-0">
                  <Button variant="secondary" className="w-full" asChild>
                    <a href={product.url} target="_blank" rel="noopener noreferrer">
                      View Deal
                    </a>
                  </Button>
                </CardFooter>

              </Card>
            ))}
          </div>
          
        </section>
      </main>
    </div>
  );
}