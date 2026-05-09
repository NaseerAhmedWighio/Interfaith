'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Heart, HeartHandshake, Sparkles, HandHeart, Users, Scale, Home } from 'lucide-react'
import { getSimilarityThemeBySlug } from '@/actions/database'

interface SimilarityTheme {
  id: string
  title: string
  description: string
  icon: string
  slug: string
}

interface TeachingWithTradition {
  id: string
  teaching: string
  source: string
  context: string | null
  tradition: {
    name: string
    color?: string
  }
}

export default function SimilarityDetail() {
  const params = useParams()
  const slug = params.slug as string
  const [theme, setTheme] = useState<SimilarityTheme | null>(null)
  const [teachings, setTeachings] = useState<TeachingWithTradition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchThemeAndTeachings()
  }, [slug])

  async function fetchThemeAndTeachings() {
    setLoading(true)

    const result = await getSimilarityThemeBySlug(slug)

    if (result.data) {
      setTheme({
        id: result.data.id,
        title: result.data.title,
        description: result.data.description,
        icon: result.data.icon,
        slug: result.data.slug
      })

      if (result.data.teachings) {
        setTeachings(result.data.teachings)
      }
    }

    setLoading(false)
  }

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Heart,
    HeartHandshake,
    Sparkles,
    HandHeart,
    Users,
    Scale,
    BookOpen,
    Home,
  }

  const colors: Record<string, string> = {
    'golden-rule': '#D4A07B',
    'compassion-mercy': '#E07070',
    'prayer-meditation': '#9B59B6',
    'charity-service': '#27AE60',
    'love-unity': '#C8A75E',
    'justice-righteousness': '#5B7FDB',
    'humility-wisdom': '#D4A07B',
    'sacred-hospitality': '#10B981',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-[#aab0d6]/80">Loading teachings...</p>
        </div>
      </div>
    )
  }

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#aab0d6]/80 mb-4">Theme not found</p>
          <Link href="/teachings" className="text-[#c8a75e] hover:text-blue-700">
            Return to Teachings
          </Link>
        </div>
      </div>
    )
  }

  const Icon = iconMap[theme.icon] || BookOpen
  const color = colors[theme.slug] || '#6B7280'

  return (
    <div>
      <section className="relative section-premium pt-28 md:pt-36 pb-24 px-6 overflow-hidden">
        <div className="container mx-auto max-w-5xl relative z-10">
          <Link
            href="/teachings"
            className="inline-flex items-center space-x-2 text-[#c8a75e] hover:text-blue-700 mb-12 group glass-effect px-6 py-3 rounded-full font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Teachings</span>
          </Link>

          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl pulse-glow shadow-premium-lg`} style={{ backgroundColor: color }}>
              <Icon className="w-12 h-12 text-[#f5f3ee]" />
            </div>

            <h1 className="text-6xl md:text-7xl heading-premium text-[#f5f3ee] mb-8 leading-[1.1]">
              {theme.title}
            </h1>

            <p className="text-2xl text-premium leading-relaxed max-w-3xl mx-auto font-light">
              {theme.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-10">
            {teachings.map((item) => (
              <TeachingCard key={item.id} teaching={item} />
            ))}
          </div>

          {teachings.length === 0 && (
            <div className="text-center py-16">
              <div className="card-premium p-12 max-w-md mx-auto">
                <p className="text-[#aab0d6]/70 text-lg">No teachings available for this theme.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-6 sacred-pattern">
        <div className="container mx-auto max-w-4xl">
          <div className="card-premium p-12 text-center">
            <h2 className="text-3xl heading-premium text-[#f5f3ee] mb-6">
              Unity in Diversity
            </h2>
            <div className="text-premium leading-relaxed space-y-4">
              <p>
                These parallel teachings from diverse traditions reveal a profound truth:
                humanity's spiritual wisdom flows from a common source. While expressed through
                different cultures, languages, and historical contexts, the essential message
                remains constant.
              </p>
              <p>
                When we recognize this shared foundation, religious differences become not
                barriers but beautiful variations on universal themes—like different instruments
                playing the same sacred symphony.
              </p>
              <p className="font-semibold text-[#f5f3ee]">
                May these teachings inspire us to see the divine unity that connects all faiths
                and all people in our shared journey toward truth, love, and peace.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function TeachingCard({ teaching }: { teaching: TeachingWithTradition }) {
  return (
    <div className="card-premium p-10 group relative">
      <div className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl opacity-50" style={{ backgroundColor: teaching.tradition.color }}></div>

      <div className="flex items-start justify-between mb-6">
        <div
          className="px-5 py-2.5 rounded-full text-[#f5f3ee] text-sm font-bold shadow-lg"
          style={{ backgroundColor: teaching.tradition.color }}
        >
          {teaching.tradition.name}
        </div>
      </div>

      <blockquote className="text-2xl md:text-3xl text-[#f5f3ee] font-serif italic mb-6 leading-relaxed">
        "{teaching.teaching}"
      </blockquote>

      <div className="flex items-center space-x-3 text-sm text-[#aab0d6]/80 mb-6">
        <div className="w-8 h-8 rounded-xl bg-[#14B8A6] flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-[#c8a75e]" />
        </div>
        <span className="font-semibold">{teaching.source}</span>
      </div>

      {teaching.context && (
        <div className="mt-6 pt-6 border-t border-[#aab0d6]/20">
          <p className="text-premium leading-relaxed">{teaching.context}</p>
        </div>
      )}
    </div>
  )
}
