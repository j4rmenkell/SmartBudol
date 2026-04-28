'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  /**
   * Handles the search form submission.
   * Navigates to the /products page with the search query as a URL parameter.
   * This keeps the actual API call on the products page, preserving credits.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Navigate to products with the search query
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] p-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
          SmartBudol
        </h1>
        <p className="text-lg text-slate-400">
          Find the best deals across multiple platforms. Search and compare
          instantly!
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full max-w-xl relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full p-4 pl-10 text-sm text-white border border-slate-700 rounded-full bg-slate-900/50 backdrop-blur-md focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-400 shadow-xl"
          placeholder="Search for an item..."
        />
        <button
          type="submit"
          className="text-white absolute right-2.5 bottom-2.5 bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-800 font-medium rounded-full text-sm px-4 py-2 transition-colors"
        >
          Search
        </button>
      </form>
    </main>
  );
}
