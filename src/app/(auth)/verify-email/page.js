'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  HiOutlineMail,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineArrowLeft,
  HiOutlineRefresh,
} from 'react-icons/hi'

export default function VerifyEmail() {
  const [email, setEmail] = useState('')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  // Retrieve the user's email from the current session
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmail(user.email)
      }
    })
  }, [])

  const handleResend = async () => {
    setResending(true)
    setError('')
    setResent(false)

    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?next=/home`,
      },
    })

    setResending(false)

    if (resendError) {
      setError(resendError.message)
    } else {
      setResent(true)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 bg-[#f7f9fb] relative overflow-hidden font-[family-name:var(--font-inter)]">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#00694c]/[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full bg-[#263aff]/[0.03] blur-[100px]" />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_32px_rgba(0,0,0,0.06)]">

          {/* Icon */}
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#86f8c9]/20 flex items-center justify-center mx-auto mb-5">
              <HiOutlineMail className="w-7 h-7 text-[#00694c]" />
            </div>
            <h1 className="text-[22px] font-bold text-[#191c1e] tracking-tight font-[family-name:var(--font-manrope)] mb-2">
              Verify your email
            </h1>
            <p className="text-sm text-[#3d4943] leading-relaxed mb-1">
              We sent a verification link to
            </p>
            {email ? (
              <p className="text-sm font-semibold text-[#191c1e] mb-6">{email}</p>
            ) : (
              <p className="text-sm font-semibold text-[#191c1e] mb-6">your email address</p>
            )}

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-[#ffdad6]/60 border border-[#ba1a1a]/10 text-left">
                <HiOutlineExclamationCircle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                <p className="text-sm text-[#93000a] leading-snug">{error}</p>
              </div>
            )}

            {/* Resent confirmation */}
            {resent && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-[#86f8c9]/20 border border-[#00694c]/10 text-left">
                <HiOutlineCheckCircle className="w-5 h-5 text-[#00694c] shrink-0 mt-0.5" />
                <p className="text-sm text-[#00694c] leading-snug">Verification email resent!</p>
              </div>
            )}

            <p className="text-xs text-[#6d7a73] leading-relaxed mb-6">
              Didn&apos;t receive an email? Check your spam folder, or{' '}
              <button
                onClick={handleResend}
                disabled={resending || !email}
                className="text-[#00694c] font-medium hover:text-[#008560] underline underline-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {resending ? 'sending...' : 'resend verification email'}
              </button>.
            </p>

            {/* Back to login */}
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00694c] hover:text-[#008560] transition-colors"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
