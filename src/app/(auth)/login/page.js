'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineExclamationCircle } from 'react-icons/hi'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const urlError = searchParams.get('error')

  function validate() {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validate()) return

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setServerError(error.message)
      setLoading(false)
    } else {
      router.push('/home')
      router.refresh()
    }
  }

  return (
    <>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-[#191c1e] tracking-tight font-[family-name:var(--font-manrope)]">
          Welcome back
        </h1>
        <p className="text-[#3d4943] text-sm mt-1.5 leading-relaxed">
          Sign in to continue to SmartBudol.
        </p>
      </div>

      {/* Errors */}
      {(serverError || urlError) && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-[#ffdad6]/60 border border-[#ba1a1a]/10">
          <HiOutlineExclamationCircle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
          <p className="text-sm text-[#93000a] leading-snug">{serverError || urlError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-[#191c1e] mb-1.5">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <HiOutlineMail className={`w-[18px] h-[18px] ${errors.email ? 'text-[#ba1a1a]' : 'text-[#6d7a73]'}`} />
            </div>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({...prev, email: ''})) }}
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
          <label htmlFor="login-password" className="block text-sm font-medium text-[#191c1e] mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <HiOutlineLockClosed className={`w-[18px] h-[18px] ${errors.password ? 'text-[#ba1a1a]' : 'text-[#6d7a73]'}`} />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({...prev, password: ''})) }}
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
        </div>

        {/* Forgot link */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-[13px] font-medium text-[#00694c] hover:text-[#008560] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-[#00694c] to-[#008560] hover:shadow-[0_4px_16px_rgba(0,105,76,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      {/* Register CTA */}
      <p className="mt-7 text-center text-sm text-[#3d4943]">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-[#00694c] hover:text-[#008560] transition-colors">
          Sign up
        </Link>
      </p>
    </>
  )
}

export default function Login() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 bg-[#f7f9fb] relative overflow-hidden font-[family-name:var(--font-inter)]">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#00694c]/[0.04] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full bg-[#263aff]/[0.03] blur-[100px]" />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_4px_32px_rgba(0,0,0,0.06)]">
          <Suspense fallback={<div className="text-center text-sm text-[#3d4943] py-8">Loading…</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}