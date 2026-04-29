import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server';

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

  // Use getUser() instead of getClaims() so we can check email_confirmed_at.
  // getClaims() returns claims for ANY signed-up user, even unverified ones,
  // which allowed unverified users to access protected routes.
  const { data: { user } } = await supabase.auth.getUser()

  // Always let the auth callback page through — it handles PKCE code exchange
  // on the client side where the code verifier cookie is available.
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return supabaseResponse
  }

  // Auth pages — public when logged out (login, register, forgot-password)
  const isAuthRoute = 
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register') ||
    request.nextUrl.pathname.startsWith('/forgot-password')


  // /reset-password is a special post-email-link page.
  // It must remain accessible to ANY authenticated user (verified or not)
  // so that clicking the password-reset email link works correctly.
  // Keeping it separate from isAuthRoute prevents the middleware from
  // bouncing verified users straight to /home.
  const isResetPasswordRoute = request.nextUrl.pathname.startsWith('/reset-password')

  // The verify-email page is a special auth page for unverified users
  const isVerifyEmailPage = request.nextUrl.pathname.startsWith('/verify-email')

  // Routes inside the (pages) group — only accessible when fully verified
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/home') ||
    request.nextUrl.pathname.startsWith('/account') || 
    request.nextUrl.pathname.startsWith('/compare') ||
    request.nextUrl.pathname.startsWith('/products')

  // Check if the user is on the public landing page
  const isLandingPage = request.nextUrl.pathname === '/'

  // Determine if the user's email is verified
  const isEmailVerified = user?.email_confirmed_at != null

  // ── VERIFIED user ──
  // If a fully verified user hits the landing page, standard auth pages, or
  // the verify-email page, send them straight to /home.
  // NOTE: /reset-password is intentionally excluded — a verified user clicking
  // their password-reset email must be allowed to reach that page.
  if (user && isEmailVerified && (isAuthRoute || isLandingPage || isVerifyEmailPage)) {
    const url = request.nextUrl.clone()
    url.pathname = '/home'
    return NextResponse.redirect(url)
  }

  // ── UNVERIFIED user ──
  // If a signed-up-but-unverified user tries to access a protected route
  // or the landing page, redirect them to /verify-email.
  if (user && !isEmailVerified && (isProtectedRoute || isLandingPage)) {
    const url = request.nextUrl.clone()
    url.pathname = '/verify-email'
    return NextResponse.redirect(url)
  }

  // ── NO session ──
  // If a logged-out user tries to access a protected page, kick them to login.
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url);
  }



  // If a logged-out user tries to access /reset-password directly (no session),
  // send them to forgot-password to request a new link.
  if (!user && isResetPasswordRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/forgot-password'
    return NextResponse.redirect(url)
  }

  // Prevent the browser from caching protected and auth pages.
  // This is critical for the back-button problem: without this header,
  // the browser serves a cached (stale) version of the page when the
  // user presses "Back" after logging out, making it look like they're
  // still signed in.
  if (isProtectedRoute || isAuthRoute || isVerifyEmailPage || isResetPasswordRoute) {
    supabaseResponse.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    supabaseResponse.headers.set('Pragma', 'no-cache');
    supabaseResponse.headers.set('Expires', '0');
  }

  return supabaseResponse
}
