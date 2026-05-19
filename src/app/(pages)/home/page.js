'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { Loader2, Star, MapPin } from 'lucide-react'; 

/* ─────────────────────────────────────────────
   SmartBudol — Home Page
   - Unified Emerald color palette
   - Upgraded typography to 'Inter' 
   - Layout: Hero -> How it works -> 3D Preview
   - Search & Tags trigger live scraping before redirect
   - Product Preview Cards matched to ProductBrowser style
───────────────────────────────────────────── */

const TRENDING = ['earphones', 'sneakers', 'phone cases'];

// Updated to match the data structure expected by the ProductBrowser cards
const PREVIEW_PRODUCTS = [
    {
        id: 'preview-1',
        name: 'SoundCore Liberty 4 NC Noise Cancelling Earbuds',
        platform: 'Shopee',
        price: 3499,
        original_price: 4500,
        discount_percentage: 22,
        rating: 4.8,
        reviews_count: 11200,
        location: 'Metro Manila',
        sales_volume: 15400,
        img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
    },
    {
        id: 'preview-2',
        name: 'SoundCore Liberty 4 NC Active Noise Cancelling',
        platform: 'Lazada',
        price: 3850,
        original_price: 4500,
        discount_percentage: 14,
        rating: 4.9,
        reviews_count: 898,
        location: 'Cebu',
        sales_volume: 2100,
        img: 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=400&q=80',
    },
    {
        id: 'preview-3',
        name: 'SoundCore Liberty 4 NC Ultra Noise Reduction',
        platform: 'Shopee',
        price: 4100,
        original_price: 4500,
        discount_percentage: 9,
        rating: 4.2,
        reviews_count: 42,
        location: 'Overseas',
        sales_volume: 150,
        img: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=400&q=80',
    },
];

export default function HomePage() {
    const [query, setQuery] = useState('');
    const [isScraping, setIsScraping] = useState(false);
    const [activeSearch, setActiveSearch] = useState('');
    const router = useRouter();

    const runSearchAndRedirect = async (term) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        
        setActiveSearch(trimmed);
        setIsScraping(true);

        try {
            await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ searchQuery: trimmed })
            });
        } catch (error) {
            console.error("Scrape failed:", error);
        } finally {
            router.push(`/products?q=${encodeURIComponent(trimmed)}`);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        runSearchAndRedirect(query);
    };

    const handleTag = (tag) => {
        setQuery(tag);
        runSearchAndRedirect(tag);
    };

    return (
        <div className="home-wrapper">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .home-wrapper {
          --bg:            #FFFFFF;
          --surface:       #FFFFFF;
          --border:        #E5E7EB;
          --emerald:       #10B981;
          --emerald-dark:  #047857;
          --emerald-light: #ECFDF5;
          --text-1:        #111827;
          --text-2:        #4B5563;
          --text-3:        #6B7280;
          --text-4:        #9CA3AF;
          --r-card:        8px;
          --shadow-sm:     0 1px 2px rgba(0,0,0,.05);
          --shadow-md:     0 4px 6px -1px rgba(0,0,0,.05), 0 2px 4px -1px rgba(0,0,0,.03);
          
          font-family: 'Inter', system-ui, sans-serif;
          background: var(--bg);
          color: var(--text-1);
          min-height: 100vh;
        }

        /* ── Header Section ── */
        .header-section {
          padding: 80px 20px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .header-h1 {
          font-size: clamp(36px, 5vw, 48px);
          font-weight: 700; 
          color: var(--text-1);
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }
        .header-sub {
          font-size: clamp(16px, 2vw, 18px);
          font-weight: 400;
          color: var(--text-2);
          max-width: 540px;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        /* ── Search Bar ── */
        .sb-form { 
          width: 100%; 
          max-width: 640px; 
          position: relative; 
          margin-bottom: 24px;
        }
        .sb-input {
          width: 100%;
          padding: 16px 120px 16px 48px;
          border: 1px solid var(--border);
          border-radius: var(--r-card);
          background: var(--surface);
          font-family: inherit;
          font-size: 16px; 
          color: var(--text-1);
          outline: none;
          box-shadow: var(--shadow-sm);
          transition: border-color .2s, box-shadow .2s;
        }
        .sb-input::placeholder { color: var(--text-4); font-weight: 400; }
        .sb-input:focus {
          border-color: var(--emerald-dark);
          box-shadow: 0 0 0 3px rgba(4,120,87,.1), var(--shadow-sm);
        }
        .sb-input:disabled {
          background-color: #F9FAFB;
          color: var(--text-4);
          cursor: not-allowed;
        }
        .sb-input::-webkit-search-cancel-button { display: none; }
        
        .sb-icon {
          position: absolute; left: 18px; top: 50%;
          transform: translateY(-50%);
          color: var(--text-4); pointer-events: none;
          display: flex; align-items: center;
        }
        
        .sb-btn {
          position: absolute; right: 8px; top: 50%;
          transform: translateY(-50%);
          background: var(--emerald-dark); color: #fff;
          border: none; border-radius: 6px;
          padding: 10px 24px; font-family: inherit;
          font-size: 14px; font-weight: 500; cursor: pointer;
          transition: background .15s ease;
        }
        .sb-btn:hover:not(:disabled) { background: #065f46; }
        .sb-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* ── Tag chips ── */
        .tags-row {
          display: flex; align-items: center; gap: 10px;
          flex-wrap: wrap; justify-content: center;
        }
        .tag-lbl {
          font-size: 14px; color: var(--text-2); font-weight: 500;
        }
        .tag-chip {
          padding: 6px 16px; border-radius: 99px;
          background: transparent; border: 1px solid var(--border);
          font-size: 13px; font-weight: 500; color: var(--text-2);
          cursor: pointer; transition: all .15s ease;
          font-family: inherit;
        }
        .tag-chip:hover {
          border-color: var(--text-3);
          color: var(--text-1);
          background: #F9FAFB;
        }

        /* ── How it works ── */
        .how-section {
          max-width: 1040px; margin: 0 auto;
          padding: 60px clamp(16px, 4vw, 40px) 80px;
          text-align: center;
        }
        .how-h2 {
          font-size: clamp(24px, 3vw, 28px);
          font-weight: 600; 
          color: var(--text-1); 
          letter-spacing: -0.02em;
          margin-bottom: 48px;
        }
        .how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .how-card {
          background: var(--surface); 
          border: 1px solid var(--border);
          border-radius: var(--r-card); 
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .how-card:hover {
          border-color: #D1D5DB;
          box-shadow: var(--shadow-md);
        }
        .how-icon {
          width: 56px; height: 56px; 
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          background-color: var(--emerald-light);
          color: var(--emerald-dark);
        }
        .how-step {
          font-size: 18px; font-weight: 600; color: var(--text-1);
          margin-bottom: 12px; letter-spacing: -0.01em;
        }
        .how-desc { 
          font-size: 14px; font-weight: 400; color: var(--text-2); 
          line-height: 1.6; margin: 0; 
        }

        /* ── Preview Wrapper ── */
        .preview-wrap {
          width: 100%; max-width: 1000px; background: #fff;
          border-radius: 12px; overflow: hidden;
          display: flex; flex-direction: column;
          border: 1px solid var(--border);
        }

        /* specs table */
        .specs-wrap {
          padding: 0 20px 20px; text-align: left;
        }
        .specs-box {
          border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;
        }
        .specs-head {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; background: #FAFAFA;
          border-bottom: 1px solid #E5E7EB;
          font-size: 13px; font-weight: 600; color: var(--text-2);
        }
        .specs-table {
          width: 100%; border-collapse: collapse; font-size: 13px;
        }
        .specs-table th {
          padding: 10px 16px; text-align: left;
          color: var(--text-3); font-weight: 500;
          background: #F9FAFB; border-bottom: 1px solid #E5E7EB;
        }
        .specs-table td {
          padding: 12px 16px; border-bottom: 1px solid #F3F4F6;
        }
        .specs-table tr:last-child td { border-bottom: none; }
        .specs-table tr:nth-child(even) td { background: #FAFAFA; }

        /* ── Footer ── */
        .sb-footer {
          border-top: 1px solid var(--border);
          padding: 24px clamp(16px, 4vw, 56px);
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 16px;
          background: var(--surface);
        }
        .sb-footer-brand {
          font-size: 16px; font-weight: 600;
          color: var(--emerald-dark); letter-spacing: -0.02em;
        }
        .sb-footer-copy { font-size: 14px; color: var(--text-3); }
        .sb-footer-left { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .sb-footer-links { display: flex; gap: 24px; list-style: none; margin: 0; padding: 0; }
        .sb-footer-links a {
          font-size: 14px; color: var(--text-3); text-decoration: none; font-weight: 500;
          transition: color .15s;
        }
        .sb-footer-links a:hover { color: var(--text-1); }

        /* ── Responsive adjustments ── */
        @media (max-width: 768px) {
          .how-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .sb-footer { flex-direction: column; text-align: center; }
          .sb-footer-links { justify-content: center; flex-wrap: wrap; }
          .sb-footer-left { justify-content: center; }
        }
      `}</style>

            {/* 1. Header & Search Section */}
            <section className="header-section">
                <h1 className="header-h1">Shop smart, compare everything</h1>
                <p className="header-sub">
                    Search across Lazada and Shopee — all in one place.
                    Find the best value instantly.
                </p>

                {/* Search Form */}
                <form className="sb-form" onSubmit={handleSearch}>
                    <span className="sb-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </span>
                    <input
                        type="search"
                        className="sb-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Paste a link or search for a product..."
                        aria-label="Search for a product"
                        disabled={isScraping}
                    />
                    <button type="submit" className="sb-btn" disabled={isScraping}>
                        {isScraping ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {/* APIFY LOADING NOTIFICATION */}
                {isScraping && (
                    <div className="mb-6 p-4 bg-[#ECFDF5] text-[#047857] rounded-lg flex items-center justify-center gap-3 border border-[#10B981] shadow-sm w-full max-w-[640px]">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <p className="text-sm font-medium text-left m-0">
                            Deploying Apify scrapers for &quot;<strong>{activeSearch}</strong>&quot;... <br/>
                            <span className="text-xs text-[#047857]/80 font-normal">This usually takes 30-60 seconds. Do not refresh.</span>
                        </p>
                    </div>
                )}

                {/* Trending Tags (Hide when scraping) */}
                {!isScraping && (
                    <div className="tags-row">
                        <span className="tag-lbl">Popular:</span>
                        {TRENDING.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                className="tag-chip"
                                onClick={() => handleTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {/* 2. How it works Section */}
            <section className="how-section" id="how">
                <h2 className="how-h2">How it works</h2>
                <div className="how-grid">
                    {[
                        {
                            icon: (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    <path d="M9 11l2 2 4-4"></path>
                                </svg>
                            ),
                            step: '1. Search',
                            desc: 'Paste a product link or search directly. We instantly scan both platforms.',
                        },
                        {
                            icon: (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 3l4 4-4 4"></path>
                                    <path d="M20 7H4"></path>
                                    <path d="M8 21l-4-4 4-4"></path>
                                    <path d="M4 17h16"></path>
                                </svg>
                            ),
                            step: '2. Compare',
                            desc: 'View side-by-side prices, shipping fees, and real reviews in one clean interface.',
                        },
                        {
                            icon: (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.5-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V6c0-.5-.5-1-1-1z"></path>
                                    <path d="M2 9v1c0 1.1.9 2 2 2h1"></path>
                                    <path d="M16 11h.01"></path>
                                </svg>
                            ),
                            step: '3. Save',
                            desc: 'Make the smart choice. Click through to buy with confidence knowing you got the best deal.',
                        }
                    ].map((item) => (
                        <div key={item.step} className="how-card">
                            <div className="how-icon">
                                {item.icon}
                            </div>
                            <h3 className="how-step">{item.step}</h3>
                            <p className="how-desc">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. 3D Scroll Hero Section (Product Preview) */}
            <div className="flex flex-col overflow-hidden pb-[100px] pt-[20px]">
                <ContainerScroll
                    titleComponent={
                        <div className="mb-12">
                            <h2 className="text-3xl font-semibold text-[#111827] tracking-tight">
                                See it in action
                            </h2>
                        </div>
                    }
                >
                    <div className="preview-wrap mx-auto mt-0 h-full">
                        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 text-[13px] text-gray-500 font-medium text-left">
                            Comparing results for <strong>wireless earphones</strong>
                        </div>

                        {/* NEW PRODUCT GRID MATCHING ProductBrowser.jsx */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 text-left">
                            {PREVIEW_PRODUCTS.map((product) => (
                                <div key={product.id} className="flex flex-col overflow-hidden group hover:shadow-md transition-all relative border border-gray-200 rounded-lg bg-white">
                                    
                                    {/* Discount Badge */}
                                    {product.discount_percentage > 0 && (
                                        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm">
                                            -{product.discount_percentage}%
                                        </div>
                                    )}

                                    {/* Image */}
                                    <div className="relative aspect-square w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                                        <img 
                                            src={product.img} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            draggable={false}
                                        />
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-4 flex-grow flex flex-col">
                                        <div className="mb-2 flex justify-between items-start">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                                                product.platform.toLowerCase() === 'shopee' 
                                                ? 'bg-orange-100 text-orange-700' 
                                                : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {product.platform}
                                            </span>
                                            
                                            {/* Rating & Reviews */}
                                            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                                <span className="text-amber-600 font-bold">{product.rating}</span>
                                                <span className="text-slate-400">({product.reviews_count.toLocaleString()})</span>
                                            </div>
                                        </div>

                                        <h2 className="text-sm font-medium line-clamp-2 mb-2 leading-snug text-slate-900">
                                            {product.name}
                                        </h2>
                                        
                                        <div className="mt-auto">
                                            <div className="flex items-end gap-2 mb-2">
                                                <span className="text-xl font-bold text-slate-900">₱{product.price.toLocaleString()}</span>
                                                <span className="text-xs text-slate-400 line-through mb-1">
                                                    ₱{product.original_price.toLocaleString()}
                                                </span>
                                            </div>
                                            
                                            {/* Location & Sales Data */}
                                            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 min-h-[16px]">
                                                <span className="line-clamp-1 truncate max-w-[60%] flex items-center">
                                                    <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                                                    {product.location}
                                                </span>
                                                <span>{product.sales_volume.toLocaleString()} sold</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer / Button */}
                                    <div className="p-4 pt-0 flex gap-2">
                                        <button 
                                            className="flex-1 h-10 bg-[#00694c] text-white hover:bg-[#008560] transition-colors rounded-md text-sm font-medium"
                                            onClick={() => router.push('/products')}
                                        >
                                            View Product Page
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Specs table */}
                        <div className="specs-wrap">
                            <div className="specs-box">
                                <div className="specs-head">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 11l3 3L22 4" />
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                    </svg>
                                    Specifications Comparison
                                </div>
                                <table className="specs-table">
                                    <thead>
                                        <tr>
                                            {['Criteria', 'Shopee Option', 'Lazada Option', 'Temu Option'].map((h) => (
                                                <th key={h}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ['Price', '₱3,499', '₱3,850', '₱4,100'],
                                            ['Rating', '4.8/5.0 (11.2k)', '4.9/5.0 (898)', '4.2/5.0 (42)'],
                                            ['Shipping', 'Free (3–5 days)', 'Free (2–4 days)', '₱150 (10–14 days)'],
                                            ['Seller', 'Anker Official Store', 'LazMall Gadgets', 'Global Tech Hub'],
                                        ].map(([crit, ...vals]) => (
                                            <tr key={crit}>
                                                <td style={{ color: 'var(--text-3)', fontWeight: 500 }}>{crit}</td>
                                                {vals.map((v, vi) => (
                                                    <td key={vi} style={{ color: vi === 0 ? '#047857' : 'var(--text-1)', fontWeight: vi === 0 ? 600 : 400 }}>
                                                        {v}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </ContainerScroll>
            </div>

            {/* 4. Footer */}
            <footer className="sb-footer">
                <div className="sb-footer-left">
                    <div className="sb-footer-brand">SmartBudol</div>
                    <div className="sb-footer-copy">
                        © 2024 SmartBudol. Finding the best value for savvy shoppers.
                    </div>
                </div>
                <ul className="sb-footer-links">
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">About</a></li>
                </ul>
            </footer>
        </div>
    );
}
