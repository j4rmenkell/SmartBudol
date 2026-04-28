export default async function ProductDetailPage({ params }) {
  // In a real app, you would fetch data from Supabase here using params.id
  // const { data, error } = await supabase.from('products').select('*').eq('id', params.id).single();

  return (
    <div className="max-w-6xl mx-auto p-8 pt-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row gap-8 shadow-2xl">
        {/* Product Image */}
        <div className="w-full md:w-1/2 aspect-square bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 border border-slate-700">
          Main Product Image Placeholder
        </div>
        
        {/* Product Details */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="space-y-2">
            <span className="text-sm font-semibold px-3 py-1 bg-emerald-900/40 text-emerald-400 rounded-full border border-emerald-800/50">Lazada</span>
            <h1 className="text-3xl font-bold text-slate-100 mt-4">Wireless Noise-Cancelling Headphones</h1>
            <p className="text-4xl font-extrabold text-emerald-400">₱1,250.00</p>
          </div>
          
          <p className="text-slate-400 leading-relaxed">
            These mock headphones offer great sound quality and active noise cancellation. 
            Perfect for commuting, working out, or relaxing at home.
          </p>
          
          <div className="border-t border-slate-800 pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Key Features:</h3>
            <ul className="list-disc list-inside text-slate-400 space-y-2">
              <li>Bluetooth 5.3</li>
              <li>40-hour battery life</li>
              <li>Fast charging</li>
            </ul>
          </div>

          <div className="pt-6 flex gap-4">
            <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-900/20">
              Add to Compare
            </button>
            <button className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700">
              ❤️ Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
