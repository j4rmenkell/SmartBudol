'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function Navbar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try to get full_name, fallback to the username part of the email
        const fullName = user.user_metadata?.full_name;
        if (fullName) {
          setUserName(fullName);
        } else {
          setUserName(user.email?.split('@')[0] || 'User');
        }
      }
    }
    fetchUser();
  }, []);

  // Hide the main navbar on the landing page and authentication pages
  if (pathname === '/' || AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return null;
  }

  // Helper for active link styling
  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/home" className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container font-headline">
              SmartBudol
            </Link>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-8">
            <Link 
              href="/home" 
              className={`text-sm font-medium transition-colors border-b-2 ${
                isActive('/home') 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-on-surface hover:text-primary hover:border-primary/50'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className={`text-sm font-medium transition-colors border-b-2 ${
                isActive('/products') 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-on-surface hover:text-primary hover:border-primary/50'
              }`}
            >
              Products
            </Link>
            <Link 
              href="/compare" 
              className={`text-sm font-medium transition-colors border-b-2 ${
                isActive('/compare') 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-on-surface hover:text-primary hover:border-primary/50'
              }`}
            >
              Compare
            </Link>
          </div>

          {/* Right side - User Account Button */}
          <div className="flex items-center">
            {userName ? (
              <Link 
                href="/account" 
                className="text-sm font-medium text-on-surface hover:text-primary transition-colors focus:outline-none"
              >
                {userName}
              </Link>
            ) : (
              <Link 
                href="/account" 
                className="text-sm font-medium text-on-surface hover:text-primary transition-colors focus:outline-none"
              >
                Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
