import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

// ── In-memory Rate Limiter ──────────────────────────────────────────
// Tracks timestamps of email-change requests per user.
// 5 requests per hour per user. Resets on server restart.
const rateLimitMap = new Map()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function isRateLimited(userId) {
  const now = Date.now()
  const timestamps = rateLimitMap.get(userId) || []
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS)

  if (recent.length >= RATE_LIMIT) {
    return true
  }

  recent.push(now)
  rateLimitMap.set(userId, recent)
  return false
}

// ═══════════════════════════════════════════════════════════════════
// POST /api/change-email
// ═══════════════════════════════════════════════════════════════════
// This route handles:
//   1. Password re-authentication
//   2. Rate limiting
//   3. Security notification to old email (via Resend)
//
// It does NOT call supabase.auth.updateUser() — that must happen
// client-side so the PKCE code_verifier cookie is stored in the
// user's browser. The client calls updateUser after this route
// returns { verified: true }.
export async function POST(request) {
  try {
    const body = await request.json()
    const { newEmail, currentPassword } = body

    // ── Input validation ──
    if (!newEmail || !currentPassword) {
      return NextResponse.json(
        { error: 'New email and current password are required.' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // ── Authentication check ──
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to change your email.' },
        { status: 401 }
      )
    }

    const oldEmail = user.email

    // ── Same-email check ──
    if (newEmail.trim().toLowerCase() === oldEmail.toLowerCase()) {
      return NextResponse.json(
        { error: 'The new email is the same as your current email.' },
        { status: 400 }
      )
    }

    // ── Rate limiting ──
    if (isRateLimited(user.id)) {
      return NextResponse.json(
        { error: 'Too many email change requests. Please try again in an hour.' },
        { status: 429 }
      )
    }

    // ── Password verification (re-authentication) ──
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: oldEmail,
      password: currentPassword,
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'The password you entered is incorrect.' },
        { status: 403 }
      )
    }

    // ── Send security notification to old email via Resend SDK ──
    // This is a security alert, separate from the Supabase confirmation email.
    try {
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'SmartBudol <noreply@j4rmen.me>',
          to: oldEmail,
          subject: 'SmartBudol — Email Change Requested',
          html: `
            <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="font-family: 'Manrope', sans-serif; color: #00694c; font-size: 20px; margin: 0;">SmartBudol</h1>
              </div>
              <div style="background: #ffffff; border: 1px solid rgba(188,202,193,0.3); border-radius: 12px; padding: 24px;">
                <h2 style="color: #191c1e; font-size: 18px; margin: 0 0 12px;">Email Change Requested</h2>
                <p style="color: #3d4943; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
                  A request was made to change the email address associated with your SmartBudol account
                  from <strong>${oldEmail}</strong> to a new address.
                </p>
                <p style="color: #3d4943; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
                  If you made this request, no further action is needed on this email.
                  The change will take effect once the new email address is confirmed.
                </p>
                <div style="background: #ffdad6; border: 1px solid rgba(186,26,26,0.15); border-radius: 8px; padding: 12px 16px; margin: 16px 0;">
                  <p style="color: #93000a; font-size: 13px; margin: 0;">
                    <strong>Didn't request this?</strong> If you did not initiate this change,
                    please secure your account immediately by changing your password.
                  </p>
                </div>
              </div>
              <p style="color: #6d7a73; font-size: 12px; text-align: center; margin: 24px 0 0;">
                &copy; 2024 SmartBudol. Finding the best value for savvy shoppers.
              </p>
            </div>
          `,
        })
      }
    } catch (emailError) {
      // Log but don't fail — the password was already verified
      console.error(
        '[change-email] Failed to send notification to old email:',
        emailError.message
      )
    }

    // ── Return success — client will now call updateUser() ──
    return NextResponse.json({
      verified: true,
      message: 'Password verified. Initiating email change...',
    })
  } catch (error) {
    console.error('[change-email] Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
