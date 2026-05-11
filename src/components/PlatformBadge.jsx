import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
 
export function PlatformBadge({ platform }) {
  // NEW: Safely handle undefined/null data
  const safePlatform = platform || ''; 
  
  const isShopee = safePlatform.toLowerCase() === 'shopee';
  const isLazada = safePlatform.toLowerCase() === 'lazada';
 
  return (
    <Badge
      className={cn(
        'uppercase tracking-wider text-[10px] font-bold',
        isShopee && 'bg-[#EE4D2D] text-white border-transparent',
        isLazada && 'bg-[#F57224] text-white border-transparent',
        !isShopee && !isLazada && 'bg-surface-container-high text-on-surface-variant',
      )}
    >
      {/* Fallback text if platform is missing */}
      {safePlatform || 'Unknown'} 
    </Badge>
  );
}