import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Auth Callback Route
 * ===================
 *
 * Handles Supabase email-link flows:
 *
 *   1. PKCE code flow  — ?code=<code>&next=<path>
 *      Used for signup confirmation and password reset when
 *      emailRedirectTo / redirectTo is set.
 *      → calls exchangeCodeForSession(code)
 *
 *   2. Token hash flow — ?token_hash=<hash>&type=<type>&next=<path>
 *      Supabase may also send this format depending on auth settings.
 *      → calls verifyOtp({ token_hash, type })
 *
 * The optional `next` parameter controls where the user lands after success.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)

  const code      = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type      = searchParams.get('type')   // 'signup' | 'recovery' | 'email'
  const next      = searchParams.get('next') ?? '/home'

  const supabase = await createClient()

  // ── Flow 1: PKCE code exchange ──
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('[auth/callback] exchangeCodeForSession error:', error.message)
  }

  // ── Flow 2: Token hash (OTP) exchange ──
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('[auth/callback] verifyOtp error:', error.message)
  }

  // Both flows failed — redirect to login with an error message
  return NextResponse.redirect(`${origin}/login?error=Could not verify link`)
}