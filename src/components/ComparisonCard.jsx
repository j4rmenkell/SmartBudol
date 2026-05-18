import Link from "next/link";
import { PlatformBadge } from "@/components/PlatformBadge";

export function ComparisonCard({ onDelete, comparisonId, date, title, products }) {
  
  /* =========================================
     DYNAMIC URL GENERATION
     ========================================= */
     
  const productIdsString = products.map((p) => p.id).join(",");
  
  // Construct the destination path with query parameters for the Next.js router
  const hrefUrl = `/compare?comparisonId=${comparisonId}&ids=${productIdsString}`;

  /* =========================================
     COMPONENT RENDER
     ========================================= */

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      
      {/* --- Card Header: Date & Delete Action --- */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-on-surface-variant font-medium">
          {date}
        </span>
        <button
          onClick={onDelete}
          className="text-on-surface-variant hover:text-error transition-colors p-1"
          aria-label="Delete saved comparison"
        >
          {/* Inline SVG element used for the Trash Icon to reduce external dependencies */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      <h3 className="font-semibold text-base leading-tight text-on-surface mb-3">
        {title}
      </h3>

      {/* =========================================
          PRODUCT LIST MAPPING
          ========================================= */}
      <div className="flex flex-col gap-3 bg-surface-container-low rounded-lg p-3 mb-4">
        
        {/* Dynamically render a summary row for every product stored in this specific comparison */}
        {products.map((product) => (
          <div key={product.id} className="flex justify-between items-center border-b border-outline-variant/10 last:border-0 pb-2 last:pb-0">
            
            <div className="flex flex-col gap-1.5 pr-4">
              <span className="text-sm font-medium text-on-surface line-clamp-1" title={product.name}>
                {product.name}
              </span>
              
              <div className="flex items-center">
                <PlatformBadge platform={product.platform} />
              </div>
            </div>
            
            <span className="text-sm font-bold text-primary whitespace-nowrap">
              &#8369;{product.price}
            </span>
          </div>
        ))}
      </div>

      {/* --- Navigation Link --- */}
      <Link href={hrefUrl} className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container transition-colors flex items-center justify-center gap-2 mt-4">
        View Comparison
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </Link>
    </div>
  );
}