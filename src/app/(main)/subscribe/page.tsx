'use client'

import { useState, useEffect } from 'react'
import { Mail, Bell, Sparkles, BookOpen, Heart, Globe as Globe2, CheckCircle, Send } from 'lucide-react'
import { createNewsletterSubscriber } from '@/actions/database'

interface PageContent {
  pageKey: string
  sectionKey: string
  title: string | null
  content: string | null
}

interface SubscriptionFormData {
  email: string
  name: string
  subscriptionTopics: string[]
  frequency: string
  source: string
}

interface User {
  id: string
  email: string
  fullName: string
  role: string
}

export default function Subscribe() {
  const [user, setUser] = useState<User | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [formData, setFormData] = useState<SubscriptionFormData>({
    email: '',
    name: '',
    subscriptionTopics: [],
    frequency: 'weekly',
    source: 'subscribe_page',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageContent, setPageContent] = useState<PageContent[]>([])

  // Fetch CMS content
  useEffect(() => {
    fetch('/api/page-content?pageKey=subscribe')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setPageContent(data) })
      .catch(() => {})
  }, [])

  const heroBadge = pageContent.find(p => p.sectionKey === 'hero_badge')?.title || 'Stay Connected'
  const heroHeading1 = pageContent.find(p => p.sectionKey === 'hero_heading_1')?.title || 'Subscribe to Our'
  const heroHeading2 = pageContent.find(p => p.sectionKey === 'hero_heading_2')?.title || 'Newsletter'
  const heroSubtitle = pageContent.find(p => p.sectionKey === 'hero_subtitle')?.content || ''
  const subscribersHeading = pageContent.find(p => p.sectionKey === 'subscribers_heading')?.title || 'Join 25,000+ Subscribers'
  const formHeading = pageContent.find(p => p.sectionKey === 'form_heading')?.title || 'Subscribe Now'
  const formSubtitle = pageContent.find(p => p.sectionKey === 'form_subtitle')?.content || 'Free forever. Delivered with love.'
  const newsletterHeading = pageContent.find(p => p.sectionKey === 'newsletter_heading')?.title || "What's Inside Each Newsletter?"
  const footerHeading = pageContent.find(p => p.sectionKey === 'footer_heading')?.title || 'Start Your Journey of Discovery Today'
  const footerSubtitle = pageContent.find(p => p.sectionKey === 'footer_subtitle')?.content || ''

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
        email: user.email,
        name: user.fullName,
      }))
    }
  }, [user])

  const topicOptions = [
    { id: 'interfaith_dialogue', label: 'Interfaith Dialogue', icon: Globe2 },
    { id: 'sufi_wisdom', label: 'Sufi Wisdom', icon: Sparkles },
    { id: 'sacred_texts', label: 'Sacred Texts', icon: BookOpen },
    { id: 'peace_initiatives', label: 'Peace Initiatives', icon: Heart },
    { id: 'events', label: 'Events & Workshops', icon: Bell },
    { id: 'community_stories', label: 'Community Stories', icon: Mail },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const result = await createNewsletterSubscriber({
      email: formData.email,
      name: formData.name || undefined,
      subscriptionTopics: formData.subscriptionTopics,
      frequency: formData.frequency,
      source: formData.source,
      userId: user?.id, // Link to user account if logged in
    })

    setIsSubmitting(false)

    if (result.error) {
      if (result.error.includes('duplicate') || result.error.includes('unique')) {
        setError('This email is already subscribed to our newsletter.')
      } else {
        setError(result.error)
      }
    } else {
      setIsSuccess(true)
    }
  }

  const toggleTopic = (topicId: string) => {
    setFormData(prev => ({
      ...prev,
      subscriptionTopics: prev.subscriptionTopics.includes(topicId)
        ? prev.subscriptionTopics.filter(t => t !== topicId)
        : [...prev.subscriptionTopics, topicId]
    }))
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 sacred-pattern">
        <div className="max-w-2xl w-full">
          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <div className="pulse-glow inline-flex p-4 sm:p-5 md:p-6 rounded-xl bg-[#C8A75E] mb-6 sm:mb-8">
              <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[#0B0F2A]" />
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 px-4">
              You're Subscribed!
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed mb-6 sm:mb-8 px-4">
              Welcome to our community, {formData.name || 'friend'}! You'll receive your first newsletter soon at{' '}
              <span className="font-bold text-[#c8a75e]">{formData.email}</span>.
            </p>
            {user && (
              <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl mb-6 sm:mb-8">
                <p className="text-sm sm:text-base text-premium">
                  ✅ Your subscription has been linked to your account. Manage it anytime in your{' '}
                  <a href="/profile" className="text-[#c8a75e] font-bold hover:underline">
                    profile
                  </a>.
                </p>
              </div>
            )}
            <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl mb-6 sm:mb-8">
              <h3 className="font-bold text-sm sm:text-base text-[#f5f3ee] mb-3">What to Expect:</h3>
              <ul className="space-y-2 text-xs sm:text-sm md:text-base text-premium text-left">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                  <span>Inspiring stories of interfaith harmony</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                  <span>Sacred wisdom from multiple traditions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                  <span>Upcoming events and opportunities to connect</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                  <span>Actionable ways to promote peace in your community</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                onClick={() => window.location.href = '/'}
                className="btn-secondary text-sm sm:text-base px-6 sm:px-7 md:px-8 py-3"
              >
                Return Home
              </button>
              <button
                onClick={() => window.location.href = '/join'}
                className="btn-primary text-sm sm:text-base px-6 sm:px-7 md:px-8 py-3"
              >
                Join the Movement
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <section className="section-premium pt-28 md:pt-36  pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#c8a75e]" />
            <span className="text-xs sm:text-sm font-semibold text-[#C8A75E]">
              {heroBadge}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight px-4">
            {heroHeading1}
            <span className="block gradient-text mt-2">{heroHeading2}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed max-w-3xl mx-auto px-4">
            {heroSubtitle}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16">
            <BenefitCard
              icon={<Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />}
              title="Weekly Wisdom"
              description="Curated insights from Sufi masters and sacred traditions worldwide"
              color="#D4A07B"
            />
            <BenefitCard
              icon={<Bell className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />}
              title="Event Updates"
              description="Be the first to know about workshops, dialogues, and peace gatherings"
              color="#C8A75E"
            />
            <BenefitCard
              icon={<Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />}
              title="Community Stories"
              description="Read inspiring tales of bridges built across faith traditions"
              color="#E07070"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-lg sm:text-2xl md:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 px-4 sm:px-0">
                {subscribersHeading}
              </h2>
              <div className="divider-premium max-w-xs mb-6 sm:mb-8 mx-4 sm:mx-0"></div>

              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <FeatureItem
                  icon={<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />}
                  text="No spam, ever. We respect your inbox and your time."
                />
                <FeatureItem
                  icon={<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />}
                  text="Unsubscribe anytime with a single click."
                />
                <FeatureItem
                  icon={<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />}
                  text="Choose your preferred email frequency and topics."
                />
                <FeatureItem
                  icon={<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />}
                  text="Mobile-friendly content optimized for any device."
                />
              </div>

              <div className="mt-8 sm:mt-10 glass-effect p-4 sm:p-5 md:p-6 rounded-xl">
                <p className="text-xs sm:text-sm text-premium italic">
                  "This newsletter has transformed my understanding of other faiths. Every issue
                  brings new insights and opportunities for dialogue."
                </p>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-bold text-[#f5f3ee]">— Sarah M., Toronto</p>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="card-premium p-6 sm:p-8 md:p-10">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-xl bg-[#C8A75E] flex items-center justify-center shadow-xl">
                    <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-[#f5f3ee]" />
                  </div>
                  <h3 className="text-lg sm:text-2xl heading-premium text-[#f5f3ee] mb-2">
                    {formHeading}
                  </h3>
                  <p className="text-premium text-xs sm:text-sm">{formSubtitle}</p>
                </div>

                {/* Login prompt for guests */}
                {!loadingAuth && !user && (
                  <div className="glass-effect p-4 rounded-xl mb-6">
                    <p className="text-sm text-premium">
                      💡 Already have an account?{' '}
                      <a href="/login?redirect=/subscribe" className="text-[#c8a75e] font-bold hover:underline">
                        Log in
                      </a>{' '}
                      to manage your subscription from your profile.
                    </p>
                  </div>
                )}

                {/* Welcome message for authenticated users */}
                {user && (
                  <div className="glass-effect p-4 rounded-xl mb-6">
                    <p className="text-sm text-premium">
                      👋 Welcome back, <span className="font-bold text-[#c8a75e]">{user.fullName}</span>!
                      Your subscription will be linked to your account.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!!user}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-3 sm:mb-4 uppercase tracking-wider">
                      Topics of Interest
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {topicOptions.map((topic) => {
                        const Icon = topic.icon
                        return (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => toggleTopic(topic.id)}
                            className={`px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1 sm:space-x-2 ${
                              formData.subscriptionTopics.includes(topic.id)
                                ? 'bg-[#C8A75E] text-[#0B0F2A] shadow-lg scale-105'
                                : 'bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#aab0d6] hover:bg-[#0b0f2a]/80 hover:border-[#c8a75e]/40'
                            }`}
                          >
                            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">{topic.label}</span>
                            <span className="sm:hidden">{topic.label.split(' ')[0]}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
                      Email Frequency
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                    >
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly (Recommended)</option>
                      <option value="monthly">Monthly Summary</option>
                    </select>
                  </div>

                  {error && (
                    <div className="p-3 sm:p-4 bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-xl">
                      <p className="text-[#e74c3c] text-xs sm:text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary text-sm sm:text-base px-6 sm:px-7 md:px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span>Subscribing...</span>
                    ) : (
                      <div className="grid grid-cols-3 justify-between items-center">
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                        <span>Subscribe Now</span>
                        
                      </div>
                    )}
                  </button>

                  <p className="text-xs text-center text-[#aab0d6]/70">
                    By subscribing, you agree to receive emails from Interfaith Peace Bridge.
                    We never share your information with third parties.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">
              {newsletterHeading}
            </h2>
            <div className="divider-premium max-w-xs mx-auto mb-4 sm:mb-6"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <ContentCard
              icon={<BookOpen className="w-10 h-10" />}
              title="Sacred Wisdom"
              items={[
                'Sufi poetry & teachings',
                'Interfaith perspectives',
                'Contemplative practices',
                'Spiritual reflections',
              ]}
              gradient="from-[#c8a75e] to-[#d4b56d]"
            />
            <ContentCard
              icon={<Globe2 className="w-10 h-10" />}
              title="Global Stories"
              items={[
                'Peace initiatives',
                'Community success stories',
                'Cultural celebrations',
                'Unity in action',
              ]}
              gradient="from-[#27ae60] to-green-500"
            />
            <ContentCard
              icon={<Bell className="w-10 h-10" />}
              title="Events & Programs"
              items={[
                'Interfaith dialogues',
                'Workshops & webinars',
                'Meditation circles',
                'Volunteer opportunities',
              ]}
              gradient="from-[#9b59b6] to-purple-500"
            />
            <ContentCard
              icon={<Heart className="w-10 h-10" />}
              title="Inspiration"
              items={[
                'Daily affirmations',
                'Peace prayers',
                'Reflection questions',
                'Acts of kindness ideas',
              ]}
              gradient="from-[#e07070] to-pink-500"
            />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-[#0b0f2a] via-[#141a3a] to-[#1c1f4a] text-[#f5f3ee]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight px-4">
            {footerHeading}
          </h2>
          <p className="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed mb-6 sm:mb-8 px-4">
            {footerSubtitle}
          </p>
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-[#c8a75e] text-[#0b0f2a] hover:text-[#c8a75e] hover:bg-[#c8a75e]/10">
            Subscribe Now
          </a>
        </div>
      </section>
    </div>
  )
}

function BenefitCard({ icon, title, description, gradient }: any) {
  return (
    <div className="card-premium p-6 sm:p-7 md:p-8 text-center group">
      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-xl bg-[#C8A75E] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
        <div className="text-[#0B0F2A]">{icon}</div>
      </div>
      <h3 className="text-base sm:text-xl heading-premium text-[#f5f3ee] mb-2 sm:mb-3">{title}</h3>
      <p className="text-premium text-xs sm:text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function FeatureItem({ icon, text }: any) {
  return (
    <div className="flex items-start space-x-3 sm:space-x-4">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <p className="text-sm sm:text-base text-premium leading-relaxed">{text}</p>
    </div>
  )
}

function ContentCard({ icon, title, items, gradient }: any) {
  return (
    <div className="tradition-card p-6 sm:p-7 md:p-8">
      <div className="w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-5 md:mb-6 rounded-xl bg-[#C8A75E] flex items-center justify-center shadow-xl">
        <div className="text-[#0B0F2A] [&>svg]:w-8 [&>svg]:h-8 sm:[&>svg]:w-9 sm:[&>svg]:h-9 md:[&>svg]:w-10 md:[&>svg]:h-10">{icon}</div>
      </div>
      <h3 className="text-base sm:text-xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item: string, index: number) => (
          <li key={index} className="flex items-start text-xs sm:text-sm text-premium">
            <span className="text-[#c8a75e] mr-2">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
