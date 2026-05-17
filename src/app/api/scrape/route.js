// src/app/api/scrape/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { normalizeLazada, normalizeShopee } from '@/lib/formatters';

const MAX_RESULTS_LIMIT = 10; 

const LAZADA_ACTOR_ID = 'fatihtahta/lazada-scraper';
const SHOPEE_ACTOR_ID = 'xtracto/shopee-scraper';

async function fetchFromApify(actorId, payload) {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN is missing in .env.local");

  const safeActorId = actorId.replace('/', '~');
  
  // THE FIX: Added "-items" to the very end of the URL right before the ?
  const url = `https://api.apify.com/v2/acts/${safeActorId}/run-sync-get-dataset-items?token=${token}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), 
  });

  // Upgraded error logging so Apify tells us EXACTLY what is wrong if it fails
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Apify error (${response.status}): ${errorText}`);
  }
  return await response.json();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const searchQuery = body.searchQuery || "Keyboard";

    console.log(`Starting Live Scrape for: ${searchQuery}`);

    const lazadaPayload = {
      country: "ph",
      queries: [searchQuery], 
      limit: MAX_RESULTS_LIMIT
    };

    const shopeePayload = {
      country: "ph",
      mode: "keyword", 
      keyword: searchQuery, 
      maxProducts: MAX_RESULTS_LIMIT
    };

    // 1. Fetch live data from Apify
    const [rawLazada, rawShopee] = await Promise.all([
      fetchFromApify(LAZADA_ACTOR_ID, lazadaPayload).catch((e) => { console.error("Lazada failed:", e); return []; }),
      fetchFromApify(SHOPEE_ACTOR_ID, shopeePayload).catch((e) => { console.error("Shopee failed:", e); return []; })
    ]);

    // 2. Normalize and enforce the hard limit locally
    const cleanLazada = normalizeLazada(rawLazada).slice(0, MAX_RESULTS_LIMIT);
    const cleanShopee = normalizeShopee(rawShopee).slice(0, MAX_RESULTS_LIMIT);

    const allProducts = [...cleanLazada, ...cleanShopee];

    if (allProducts.length === 0) {
      return NextResponse.json({ success: false, message: "No products found." }, { status: 404 });
    }

    // 3. Cache immediately into Supabase
    const supabase = await createClient();
    const { error } = await supabase
      .from('products')
      .upsert(allProducts, { onConflict: 'platform, external_id' });

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: `Successfully scraped and cached ${allProducts.length} items from PH marketplaces!`,
    });

  } catch (err) {
    console.error('Scrape API Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}