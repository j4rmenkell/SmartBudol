'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineUser,
  HiOutlineExclamationCircle,
  HiOutlineArrowRight,
} from 'react-icons/hi'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  function validate() {
    const newErrors = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address'
    }

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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?next=/home`,
        data: { full_name: fullName.trim() },
      },
    })

    setLoading(false)

    if (error) {
      setServerError(error.message)
      return
    }

    // When email confirmations are enabled and the email already exists,
    // Supabase returns a user object with an empty identities array
    // instead of throwing an error (to prevent email enumeration).
    // We detect this and show a clear error message.
    if (data?.user?.identities?.length === 0) {
      setServerError('Registration not possible. This email may already be in use.')
      return
    }

    // Redirect to the verify-email page. Using replace() instead of push()
    // prevents the user from pressing "Back" to return to the registration
    // form after successful signup.
    router.replace('/verify-email')
  }

  const clearFieldError = (field) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 bg-[#f7f9fb] relative overflow-hidden font-[family-name:var(--font-inter)]">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-[#00694c]/[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-[#86f8c9]/[0.06] blur-[100px]" />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_32px_rgba(0,0,0,0.06)]">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[26px] font-bold text-[#191c1e] tracking-tight font-[family-name:var(--font-manrope)]">
              Create your account
            </h1>
            <p className="text-[#3d4943] text-sm mt-1.5 leading-relaxed">
              Join SmartBudol and start comparing prices.
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-[#ffdad6]/60 border border-[#ba1a1a]/10">
              <HiOutlineExclamationCircle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
              <p className="text-sm text-[#93000a] leading-snug">{serverError}</p>
            </div>
          )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="reg-name" className="block text-sm font-medium text-[#191c1e] mb-1.5">
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <HiOutlineUser className={`w-[18px] h-[18px] ${errors.fullName ? 'text-[#ba1a1a]' : 'text-[#6d7a73]'}`} />
                  </div>
                  <input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Juan Dela Cruz"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); clearFieldError('fullName') }}
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-white border rounded-lg text-[#191c1e] placeholder:text-[#bccac1] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                      errors.fullName
                        ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/20'
                        : 'border-[#bccac1]/40 focus:border-[#00694c] focus:ring-[#86f8c9]/30'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="mt-1.5 text-xs text-[#ba1a1a]">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-[#191c1e] mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <HiOutlineMail className={`w-[18px] h-[18px] ${errors.email ? 'text-[#ba1a1a]' : 'text-[#6d7a73]'}`} />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearFieldError('email') }}
                    className={`w-full pl-10 pr-4 py-3 text-sm bg-white border rounded-lg text-[#191c1e] placeholder:text-[#bccac1] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                      errors.email
                        ? 'border-[#ba1a1a] focus:ring-[#ba1a1a]/20'
                        : 'border-[#bccac1]/40 focus:border-[#00694c] focus:ring-[#86f8c9]/30'
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-[#ba1a1a]">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-[#191c1e] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className={`w-[18px] h-[18px] ${errors.password ? 'text-[#ba1a1a]' : 'text-[#6d7a73]'}`} />
                  </div>
                  <input
                    id="reg-password"
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
                <label htmlFor="reg-confirm" className="block text-sm font-medium text-[#191c1e] mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className={`w-[18px] h-[18px] ${errors.confirmPassword ? 'text-[#ba1a1a]' : 'text-[#6d7a73]'}`} />
                  </div>
                  <input
                    id="reg-confirm"
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



              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#00694c] to-[#008560] hover:shadow-[0_4px_16px_rgba(0,105,76,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating account…' : (
                  <>
                    Create Account
                    <HiOutlineArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          {/* Login CTA */}
          <p className="mt-7 text-center text-sm text-[#3d4943]">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#00694c] hover:text-[#008560] transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}