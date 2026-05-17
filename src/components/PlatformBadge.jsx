import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
 
export function PlatformBadge({ platform }) {
  const safePlatform = platform || ''; 
  
  const isShopee = safePlatform.toLowerCase() === 'shopee';
  const isLazada = safePlatform.toLowerCase() === 'lazada';
 
  return (
    <Badge
      className={cn(
        // Added rounded-full to keep that pill shape from your design doc
        'uppercase tracking-wider text-[10px] font-bold rounded-full px-2.5 py-0.5',
        isShopee && 'bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white border-transparent',
        // Updated to #F57C00 to match DESIGN.md exactly
        isLazada && 'bg-[#F57C00] hover:bg-[#F57C00]/90 text-white border-transparent',
        !isShopee && !isLazada && 'bg-surface-container-high text-on-surface-variant',
      )}
    >
      {safePlatform || 'Unknown'} 
    </Badge>
  );
}