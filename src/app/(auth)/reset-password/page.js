'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineArrowLeft,
} from 'react-icons/hi'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // Make sure the user has a valid session (from the reset link)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSessionReady(true)
      } else {
        // Listen for auth state change (the recovery event)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
            setSessionReady(true)
          }
        })
        return () => subscription?.unsubscribe()
      }
    }
    checkSession()
  }, [supabase.auth])

  function validate() {
    const newErrors = {}

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Include at least one uppercase letter'
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Include at least one lowercase letter'
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Include at least one number'
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password = 'Include at least one special character'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Password strength indicator
  function getPasswordStrength() {
    if (!password) return { level: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 1) return { level: 1, label: 'Weak', color: '#ba1a1a' }
    if (score === 2) return { level: 2, label: 'Fair', color: '#b62506' }
    if (score === 3) return { level: 3, label: 'Good', color: '#008560' }
    return { level: 4, label: 'Strong', color: '#00694c' }
  }

  const strength = getPasswordStrength()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validate()) return

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setServerError(error.message)
    } else {
      setSuccess(true)
    }
  }

  const clearFieldError = (field) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  // Not yet authenticated via reset link
  if (!sessionReady && !success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 bg-[#f7f9fb] font-[family-name:var(--font-inter)]">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_32px_rgba(0,0,0,0.06)] text-center">
            <div className="w-8 h-8 border-[3px] border-[#bccac1] border-t-[#00694c] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#3d4943]">Verifying your reset link…</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 bg-[#f7f9fb] relative overflow-hidden font-[family-name:var(--font-inter)]">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#00694c]/[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full bg-[#263aff]/[0.03] blur-[100px]" />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_32px_rgba(0,0,0,0.06)]">

          {success ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#86f8c9]/20 flex items-center justify-center mx-auto mb-5">
                <HiOutlineCheckCircle className="w-7 h-7 text-[#00694c]" />
              </div>
              <h1 className="text-[22px] font-bold text-[#191c1e] tracking-tight font-[family-name:var(--font-manrope)] mb-2">
                Password updated
              </h1>
              <p className="text-sm text-[#3d4943] leading-relaxed mb-6">
                Your password has been successfully changed. You can now sign in with your new password.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full py-3 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#00694c] to-[#008560] hover:shadow-[0_4px_16px_rgba(0,105,76,0.3)] active:scale-[0.98] transition-all duration-200"
              >
                Continue to Sign In
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-8">
                <h1 className="text-[26px] font-bold text-[#191c1e] tracking-tight font-[family-name:var(--font-manrope)]">
                  Set new password
                </h1>
                <p className="text-[#3d4943] text-sm mt-1.5 leading-relaxed">
                  Choose a strong password to secure your account.
                </p>
              </div>

              {serverError && (
                <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-[#ffdad6]/60 border border-[#ba1a1a]/10">
                  <HiOutlineExclamationCircle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#93000a] leading-snug">{serverError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* New Password */}
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-[#191c1e] mb-1.5">
                    New password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className={`w-[18px] h-[18px] ${errors.password ? 'text-[#ba1a1a]' : 'text-[#6d7a73]'}`} />
                    </div>
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearFieldError('password') }}
                      className={`w-full pl-10 pr-11 py-3 text-sm bg-white border rounded-lg text-[#191c1e] placeholder:text-[#bccac1] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                        errors.password
                          ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/20'
                          : 'border-[#bccac1]/40 focus:border-[#00694c] focus:ring-[#86f8c9]/30'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6d7a73] hover:text-[#3d4943] transition-colors"
                    >
                      {showPassword ? <HiOutlineEyeOff className="w-[18px] h-[18px]" /> : <HiOutlineEye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-[#ba1a1a]">{errors.password}</p>}

                  {/* Strength bar */}
                  {password && (
                    <div className="mt-2.5 flex items-center gap-2.5">
                      <div className="flex-1 flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-colors duration-300"
                            style={{ backgroundColor: i <= strength.level ? strength.color : '#e0e3e5' }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-[#191c1e] mb-1.5">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <HiOutlineLockClosed className={`w-[18px] h-[18px] ${errors.confirmPassword ? 'text-[#ba1a1a]' : 'text-[#6d7a73]'}`} />
                    </div>
                    <input
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword') }}
                      className={`w-full pl-10 pr-11 py-3 text-sm bg-white border rounded-lg text-[#191c1e] placeholder:text-[#bccac1] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                        errors.confirmPassword
                          ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/20'
                          : 'border-[#bccac1]/40 focus:border-[#00694c] focus:ring-[#86f8c9]/30'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6d7a73] hover:text-[#3d4943] transition-colors"
                    >
                      {showConfirm ? <HiOutlineEyeOff className="w-[18px] h-[18px]" /> : <HiOutlineEye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1.5 text-xs text-[#ba1a1a]">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#00694c] to-[#008560] hover:shadow-[0_4px_16px_rgba(0,105,76,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Updating…' : 'Update Password'}
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
