'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Logout from '@/components/Logout';
import Link from 'next/link';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('comparisons'); // 'comparisons' | 'favorites'

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    }
    fetchUser();
  }, []);

  const fullName = user?.user_metadata?.full_name || 'Loading...';
  const email = user?.email || '';

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans pb-20 md:pb-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full p-4 md:p-8 pt-8 md:pt-12 flex-grow">
        
        {/* Profile Header Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-8 mb-8 flex flex-col items-center text-center shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface font-headline mb-1">
            {fullName}
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base mb-6">
            {email}
          </p>
          
          {/* Sign Out Button (Reusing Logout Component) */}
          <Logout 
            label="Sign Out" 
            className="px-6 py-2 border border-outline-variant rounded-lg text-sm font-medium hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-surface"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant/30 mb-8 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('comparisons')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'comparisons'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant/50'
            }`}
          >
            Saved Comparisons
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant/50'
            }`}
          >
            Favorites
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'comparisons' && (
            <div className="space-y-4">
              <ComparisonCard
                date="Saved Oct 24, 2023"
                title="Sony WH-1000XM5 Wireless Noise Canceling Headphones"
                platform1="Shopee"
                platform2="Lazada"
                priceDiff="₱ 1,250"
              />
              <ComparisonCard
                date="Saved Oct 15, 2023"
                title="Apple iPad Air (5th Generation) 64GB Wi-Fi"
                platform1="Lazada"
                platform2="Shopee"
                priceDiff="₱ 890"
              />
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <FavoritesCard
                date="Added Nov 2, 2023"
                title="Nintendo Switch OLED Model"
                platform="Shopee"
                price="₱ 14,990"
              />
              <FavoritesCard
                date="Added Oct 30, 2023"
                title="Logitech MX Master 3S Wireless Mouse"
                platform="Lazada"
                price="₱ 5,490"
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto p-4 md:px-8 py-6 mt-12 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
        <div className="flex items-center gap-4">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container font-headline text-base">
            SmartBudol
          </span>
          <span className="opacity-70">© 2024 SmartBudol. Finding the best value for savvy shoppers.</span>
        </div>
        <div className="flex gap-4 opacity-80">
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-primary transition-colors">Contact Us</Link>
          <Link href="#" className="hover:text-primary transition-colors">About</Link>
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------------------------------
// Static Components matching the wireframe design
// ----------------------------------------------------------------------

function ComparisonCard({ date, title, platform1, platform2, priceDiff }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-on-surface-variant font-medium">{date}</span>
        <button className="text-on-surface-variant hover:text-error transition-colors p-1" aria-label="Delete saved comparison">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
        </button>
      </div>
      
      <h3 className="font-semibold text-base leading-tight text-on-surface mb-3">
        {title}
      </h3>
      
      <div className="flex gap-2 mb-4">
        <PlatformBadge platform={platform1} />
        <PlatformBadge platform={platform2} />
      </div>

      <div className="flex justify-between items-center bg-surface-container-low rounded-lg p-3 mb-4">
        <span className="text-sm text-on-surface-variant">Price Diff.</span>
        <span className="text-sm font-bold text-primary">{priceDiff}</span>
      </div>

      <button className="w-full py-2.5 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary-container transition-colors flex items-center justify-center gap-2">
        View Comparison
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
      </button>
    </div>
  );
}

function FavoritesCard({ date, title, platform, price }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-on-surface-variant font-medium">{date}</span>
        <button className="text-on-surface-variant hover:text-error transition-colors p-1" aria-label="Remove from favorites">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
        </button>
      </div>
      
      <h3 className="font-semibold text-base leading-tight text-on-surface mb-3">
        {title}
      </h3>
      
      <div className="flex gap-2 mb-4">
        <PlatformBadge platform={platform} />
      </div>

      <div className="flex justify-between items-center bg-surface-container-low rounded-lg p-3 mb-4">
        <span className="text-sm text-on-surface-variant">Price</span>
        <span className="text-sm font-bold text-primary">{price}</span>
      </div>

      <button className="w-full py-2.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
        View Detail
      </button>
    </div>
  );
}

function PlatformBadge({ platform }) {
  const isShopee = platform.toLowerCase() === 'shopee';
  const isLazada = platform.toLowerCase() === 'lazada';
  
  let bgClass = 'bg-surface-container-high text-on-surface-variant';
  if (isShopee) bgClass = 'bg-[#EE4D2D] text-white';
  if (isLazada) bgClass = 'bg-[#F57224] text-white';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${bgClass}`}>
      {platform}
    </span>
  );
}
