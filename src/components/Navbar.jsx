'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export default function Navbar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState('');

  /**
   * Extracts the display name from a Supabase user object.
   * Priority: full_name metadata → email prefix → "Profile"
   */
  const extractDisplayName = useCallback((user) => {
    if (!user) return '';
    const fullName = user.user_metadata?.full_name;
    if (fullName) return fullName;
    return user.email?.split('@')[0] || 'Profile';
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Initial fetch
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserName(extractDisplayName(user));
    }
    fetchUser();

    // Subscribe to auth state changes — this fires when the session
    // is refreshed after updateUser(), keeping the Navbar name in sync.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserName(extractDisplayName(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, [extractDisplayName]);

  // Hide the main navbar on the landing page and authentication pages
  if (pathname === '/' || AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return null;
  }

  // Helper for active link styling
  const isActive = (path) => pathname === path;

  // Get user initial for the avatar badge
  const userInitial = userName ? userName.charAt(0).toUpperCase() : '?';

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
            <Link 
              href="/account" 
              className="flex items-center gap-2.5 text-sm font-medium text-on-surface hover:text-primary transition-colors focus:outline-none group"
              aria-label="Go to account page"
            >
              {/* Avatar circle */}
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center text-xs font-bold shadow-sm group-hover:shadow-md transition-shadow">
                {userInitial}
              </span>
              <span className="hidden sm:inline">
                {userName || 'Profile'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
