import { Award } from 'lucide-react';

export function BestDealBadge() {
  return (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-gradient-to-r from-[#00694c] to-[#008560] text-white px-3.5 py-1 rounded-full shadow-md border border-white/20">
      <Award size={14} className="text-[#86f8c9]" strokeWidth={2.5} />
      <span className="text-[10px] font-bold tracking-widest uppercase">
        Best Deal
      </span>
    </div>
  );
}