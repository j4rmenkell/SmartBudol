'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  HiOutlineMail,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
} from 'react-icons/hi'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  function validate() {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validate()) return

    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/reset-password`,
    })

    setLoading(false)

    if (error) {
      setServerError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 bg-[#f7f9fb] relative overflow-hidden font-[family-name:var(--font-inter)]">

      <div className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#00694c]/[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full bg-[#263aff]/[0.03] blur-[100px]" />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_32px_rgba(0,0,0,0.06)]">

          {sent ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#86f8c9]/20 flex items-center justify-center mx-auto mb-5">
                <HiOutlineCheckCircle className="w-7 h-7 text-[#00694c]" />
              </div>
              <h1 className="text-[22px] font-bold text-[#191c1e] tracking-tight font-[family-name:var(--font-manrope)] mb-2">
                Check your email
              </h1>
              <p className="text-sm text-[#3d4943] leading-relaxed mb-1">
                We sent a password reset link to
              </p>
              <p className="text-sm font-semibold text-[#191c1e] mb-6">{email}</p>
              <p className="text-xs text-[#6d7a73] leading-relaxed mb-6">
                Didn&apos;t receive an email? Check your spam folder, or{' '}
                <button
                  onClick={() => { setSent(false); setEmail('') }}
                  className="text-[#00694c] font-medium hover:text-[#008560] underline underline-offset-2 transition-colors"
                >
                  try a different email
                </button>.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00694c] hover:text-[#008560] transition-colors"
              >
                <HiOutlineArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-8">
                <h1 className="text-[26px] font-bold text-[#191c1e] tracking-tight font-[family-name:var(--font-manrope)]">
                  Forgot password?
                </h1>
                <p className="text-[#3d4943] text-sm mt-1.5 leading-relaxed">
                  Enter the email linked to your account and we&apos;ll send you a reset link.
                </p>
              </div>

              {serverError && (
                <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-[#ffdad6]/60 border border-[#ba1a1a]/10">
                  <HiOutlineExclamationCircle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#93000a] leading-snug">{serverError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-[#191c1e] mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <HiOutlineMail className={`w-[18px] h-[18px] ${errors.email ? 'text-[#ba1a1a]' : 'text-[#6d7a73]'}`} />
                    </div>
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({}) }}
                      className={`w-full pl-10 pr-4 py-3 text-sm bg-white border rounded-lg text-[#191c1e] placeholder:text-[#bccac1] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                        errors.email
                          ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/20'
                          : 'border-[#bccac1]/40 focus:border-[#00694c] focus:ring-[#86f8c9]/30'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-[#ba1a1a]">{errors.email}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#00694c] to-[#008560] hover:shadow-[0_4px_16px_rgba(0,105,76,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-7 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#00694c] hover:text-[#008560] transition-colors"
                >
                  <HiOutlineArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
