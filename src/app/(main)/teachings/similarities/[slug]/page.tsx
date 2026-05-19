'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Heart, HeartHandshake, Sparkles, HandHeart, Users, Scale, Home } from 'lucide-react'
import { getSimilarityThemeBySlug, getTraditionSection } from '@/actions/database'
import Pagination from '@/components/Pagination'

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
  const [unitySection, setUnitySection] = useState<{ title: string; content: string } | null>(null)
  const [teachings, setTeachings] = useState<TeachingWithTradition[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 4

  useEffect(() => {
    fetchThemeAndTeachings()
  }, [slug])

  useEffect(() => {
    setPage(1)
  }, [teachings.length])

  async function fetchThemeAndTeachings() {
    setLoading(true)

    const result = await getSimilarityThemeBySlug(slug)
    const unityRes = await getTraditionSection('unity_in_diversity')

    if (unityRes.data && !Array.isArray(unityRes.data)) setUnitySection(unityRes.data)

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

  const totalPages = Math.ceil(teachings.length / ITEMS_PER_PAGE)
  const paginatedTeachings = teachings.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

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
      <section className="section-premium pt-28 md:pt-36 pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/teachings"
            className="inline-flex items-center gap-2 text-[#c8a75e] hover:text-[#d4b56d] mb-6 sm:mb-8 group glass-effect px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium w-fit"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Teachings</span>
          </Link>

          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl pulse-glow shadow-premium-lg mx-auto`} style={{ backgroundColor: color }}>
              <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#f5f3ee]" />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mt-4 sm:mt-5 mb-4 sm:mb-5 leading-tight">
              {theme.title}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed max-w-2xl mx-auto">
              {theme.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-16 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {paginatedTeachings.map((item) => (
              <TeachingCard key={item.id} teaching={item} />
            ))}
          </div>

          {teachings.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="card-premium p-8 sm:p-10 max-w-md mx-auto">
                <p className="text-[#aab0d6]/70 text-sm sm:text-base">No teachings available for this theme.</p>
              </div>
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </section>

      {unitySection && (
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
          <div className="container mx-auto max-w-3xl">
            <div className="card-premium p-6 sm:p-8 md:p-10 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-5 leading-tight">
                {unitySection.title}
              </h2>
              <div className="text-sm sm:text-base text-premium leading-relaxed space-y-3 sm:space-y-4 text-left">
                {unitySection.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function TeachingCard({ teaching }: { teaching: TeachingWithTradition }) {
  return (
    <div className="card-premium p-5 sm:p-6 group relative flex flex-col h-full">
      <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 rounded-t-2xl opacity-50" style={{ backgroundColor: teaching.tradition.color }}></div>

      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div
          className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[#f5f3ee] text-[10px] sm:text-xs font-semibold shadow-md"
          style={{ backgroundColor: teaching.tradition.color }}
        >
          {teaching.tradition.name}
        </div>
      </div>

      <blockquote className="text-sm sm:text-base md:text-lg text-[#f5f3ee] font-serif italic mb-3 sm:mb-4 leading-relaxed flex-grow">
        &ldquo;{teaching.teaching}&rdquo;
      </blockquote>

      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#aab0d6]/80 mb-3 sm:mb-4">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#c8a75e] flex items-center justify-center shrink-0">
          <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
        </div>
        <span className="font-semibold truncate">{teaching.source}</span>
      </div>

      {teaching.context && (
        <div className="pt-3 sm:pt-4 border-t border-[#aab0d6]/15">
          <p className="text-[11px] sm:text-xs text-premium leading-relaxed line-clamp-2">{teaching.context}</p>
        </div>
      )}
    </div>
  )
}
