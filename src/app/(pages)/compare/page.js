export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Compare Products</h1>
          <p className="text-slate-400 mt-2">See side-by-side details to find the best deal.</p>
        </div>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm border border-slate-700 transition">
          Clear Comparison
        </button>
      </div>

      {/* Compare Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Item 1 */}
        <div className="bg-slate-900 border-2 border-emerald-500 rounded-2xl p-6 flex flex-col gap-4 relative">
          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-emerald-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Best Deal
          </div>
          <div className="aspect-video bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">Image</div>
          <h3 className="font-semibold text-lg text-slate-200">Headphones A</h3>
          <p className="text-2xl font-bold text-emerald-400">₱1,250.00</p>
          <hr className="border-slate-800" />
          <p className="flex justify-between text-sm text-slate-400"><span>Platform:</span> <span className="text-slate-200">Lazada</span></p>
          <p className="flex justify-between text-sm text-slate-400"><span>Rating:</span> <span className="text-slate-200">4.8 / 5</span></p>
          <p className="flex justify-between text-sm text-slate-400"><span>Shipping:</span> <span className="text-slate-200">Free</span></p>
        </div>

        {/* Item 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
          <div className="aspect-video bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">Image</div>
          <h3 className="font-semibold text-lg text-slate-200">Headphones B</h3>
          <p className="text-2xl font-bold text-slate-300">₱1,400.00</p>
          <hr className="border-slate-800" />
          <p className="flex justify-between text-sm text-slate-400"><span>Platform:</span> <span className="text-slate-200">Shopee</span></p>
          <p className="flex justify-between text-sm text-slate-400"><span>Rating:</span> <span className="text-slate-200">4.5 / 5</span></p>
          <p className="flex justify-between text-sm text-slate-400"><span>Shipping:</span> <span className="text-slate-200">₱50.00</span></p>
        </div>

        {/* Empty Slot for Comparison */}
        <div className="border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-colors cursor-pointer min-h-[300px]">
          <span className="text-4xl text-slate-600">+</span>
          <p>Add item to compare</p>
        </div>

      </div>
    </div>
  );
}
