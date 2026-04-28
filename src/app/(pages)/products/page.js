export default function ProductsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Search & Filters */}
      <section className="flex flex-col md:flex-row justify-between items-center bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm gap-4">
        <div className="w-full md:w-1/2">
          <input 
            type="search" 
            placeholder="Search products..." 
            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['Lazada', 'Shopee', 'Temu', 'Shein'].map(platform => (
            <button key={platform} className="px-4 py-2 bg-slate-800 hover:bg-emerald-600 transition-colors border border-slate-700 rounded-full text-sm text-slate-200">
              {platform}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-slate-100">Results</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Mock Product Card */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 hover:border-emerald-500/50 transition-colors group cursor-pointer">
              <div className="aspect-square bg-slate-800 rounded-xl w-full flex items-center justify-center text-slate-500">
                Image Placeholder
              </div>
              <div>
                <span className="text-xs font-semibold px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded-md">Lazada</span>
                <h3 className="font-semibold text-slate-200 mt-2 truncate">Wireless Headphones</h3>
                <p className="text-emerald-400 font-bold mt-1">₱1,250.00</p>
                <p className="text-xs text-slate-400">★ 4.8 (1.2k sold)</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
