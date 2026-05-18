'use client';
import { useRouter } from 'next/navigation';
import { Scale } from 'lucide-react'; // <-- Updated import
import { Button } from '@/components/ui/button';

export function CompareButton({ productId }) {
  const router = useRouter();

  const handleCompare = () => {
    const existing = JSON.parse(localStorage.getItem('compareIds') || '[]');
    const updated = [...new Set([...existing, productId.toString()])].slice(0, 3);
    localStorage.setItem('compareIds', JSON.stringify(updated));
    router.push(`/compare?ids=${updated.join(',')}`);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      title="Compare this product"
      onClick={handleCompare}
      className="h-12 w-12 shrink-0 rounded-xl border border-input"
    >
      {/* Updated Icon */}
      <Scale className="h-5 w-5 text-muted-foreground" /> 
      <span className="sr-only">Compare</span>
    </Button>
  );
}