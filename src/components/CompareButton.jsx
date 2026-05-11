'use client';
import { useRouter } from 'next/navigation';
import { BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CompareButton({ productId }) {
  const router = useRouter();

  const handleCompare = () => {
    const existing = JSON.parse(localStorage.getItem('compareIds') || '[]');
    const updated = [...new Set([...existing, productId.toString()])].slice(0, 3); // max 3
    localStorage.setItem('compareIds', JSON.stringify(updated));
    router.push(`/compare?ids=${updated.join(',')}`);
  };

  return (
    <Button variant="outline" size="icon" title="Compare this product" onClick={handleCompare}>
      <BarChart2 className="h-4 w-4 text-muted-foreground" />
      <span className="sr-only">Compare</span>
    </Button>
  );
}