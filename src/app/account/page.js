export default function AccountPage() {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8 pt-12">
      <div className="flex items-center gap-6 border-b border-slate-800 pb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-emerald-900/20">
          JD
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">John Doe</h1>
          <p className="text-slate-400">john.doe@example.com</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Saved Items */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
            <span>❤️</span> Saved Favorites
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-md"></div>
                <div>
                  <p className="text-slate-200 font-medium">Headphones A</p>
                  <p className="text-xs text-slate-400">Lazada</p>
                </div>
              </div>
              <p className="text-emerald-400 font-bold">₱1,250</p>
            </div>
          </div>
        </div>

        {/* Saved Comparisons */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
            <span>📊</span> Saved Comparisons
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer">
              <h3 className="font-semibold text-slate-200">Budget Headphones Faceoff</h3>
              <p className="text-sm text-slate-400 mt-1">3 items compared • Last updated 2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
