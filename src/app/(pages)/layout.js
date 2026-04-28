'use client';

/**
 * Protected Pages Layout
 * ======================
 *
 * Client-side auth guard for all routes inside the (pages) group.
 * This acts as the FINAL safety net — if the proxy-level redirect somehow
 * doesn't fire (e.g. bfcache, prefetch, or SPA client-side navigation),
 * this layout will detect the missing session and kick the user to /login.
 *
 * LAYERS OF PROTECTION (defense in depth):
 *   1. Proxy (src/proxy.js)    — server-side redirect before page renders
 *   2. Cache-Control headers   — prevents browser from caching protected pages
 *   3. THIS layout             — client-side listener for auth state changes
 */

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase browser client instance (safe for client-side use).
 */
function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default function ProtectedPagesLayout({ children }) {
  const [isAuthed, setIsAuthed] = useState(null); // null = loading

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    // 1. Check session on mount (catches stale bfcache pages)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // No session → redirect to login immediately
        window.location.replace('/login');
      } else {
        setIsAuthed(true);
      }
    });

    // 2. Subscribe to auth state changes (catches logout from another tab)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.location.replace('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // While checking auth, show nothing (prevents flash of protected content)
  if (isAuthed === null) {
    return null;
  }

  return <>{children}</>;
}
