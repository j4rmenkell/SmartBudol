import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server';

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, // FIX 1: Changed to ANON_KEY
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  // Check if the user is trying to access auth pages (public when logged out)
  const isAuthRoute = 
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/forgot-password') ||
    request.nextUrl.pathname.startsWith('/reset-password')

  // Routes inside the (pages) group — only accessible when logged in
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/home') ||
    request.nextUrl.pathname.startsWith('/account') || 
    request.nextUrl.pathname.startsWith('/compare') ||
    request.nextUrl.pathname.startsWith('/products')

  // Check if the user is on the public landing page
  const isLandingPage = request.nextUrl.pathname === '/'

  // If a logged-in user hits the landing page or an auth page, send them to /home
  if (user && (isAuthRoute || isLandingPage)) {
    const url = request.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  // If a logged-out user tries to access a protected page, kick them to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login' // Changed from '/auth/login' to match your route group
    return NextResponse.redirect(url);
  }

  // Prevent the browser from caching protected and auth pages.
  // This is critical for the back-button problem: without this header,
  // the browser serves a cached (stale) version of the page when the
  // user presses "Back" after logging out, making it look like they're
  // still signed in.
  if (isProtectedRoute || isAuthRoute) {
    supabaseResponse.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    supabaseResponse.headers.set('Pragma', 'no-cache');
    supabaseResponse.headers.set('Expires', '0');
  }

  return supabaseResponse
}