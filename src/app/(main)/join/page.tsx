'use client'

import { useState, useEffect } from 'react'
import { Heart, Globe as Globe2, Users, Send, CheckCircle, Sparkles, BookOpen, Handshake } from 'lucide-react'
import { createMovementMember } from '@/actions/database'

interface FormData {
  fullName: string
  email: string
  country: string
  traditionAffiliation: string
  interests: string[]
  howHeard: string
  message: string
  wantsNewsletter: boolean
  wantsEditor: boolean
}

interface User {
  id: string
  email: string
  fullName: string
  role: string
}

export default function JoinMovement() {
  const [user, setUser] = useState<User | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    country: '',
    traditionAffiliation: '',
    interests: [],
    howHeard: '',
    message: '',
    wantsNewsletter: true,
    wantsEditor: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user is logged in
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUser(data.user)
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setLoadingAuth(false)
      }
    }
    checkAuth()
  }, [])

  // Pre-fill form with user data when logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName,
        email: user.email,
      }))
    }
  }, [user])

  const interestOptions = [
    'Interfaith Dialogue',
    'Youth Programs',
    'Education',
    'Peace Building',
    'Community Service',
    'Sacred Texts Study',
    'Meditation & Spirituality',
    'Social Justice',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Create movement member
      const result = await createMovementMember({
        fullName: formData.fullName,
        email: formData.email,
        country: formData.country,
        traditionAffiliation: formData.traditionAffiliation,
        interests: formData.interests,
        howHeard: formData.howHeard,
        message: formData.message,
        wantsNewsletter: formData.wantsNewsletter,
        wantsVolunteer: formData.wantsEditor,
        userId: user?.id,
      })

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      // If user wants newsletter, create subscription
      if (formData.wantsNewsletter) {
        await fetch('/api/newsletter-subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            name: formData.fullName,
            subscriptionTopics: ['peace_initiatives', 'events', 'community_stories'],
            frequency: 'monthly',
            source: 'join_movement',
            userId: user?.id,
          }),
        })
      }

      // If user wants to be an editor and is logged in, create role request
      if (formData.wantsEditor && user) {
        await fetch('/api/user/request-role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestedRole: 'editor',
            reason: 'I want to contribute as an editor and help create content for peace initiatives',
          }),
        })
      }

      setIsSuccess(true)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 sacred-pattern">
        <div className="max-w-2xl w-full">
          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <div className="pulse-glow inline-flex p-4 sm:p-5 md:p-6 rounded-xl bg-[#27AE60] mb-6 sm:mb-8">
              <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[#f5f3ee]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 px-4">
              Welcome to the Movement!
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed mb-6 sm:mb-8 px-4">
              Thank you for joining us, {formData.fullName}. Together, we are building bridges
              of understanding and peace across all faith traditions.
            </p>

            {/* Account linking message */}
            {user && (
              <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl mb-6 sm:mb-8">
                <p className="text-sm sm:text-base text-premium">
                  ✅ Your submission has been linked to your account. You can view it anytime in your{' '}
                  <a href="/profile" className="text-[#c8a75e] font-bold hover:underline">
                    profile
                  </a>.
                </p>
              </div>
            )}

            {/* Editor request message for logged-in users */}
            {user && formData.wantsEditor && (
              <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl mb-6 sm:mb-8 border-l-4 border-[#27AE60]">
                <p className="text-sm sm:text-base text-premium font-semibold mb-2">
                  🙏 Editor Role Request Submitted
                </p>
                <p className="text-sm text-premium">
                  Thank you for your interest in becoming an editor! Your request has been sent to our admin team.
                  We will review your application and respond to you soon via email.
                </p>
              </div>
            )}

            {/* Prompt to create account for guest editors */}
            {!user && formData.wantsEditor && (
              <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl mb-6 sm:mb-8 border-l-4 border-[#c8a75e]">
                <p className="text-sm sm:text-base text-premium font-semibold mb-2">
                  💡 Want to Become an Editor?
                </p>
                <p className="text-sm text-premium mb-3">
                  To request the editor role, please create an account with the email you provided:
                  <span className="font-bold text-[#c8a75e]"> {formData.email}</span>
                </p>
                <button
                  onClick={() => {
                    // Store data in sessionStorage
                    sessionStorage.setItem('registerFromJoin', JSON.stringify({
                      email: formData.email,
                      fullName: formData.fullName,
                    }))
                    window.location.href = '/register'
                  }}
                  className="inline-block btn-primary text-sm px-6 py-2"
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Newsletter subscription confirmation */}
            {formData.wantsNewsletter && (
              <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl mb-6 sm:mb-8">
                <p className="text-sm sm:text-base text-premium">
                  📧 You've been subscribed to our monthly newsletter at{' '}
                  <span className="font-bold text-[#c8a75e]">{formData.email}</span>.
                </p>
              </div>
            )}

            <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-premium">
                A confirmation has been sent to <span className="font-bold text-[#c8a75e]">{formData.email}</span>.
                Check your inbox for next steps and ways to get involved.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
            <span className="text-xs sm:text-sm font-semibold text-[#E07070]">
              Join Us Today
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight px-4">
            Be Part of
            <span className="block gradient-text mt-2">Something Greater</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed max-w-3xl mx-auto px-4">
            Join thousands of people from every faith tradition working together to build
            a world of understanding, compassion, and peace.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-[#0b0f2a] via-[#141a3a] to-[#0b0f2a]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16">
            <ImpactCard
              icon={<Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />}
              number="50,000+"
              label="Global Members"
              gradient="from-[#c8a75e] to-cyan-500"
            />
            <ImpactCard
              icon={<Globe2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />}
              number="120+"
              label="Countries"
              gradient="from-teal-500 to-emerald-500"
            />
            <ImpactCard
              icon={<Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />}
              number="15+"
              label="Faith Traditions"
              gradient="from-[#e07070] to-pink-500"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <BenefitCard
              icon={<BookOpen className="w-10 h-10" />}
              title="Educational Resources"
              description="Access exclusive content, workshops, and learning materials about interfaith dialogue and sacred wisdom."
              gradient="from-[#c8a75e] to-[#d4b56d]"
            />
            <BenefitCard
              icon={<Users className="w-10 h-10" />}
              title="Global Community"
              description="Connect with like-minded individuals across the world who share your commitment to peace and understanding."
              gradient="from-[#27ae60] to-green-500"
            />
            <BenefitCard
              icon={<Handshake className="w-10 h-10" />}
              title="Peace Initiatives"
              description="Participate in local and global projects that make a real difference in building interfaith harmony."
              gradient="from-[#9b59b6] to-purple-500"
            />
            <BenefitCard
              icon={<Sparkles className="w-10 h-10" />}
              title="Spiritual Growth"
              description="Deepen your spiritual journey through shared wisdom from multiple traditions and contemplative practices."
              gradient="from-[#d4a07b] to-orange-500"
            />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-3xl">
          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-xl sm:text-2xl md:text-3xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">
                Ready to Join?
              </h2>
              <div className="divider-premium max-w-xs mx-auto mb-4 sm:mb-6"></div>
              <p className="text-sm sm:text-base md:text-lg text-premium px-4">
                Fill out the form below to become part of our global interfaith family.
              </p>
            </div>

            {/* Login prompt for guests */}
            {!loadingAuth && !user && (
              <div className="glass-effect p-4 rounded-xl mb-6">
                <p className="text-sm text-premium">
                  💡 Already have an account?{' '}
                  <a href="/login?redirect=/join" className="text-[#c8a75e] font-bold hover:underline">
                    Log in
                  </a>{' '}
                  to auto-fill this form and track your submissions.
                </p>
              </div>
            )}

            {/* Welcome message for authenticated users */}
            {user && (
              <div className="glass-effect p-4 rounded-xl mb-6">
                <p className="text-sm text-premium">
                  👋 Welcome back, <span className="font-bold text-[#c8a75e]">{user.fullName}</span>!
                  Your submission will be linked to your account.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={!!user}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!!user}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                    placeholder="Your country"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                    Faith Tradition
                  </label>
                  <input
                    type="text"
                    value={formData.traditionAffiliation}
                    onChange={(e) => setFormData({ ...formData, traditionAffiliation: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                    placeholder="e.g., Muslim, Christian, Hindu..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-3 sm:mb-4 uppercase tracking-wider">
                  Areas of Interest
                </label>
                <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 text-left rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        formData.interests.includes(interest)
                          ? 'bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] shadow-lg scale-105'
                          : 'bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#aab0d6] hover:bg-[#0b0f2a]/80 hover:border-[#c8a75e]/40'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                  How did you hear about us?
                </label>
                <select
                  value={formData.howHeard}
                  onChange={(e) => setFormData({ ...formData, howHeard: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                >
                  <option value="">Select an option</option>
                  <option value="social_media">Social Media</option>
                  <option value="friend">Friend or Family</option>
                  <option value="search_engine">Search Engine</option>
                  <option value="event">Event or Conference</option>
                  <option value="religious_organization">Religious Organization</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                  placeholder="Share your thoughts, hopes, or questions..."
                />
              </div>

              <div className="space-y-3 sm:space-y-4 glass-effect p-4 sm:p-5 md:p-6 rounded-xl">
                <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.wantsNewsletter}
                    onChange={(e) => setFormData({ ...formData, wantsNewsletter: e.target.checked })}
                    className="mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded bg-[#0b0f2a]/60 border-[#c8a75e]/30 text-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30"
                  />
                  <span className="text-xs sm:text-sm md:text-base text-premium group-hover:text-[#f5f3ee] transition-colors">
                    Yes, I want to receive the monthly newsletter with updates, events, and spiritual insights
                  </span>
                </label>

                <label className="flex items-start space-x-2 sm:space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.wantsEditor}
                    onChange={(e) => setFormData({ ...formData, wantsEditor: e.target.checked })}
                    className="mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded bg-[#0b0f2a]/60 border-[#c8a75e]/30 text-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30"
                  />
                  <span className="text-xs sm:text-sm md:text-base text-premium group-hover:text-[#f5f3ee] transition-colors">
                    I'm interested in becoming an editor and contributing content to peace initiatives
                  </span>
                </label>
              </div>

              {error && (
                <div className="p-3 sm:p-4 bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-xl">
                  <p className="text-[#e74c3c] text-xs sm:text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Joining...</span>
                ) : (
                  <div className='grid grid-cols-3 justify-items-center items-center'>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    <span>Join the Movement</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-[#0b0f2a] via-[#141a3a] to-[#1c1f4a] text-[#f5f3ee]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight px-4">
            Together, We Create a World of Peace
          </h2>
          <p className="text-sm sm:text-base md:text-lg opacity-90 leading-relaxed px-4">
            Every person who joins our movement adds another thread to the tapestry of global
            interfaith harmony. Your voice, your compassion, and your commitment matter.
          </p>
        </div>
      </section>
    </div>
  )
}

function ImpactCard({ icon, number, label, gradient }: any) {
  return (
    <div className="card-premium p-6 sm:p-7 md:p-8 text-center group">
      <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
        <div className="text-[#f5f3ee]">{icon}</div>
      </div>
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2">{number}</div>
      <div className="text-xs sm:text-sm md:text-base text-premium font-semibold">{label}</div>
    </div>
  )
}

function BenefitCard({ icon, title, description, gradient }: any) {
  return (
    <div className="tradition-card p-6 sm:p-7 md:p-8 group">
      <div className={`w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-5 md:mb-6 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
        <div className="text-[#f5f3ee] [&>svg]:w-8 [&>svg]:h-8 sm:[&>svg]:w-9 sm:[&>svg]:h-9 md:[&>svg]:w-10 md:[&>svg]:h-10">{icon}</div>
      </div>
      <h3 className="text-xl sm:text-2xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 group-hover:text-[#c8a75e] transition-colors">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-premium leading-relaxed">{description}</p>
    </div>
  )
}
