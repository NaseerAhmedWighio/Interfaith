'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  })
  const [isFromJoin, setIsFromJoin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load data from sessionStorage on mount
  useEffect(() => {
    const joinData = sessionStorage.getItem('registerFromJoin')
    if (joinData) {
      try {
        const data = JSON.parse(joinData)
        setFormData(prev => ({
          ...prev,
          email: data.email || '',
          fullName: data.fullName || '',
        }))
        setIsFromJoin(true)
        // Clear sessionStorage after reading
        sessionStorage.removeItem('registerFromJoin')
      } catch (error) {
        console.error('Error parsing join data:', error)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        setIsSubmitting(false)
        return
      }

      // Redirect to verification page with email
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36  pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 sacred-pattern">
      <div className="container mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl heading-premium text-[#f5f3ee] mb-4">
            Create Account
          </h1>
          <p className="text-sm sm:text-base text-premium">
            Join our interfaith community
          </p>
        </div>

        <div className="card-premium p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]/50" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={isFromJoin}
                  className={`w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all ${
                    isFromJoin ? 'cursor-not-allowed opacity-70' : ''
                  }`}
                  placeholder="Your full name"
                />
              </div>
              {isFromJoin && (
                <p className="text-xs text-[#c8a75e] mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Name from join form - cannot be changed
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]/50" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isFromJoin}
                  className={`w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all ${
                    isFromJoin ? 'cursor-not-allowed opacity-70' : ''
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {isFromJoin && (
                <p className="text-xs text-[#c8a75e] mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Email from join form - cannot be changed
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                Password *
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
              <p className="text-xs text-[#aab0d6]/70 mt-2">
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                  placeholder="••••••••"
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
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-xs sm:text-sm text-[#aab0d6]">
              Already have an account?{' '}
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
