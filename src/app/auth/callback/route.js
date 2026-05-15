import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/home'

  const supabase = await createClient()

  // ── Flow 1: PKCE code exchange ──
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      if (type === 'email_change') {
        return NextResponse.redirect(`${origin}/account?email_updated=true`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
    // PASS THE REAL ERROR TO THE URL
    console.error('[auth/callback] PKCE error:', error.message)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  // ── Flow 2: Token hash (OTP) exchange ──
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (!error) {
      if (type === 'email_change') {
        return NextResponse.redirect(`${origin}/account?email_updated=true`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
    // PASS THE REAL ERROR TO THE URL
    console.error('[auth/callback] Token error:', error.message)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  return NextResponse.redirect(`${origin}/login?error=Invalid link format`)
}