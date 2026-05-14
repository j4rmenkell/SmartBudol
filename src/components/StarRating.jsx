import { Star } from 'lucide-react';

export function StarRating({ rating, count }) {
  // Ensure rating is a valid number, default to 0 if missing
  const numRating = parseFloat(rating) || 0;
  const hasReviews = count && parseInt(count) > 0;

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <div className="flex items-center text-[#f59e0b]">
        {/* Fill the star to make it look like a real rating */}
        <Star size={15} className="fill-current" strokeWidth={2} />
        <span className="ml-1.5 text-sm font-bold text-on-surface">
          {numRating > 0 ? numRating.toFixed(1) : 'No rating'}
        </span>
      </div>
      
      {/* Only show the review count if it exists */}
      {hasReviews && (
        <span className="text-xs text-on-surface-variant">
          ({count} reviews)
        </span>
      )}
    </div>
  );
}