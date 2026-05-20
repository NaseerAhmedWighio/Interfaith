'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'An error occurred')
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 sacred-pattern">
        <div className="max-w-md w-full">
          <div className="card-premium p-6 sm:p-8 md:p-10 text-center">
            <div className="pulse-glow inline-flex p-4 sm:p-5 rounded-xl bg-[#27AE60] mb-6">
              <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-[#f5f3ee]" />
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4">
              Check Your Email
            </h1>
            <p className="text-sm sm:text-base text-premium leading-relaxed mb-6">
              If an account exists with <span className="font-bold text-[#c8a75e]">{email}</span>,
              you will receive a password reset link shortly.
            </p>
            <Link href="/login" className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 sacred-pattern">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl heading-premium text-[#f5f3ee] mb-4">
            Reset Password
          </h1>
          <p className="text-sm sm:text-base text-premium">
            Enter your email to receive a password reset link
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-xl">
                <p className="text-[#e74c3c] text-xs sm:text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary text-sm sm:text-base px-6 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="text-center text-xs sm:text-sm text-[#aab0d6]">
              Remember your password?{' '}
              <Link href="/login" className="text-[#c8a75e] hover:text-[#d4b56d] font-semibold transition-colors">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
