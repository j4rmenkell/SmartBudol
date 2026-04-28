'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineBell, HiOutlineUser } from 'react-icons/hi2';
import { HiOutlineLogout } from 'react-icons/hi';
import Logout from '@/components/Logout';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function Navbar() {
  const pathname = usePathname();

  // Hide the main navbar on the landing page and authentication pages
  if (pathname === '/' || AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return null;
  }

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
          <div className="flex items-center space-x-5">
            <button className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none">
              <span className="sr-only">View notifications</span>
              <HiOutlineBell className="h-5 w-5" />
            </button>

            <Link href="/account" className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none">
              <span className="sr-only">Account</span>
              <HiOutlineUser className="h-5 w-5" />
            </Link>

            {/* Logout Button — uses the reusable Logout component with an icon */}
            <Logout
              className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors focus:outline-none cursor-pointer"
              label={
                <>
                  <HiOutlineLogout className="h-5 w-5" />
                  <span className="hidden md:inline text-sm font-medium">Log Out</span>
                </>
              }
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
