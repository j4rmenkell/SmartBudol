'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { Loader2 } from 'lucide-react'; // Added for the loading spinner

/* ─────────────────────────────────────────────
   SmartBudol — Home Page
   - Unified Emerald color palette
   - Upgraded typography to 'Inter' 
   - Layout: Hero -> How it works -> 3D Preview
   - Preview buttons redirect to /products
   - Search & Tags now trigger live scraping before redirect
───────────────────────────────────────────── */

const TRENDING = ['earphones', 'sneakers', 'phone cases'];

const PREVIEW_PRODUCTS = [
    {
        name: 'SoundCore Liberty 4 NC Noise Cancelling Earbuds',
        badge: 'Best deal',
        badgeColor: '#047857',
        shopee: '₱3,499',
        lazada: '₱3,850',
        best: 'shopee',
        img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
    },
    {
        name: 'SoundCore Liberty 4 NC Active Noise Cancelling',
        badge: 'Lazada',
        badgeColor: '#1d4ed8',
        shopee: '₱3,850',
        lazada: '₱3,850',
        best: 'lazada',
        img: 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=400&q=80',
    },
    {
        name: 'SoundCore Liberty 4 NC Ultra Noise Reduction',
        badge: 'Temu',
        badgeColor: '#dc2626',
        shopee: '₱4,100',
        lazada: '₱4,100',
        best: 'shopee',
        img: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=400&q=80',
    },
];

export default function HomePage() {
    const [query, setQuery] = useState('');
    const [isScraping, setIsScraping] = useState(false);
    const [activeSearch, setActiveSearch] = useState('');
    const router = useRouter();

    // The new function that runs the scrape, then redirects
    const runSearchAndRedirect = async (term) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        
        setActiveSearch(trimmed);
        setIsScraping(true);

        try {
            // Run the Apify scraping logic in the background
            await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ searchQuery: trimmed })
            });
        } catch (error) {
            console.error("Scrape failed:", error);
        } finally {
            // Once scraped (or if it fails), redirect to display the products
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

        /* ── Preview card (Inside 3D Scroll) ── */
        .preview-wrap {
          width: 100%; max-width: 1000px; background: #fff;
          border-radius: 12px; overflow: hidden;
          display: flex; flex-direction: column;
          border: 1px solid var(--border);
        }
        .prev-topbar {
          padding: 14px 20px; border-bottom: 1px solid #f0f0f0;
          background: #FAFAFA; flex-shrink: 0;
          font-size: 13px; color: var(--text-3); font-weight: 500;
          text-align: left;
        }
        .prev-topbar strong { color: var(--text-1); font-weight: 600;}
        .prev-grid {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 12px; padding: 20px; text-align: left;
        }
        .prev-pcard {
          border: 1px solid #E5E7EB; border-radius: 8px;
          overflow: hidden; background: #fff;
          display: flex; flex-direction: column;
        }
        .prev-img {
          width: 100%; aspect-ratio: 1/1;
          object-fit: cover; display: block; background: #f3f4f6;
        }
        .prev-body { padding: 12px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .prev-badge {
          display: inline-block; font-size: 11px; font-weight: 600;
          padding: 4px 8px; border-radius: 4px; color: #fff; width: fit-content;
        }
        .prev-name {
          font-size: 13px; font-weight: 500; color: var(--text-1);
          line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          margin: 0;
        }
        .prev-prices { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; }
        .prev-prow {
          display: flex; justify-content: space-between;
          font-size: 12px;
        }
        .prev-plat { color: var(--text-3); }
        .prev-val { font-weight: 600; color: var(--text-1); }
        .prev-val.best { color: var(--emerald-dark); }
        .prev-go {
          width: 100%; padding: 8px; margin-top: auto;
          background: var(--emerald-dark); color: #fff; border: none;
          border-radius: 6px; font-size: 13px; font-weight: 500;
          cursor: pointer; font-family: inherit;
          transition: background .15s ease;
        }
        .prev-go:hover {
          background: #065f46;
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
          .prev-grid { grid-template-columns: 1fr 1fr; }
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
                            Deploying Apify scrapers for &quot;{activeSearch}&quot;... <br/>
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

            {/* 2. 3D Scroll Hero Section (Product Preview) */}
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
                    {/* Product comparison preview card (Inside the 3D scroll) */}
                    <div className="preview-wrap mx-auto mt-0 h-full">
                        <div className="prev-topbar">
                            Comparing results for <strong>wireless earphones</strong>
                        </div>

                        <div className="prev-grid">
                            {PREVIEW_PRODUCTS.map((p, i) => (
                                <div key={i} className="prev-pcard">
                                    <img src={p.img} alt={p.name} className="prev-img" draggable={false} />
                                    <div className="prev-body">
                                        <span className="prev-badge" style={{ background: p.badgeColor }}>{p.badge}</span>
                                        <p className="prev-name">{p.name}</p>
                                        <div className="prev-prices">
                                            <div className="prev-prow">
                                                <span className="prev-plat">Shopee</span>
                                                <span className={`prev-val${p.best === 'shopee' ? ' best' : ''}`}>{p.shopee}</span>
                                            </div>
                                            <div className="prev-prow">
                                                <span className="prev-plat">Lazada</span>
                                                <span className={`prev-val${p.best === 'lazada' ? ' best' : ''}`}>{p.lazada}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="prev-go"
                                            onClick={() => router.push('/products')}
                                        >
                                            Go to products →
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

            {/* 3. Footer */}
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
