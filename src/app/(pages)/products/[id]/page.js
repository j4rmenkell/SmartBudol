import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Check, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CompareButton } from "@/components/CompareButton";
import { PlatformBadge } from "@/components/PlatformBadge";
import { Card } from "@/components/ui/card";

export default async function ProductDetailsPage({ params }) {
  const { id } = await params; 

  const supabase = await createClient();
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id) 
    .single();

  if (error || !product) {
    console.error("Supabase Error:", error);
    return notFound();
  }

  const formattedPrice = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(product.price);

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-20 font-[Manrope]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 space-y-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#3d4943] hover:text-[#1a1b22] transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back to results
          </Link>
          <div className="text-sm text-[#6d7a73] font-medium">
            Search: "All Products"
          </div>
        </div>

        {/* Main Product Section */}
        <Card className="bg-white border-[0.5px] border-[#e4e4e7] shadow-none rounded-md p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Left */}
            <div className="relative aspect-square w-full bg-[#F9F9F9] flex items-center justify-center p-8 overflow-hidden rounded-md">
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 items-start">
                <PlatformBadge platform={product.platform} />
              </div>
              
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-contain object-center mix-blend-multiply"
              />
            </div>

            {/* Right */}
            <div className="flex flex-col h-full py-2">
              <div className="flex justify-between items-start gap-4 mb-3">
                <h1 className="text-2xl md:text-[30px] font-bold text-[#1a1b22] leading-tight tracking-tight">
                  {product.name}
                </h1>
                <FavoriteButton productId={product.id} />
              </div>

              <div className="flex items-center gap-4 text-sm mb-6">
                <div className="flex items-center gap-1.5 font-semibold text-[#fc820c]">
                  <Star size={16} className="fill-[#fc820c]" />
                  {product.rating > 0 ? product.rating : "No ratings"}
                </div>
                <span className="text-[#dad9e3]">•</span>
                <span className="text-[#6d7a73] font-medium">1.2k Reviews</span>
                <span className="text-[#dad9e3]">•</span>
                <span className="flex items-center gap-1.5 text-[#00694c] font-semibold">
                  <Check size={14} strokeWidth={2.5} /> In Stock
                </span>
              </div>

              <div className="mb-8">
                <div className="text-[24px] md:text-[32px] font-extrabold text-[#1a1b22] mb-2 tracking-tight">
                  {formattedPrice}
                </div>
                <div className="text-sm text-[#6d7a73]">
                  Sold by <span className="font-semibold text-[#00694c]">{product.vendor}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <a 
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#00694c] hover:bg-[#008560] text-white px-6 py-3.5 rounded-md font-semibold transition-colors"
                >
                  Go to store <ArrowRight size={18} />
                </a>
                <div className="flex-1">
                  <CompareButton 
                    productId={product.id} 
                    className="w-full h-full py-3.5 bg-transparent border-[0.5px] border-[#6d7a73] text-[#1a1b22] hover:bg-[#f4f2fd] rounded-md font-semibold transition-colors" 
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Product Table */}
        <div className="mt-12 pt-8">
          <h2 className="text-[20px] font-semibold text-[#1a1b22] mb-6 tracking-tight">Product Specifications</h2>
          <Card className="overflow-hidden bg-white border-[0.5px] border-[#e4e4e7] shadow-none rounded-md">
            <div className="divide-y-[0.5px] divide-[#e4e4e7] text-sm">
              <div className="grid grid-cols-3 p-4 hover:bg-[#F9F9F9] transition-colors">
                <div className="text-[#6d7a73] font-semibold">Price</div>
                <div className="col-span-2 font-bold text-[#1a1b22]">{formattedPrice}</div>
              </div>
              <div className="grid grid-cols-3 p-4 hover:bg-[#F9F9F9] transition-colors">
                <div className="text-[#6d7a73] font-semibold">Rating</div>
                <div className="col-span-2 flex items-center gap-1.5 font-medium text-[#1a1b22]">
                  {product.rating} <Star size={14} className="text-[#fc820c] fill-[#fc820c]" />
                </div>
              </div>
              <div className="grid grid-cols-3 p-4 hover:bg-[#F9F9F9] transition-colors">
                <div className="text-[#6d7a73] font-semibold">Review Count</div>
                <div className="col-span-2 text-[#3d4943]">1,204 reviews</div>
              </div>
              <div className="grid grid-cols-3 p-4 hover:bg-[#F9F9F9] transition-colors">
                <div className="text-[#6d7a73] font-semibold">Free Shipping</div>
                <div className="col-span-2 flex items-center gap-1 text-[#00694c] font-medium">
                  <Check size={16} strokeWidth={2.5} /> Yes
                </div>
              </div>
              <div className="grid grid-cols-3 p-4 hover:bg-[#F9F9F9] transition-colors">
                <div className="text-[#6d7a73] font-semibold">Delivery Time</div>
                <div className="col-span-2 text-[#3d4943]">2-3 Business Days</div>
              </div>
              <div className="grid grid-cols-3 p-4 hover:bg-[#F9F9F9] transition-colors">
                <div className="text-[#6d7a73] font-semibold">Seller</div>
                <div className="col-span-2 text-[#3d4943]">{product.vendor}</div>
              </div>
              <div className="grid grid-cols-3 p-4 hover:bg-[#F9F9F9] transition-colors">
                <div className="text-[#6d7a73] font-semibold">Stock Status</div>
                <div className="col-span-2 text-[#00694c] font-semibold">In Stock</div>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}