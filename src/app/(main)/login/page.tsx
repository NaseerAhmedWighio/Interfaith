'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')

        // Show resend verification option if email is not verified
        if (data.error?.includes('verify your email')) {
          setShowResendVerification(true)
          // Suggest going to verify page
          setError(data.error + ' Click below to verify or go to the verification page.')
        } else {
          setShowResendVerification(false)
        }

        setIsSubmitting(false)
        return
      }

      // Redirect based on user role
      if (data.user.role === 'admin') {
        // Only admins go to admin dashboard
        router.push(redirect.startsWith('/admin') ? redirect : '/admin')
      } else {
        // Non-admins (user, editor, moderator) go to home or profile
        router.push(redirect.startsWith('/admin') ? '/' : redirect)
      }
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleResendVerification = async () => {
    if (!formData.email) {
      setResendMessage('Please enter your email address first')
      return
    }

    setIsResending(true)
    setResendMessage('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResendMessage(data.error || 'Failed to resend verification email')
        setIsResending(false)
        return
      }

      setResendMessage('Verification email sent! Please check your inbox.')
      setError(null)
    } catch (error) {
      setResendMessage('An error occurred. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 sacred-pattern">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl heading-premium text-[#f5f3ee] mb-4">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-premium">
            Log in to your account
          </p>
        </div>

        <div className="card-premium p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]/50" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aab0d6]/50 hover:text-[#c8a75e] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <Link
                href="/forgot-password"
                className="text-[#c8a75e] hover:text-[#d4b56d] font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-xl">
                <p className="text-[#e74c3c] text-xs sm:text-sm">{error}</p>
                {showResendVerification && (
                  <div className="mt-3 space-y-2">
                    <Link
                      href={`/verify-email?email=${encodeURIComponent(formData.email)}`}
                      className="block text-center px-4 py-2 bg-[#c8a75e] hover:bg-[#d4b56d] text-[#0b0f2a] font-semibold rounded-lg transition-colors text-xs sm:text-sm"
                    >
                      Go to Verification Page
                    </Link>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResending}
                      className="w-full text-xs sm:text-sm text-[#c8a75e] hover:text-[#d4b56d] font-semibold underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResending ? 'Sending...' : 'Resend OTP to Email'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {resendMessage && (
              <div className={`p-3 sm:p-4 rounded-xl ${resendMessage.includes('sent') ? 'bg-[#27AE60]/10 border border-[#27AE60]/30' : 'bg-[#e74c3c]/10 border border-[#e74c3c]/30'}`}>
                <p className={`text-xs sm:text-sm ${resendMessage.includes('sent') ? 'text-[#27AE60]' : 'text-[#e74c3c]'}`}>
                  {resendMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-sm sm:text-base px-6 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>

            <p className="text-center text-xs sm:text-sm text-[#aab0d6]">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#c8a75e] hover:text-[#d4b56d] font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
