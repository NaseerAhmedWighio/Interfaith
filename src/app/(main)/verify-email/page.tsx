'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 sacred-pattern flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#c8a75e]/20 border-t-[#c8a75e] rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  )
}

function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email')

  const [email, setEmail] = useState(emailParam || '')
  const [otp, setOtp] = useState('')
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !otp) {
      setStatus('error')
      setMessage('Please enter both email and OTP code')
      return
    }

    if (otp.length !== 6) {
      setStatus('error')
      setMessage('OTP must be 6 digits')
      return
    }

    setStatus('verifying')
    setMessage('')

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        setMessage(data.error || 'Verification failed')
        return
      }

      setStatus('success')
      setMessage(data.message)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred during verification. Please try again.')
    }
  }

  const handleResendOTP = async () => {
    if (!email) {
      setResendMessage('Please enter your email address')
      return
    }

    setIsResending(true)
    setResendMessage('')

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResendMessage(data.error || 'Failed to resend OTP')
        setIsResending(false)
        return
      }

      setResendMessage('New OTP sent! Please check your inbox.')
      setOtp('') // Clear the OTP field
    } catch (error) {
      setResendMessage('An error occurred. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 sacred-pattern">
      <div className="max-w-md w-full">
        <div className="card-premium p-6 sm:p-8 md:p-10">
          {status === 'success' ? (
            <div className="text-center">
              <div className="pulse-glow inline-flex p-4 sm:p-5 rounded-xl bg-[#27AE60] mb-6">
                <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-[#f5f3ee]" />
              </div>
              <h1 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4">
                Email Verified!
              </h1>
              <p className="text-sm sm:text-base text-premium leading-relaxed mb-6">
                {message}
              </p>
              <p className="text-sm text-premium-light">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex p-4 sm:p-5 rounded-xl bg-[#c8a75e]/20 mb-4">
                  <Mail className="w-12 h-12 sm:w-14 sm:h-14 text-[#c8a75e]" />
                </div>
                <h1 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-2">
                  Verify Your Email
                </h1>
                <p className="text-sm sm:text-base text-premium">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                    Verification Code (OTP)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all text-center text-2xl tracking-widest font-mono"
                    placeholder="000000"
                  />
                  <p className="text-xs text-premium-light mt-2">
                    Enter the 6-digit code from your email
                  </p>
                </div>

                {status === 'error' && (
                  <div className="p-3 sm:p-4 bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-xl">
                    <p className="text-[#e74c3c] text-xs sm:text-sm">{message}</p>
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
                  disabled={status === 'verifying'}
                  className="w-full btn-primary text-sm sm:text-base px-6 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'verifying' ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    'Verify Email'
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-xs sm:text-sm text-[#c8a75e] hover:text-[#d4b56d] font-semibold underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? 'Sending...' : "Didn't receive the code? Resend OTP"}
                  </button>
                </div>

                <p className="text-center text-xs sm:text-sm text-[#aab0d6]">
                  Already verified?{' '}
                  <Link href="/login" className="text-[#c8a75e] hover:text-[#d4b56d] font-semibold transition-colors">
                    Log in
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
