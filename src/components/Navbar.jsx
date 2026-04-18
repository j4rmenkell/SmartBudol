import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
              SmartBudol
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-8">
            <Link href="#" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
              Categories
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
              Price Drops
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
              Deals
            </Link>
            <Link href="/products" className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
              Trending
            </Link>
          </div>

          {/* Right side Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none">
              <span className="sr-only">View notifications</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>

            <Link href="/account" className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none">
              <span className="sr-only">Account</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
