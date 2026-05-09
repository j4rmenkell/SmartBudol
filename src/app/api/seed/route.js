import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { lazadaMockData, shopeeMockData } from '@/lib/mockData';
import { normalizeLazada, normalizeShopee } from '@/lib/formatters';

export async function GET() {
  try {
    const supabase = await createClient();

    const cleanLazada = normalizeLazada(lazadaMockData);
    const cleanShopee = normalizeShopee(shopeeMockData);

    const allProducts = [...cleanLazada, ...cleanShopee];

    const { data, error } = await supabase
      .from('products')
      .upsert(allProducts, { 
        onConflict: 'platform, external_id' 
      });

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully cached ${allProducts.length} products to Supabase!`,
    });

  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}