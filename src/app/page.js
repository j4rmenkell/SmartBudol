import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] p-8 space-y-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
          SmartBudol
        </h1>
        <p className="text-lg text-slate-400">
          Find the best deals across multiple platforms. Search, compare, and
          save — all in one place.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/login"
          className="px-8 py-3 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-800 transition-colors text-center"
        >
          Log In
        </Link>
        <Link
          href="/register"
          className="px-8 py-3 text-sm font-semibold text-emerald-400 border border-emerald-600 rounded-full hover:bg-emerald-600/10 focus:ring-4 focus:outline-none focus:ring-emerald-800 transition-colors text-center"
        >
          Create Account
        </Link>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full mt-8">
        <div className="text-center space-y-2 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div className="text-3xl">🔍</div>
          <h3 className="text-sm font-semibold text-slate-200">Smart Search</h3>
          <p className="text-xs text-slate-400">
            Search products across multiple e-commerce platforms at once.
          </p>
        </div>
        <div className="text-center space-y-2 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div className="text-3xl">⚖️</div>
          <h3 className="text-sm font-semibold text-slate-200">Compare Prices</h3>
          <p className="text-xs text-slate-400">
            Side-by-side comparison to find the best value for your money.
          </p>
        </div>
        <div className="text-center space-y-2 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
          <div className="text-3xl">💰</div>
          <h3 className="text-sm font-semibold text-slate-200">Save More</h3>
          <p className="text-xs text-slate-400">
            Get notified about price drops and never miss a deal.
          </p>
        </div>
      </div>
    </main>
  );
}
