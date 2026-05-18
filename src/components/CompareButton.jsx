'use client';

import { useRouter } from 'next/navigation';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CompareButton({ productId }) {
  const router = useRouter();

  /* =========================================
     COMPARISON LOGIC & STORAGE
     ========================================= */

  const handleCompare = () => {
    // Retrieve the current list of product IDs saved in the browser's local storage
    const existing = JSON.parse(localStorage.getItem('compareIds') || '[]');
    
    /* Build the updated comparison array safely*/
    const updated = [...new Set([...existing, productId.toString()])].slice(0, 3);
    
    // Persist the updated array so the comparison state survives page reloads
    localStorage.setItem('compareIds', JSON.stringify(updated));
    
    // Redirect the user to the comparison dashboard, passing the IDs via URL query
    router.push(`/compare?ids=${updated.join(',')}`);
  };

  /* =========================================
     COMPONENT RENDER
     ========================================= */

  return (
    <Button
      variant="outline"
      size="icon"
      title="Compare this product"
      onClick={handleCompare}
      className="h-12 w-12 shrink-0 rounded-xl border border-input"
    >
      <Scale className="h-5 w-5 text-muted-foreground" /> 

      <span className="sr-only">Compare</span>
    </Button>
  );
}