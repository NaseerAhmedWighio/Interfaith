'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Heart } from 'lucide-react'
import Link from 'next/link'
import { getPeaceInitiatives } from '@/actions/database'

interface PeaceInitiative {
  id: string
  title: string
  description: string
  impact: string
  status: string | null
  createdAt?: Date | null
}

export default function Peace() {
  const [peaceInitiatives, setPeaceInitiatives] = useState<PeaceInitiative[]>([])

  useEffect(() => {
    fetchInitiatives()
  }, [])

  async function fetchInitiatives() {
    const result = await getPeaceInitiatives()
    if (result.data) setPeaceInitiatives(result.data)
  }

  return (
    <div>
      <section className="section-premium pt-28 md:pt-36  pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
            <span className="text-xs sm:text-sm font-semibold text-[#E07070]">
              Building Peace Together
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight px-4">
            Active Peace
            <span className="block text-[#C8A75E] mt-2">Initiatives</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed max-w-3xl mx-auto px-4">
            From contemplation to action: building a world of compassion, understanding,
            and genuine interfaith harmony.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">
              Our Peace Work in Action
            </h2>
            <div className="divider-premium max-w-xs mx-auto mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base md:text-lg text-premium max-w-3xl mx-auto px-4">
              These initiatives transform spiritual wisdom into concrete actions that heal divisions
              and build lasting bridges between communities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-stretch">
            {peaceInitiatives.map((initiative) => (
              <InitiativeCard key={initiative.id} initiative={initiative} />
            ))}
          </div>

          {peaceInitiatives.length === 0 && (
            <div className="text-center py-8 sm:py-10 md:py-12">
              <p className="text-sm sm:text-base text-[#aab0d6]/70">Loading peace initiatives...</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-4xl">
          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12">
            <h2 className="text-2xl sm:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 text-center px-4">
              The Path from Wisdom to Action
            </h2>
            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base text-premium leading-relaxed">
              <p>
                Sufi wisdom teaches that spiritual knowledge must be lived, not merely contemplated.
                True understanding of divine love manifests in service, compassion, and active peacemaking.
                Our initiatives embody this principle, translating ancient wisdom into modern action.
              </p>
              <p>
                Each initiative is designed to address a specific barrier to interfaith harmony - whether
                it's lack of personal connection, educational gaps, or absence of collaborative spaces.
                By creating opportunities for genuine encounter and shared purpose, we help people move
                beyond abstract tolerance to authentic friendship.
              </p>
              <p>
                The impact extends far beyond statistics. When a Christian and a Muslim build a community
                garden together, when a Hindu and a Jew share their family's migration stories, when a
                Buddhist and a Sufi meditate side by side - these moments transform hearts and ripple
                outward to transform communities.
              </p>
              <div className="border-t border-[#aab0d6]/20 pt-4 sm:pt-5 md:pt-6 mt-4 sm:mt-5 md:mt-6">
                <p className="font-semibold text-sm sm:text-base text-[#f5f3ee] text-center">
                  Peace is not merely the absence of conflict - it is the active presence of understanding,
                  compassion, and recognition of our shared humanity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 section-premium">
        <div className="container mx-auto max-w-4xl">
          <div className="gradient-border p-6 sm:p-8 md:p-10 lg:p-12 text-center">
            <div className="pulse-glow inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#27AE60] mb-4 sm:mb-6">
              <Sparkles className="w-7 h-7 sm:w-9 sm:h-9 text-[#f5f3ee]" />
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 px-4">
              Join Our Peace Movement
            </h2>
            <p className="text-xs sm:text-lg md:text-xl text-premium mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Every act of understanding, every bridge built, every heart opened contributes to a more
              peaceful world. Be part of this transformation.
            </p>
            <Link href="/join" className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 inline-flex items-center">
              <span>Get Involved</span>
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function InitiativeCard({ initiative }: { initiative: PeaceInitiative }) {
  const statusColors: Record<string, string> = {
    active: 'bg-[#27AE60] text-[#f5f3ee]',
    completed: 'bg-[#C8A75E] text-[#f5f3ee]',
    planned: 'bg-[#D4A07B] text-[#f5f3ee]',
  }

  return (
    <div className="event-card p-6 sm:p-8 md:p-10 group flex flex-col h-full">

      {/* TOP SECTION */}
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-5 md:mb-6 gap-3">

        {/* ✅ FIXED TITLE HEIGHT */}
        <h3 className="text-2xl md:text-3xl heading-premium text-[#f5f3ee] 
        group-hover:text-[#c8a75e] transition-colors 
        min-h-[3.5rem] flex items-start flex-1">
          {initiative.title}
        </h3>

        {/* STATUS */}
        <span
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold shadow-lg 
          ${initiative.status ? statusColors[initiative.status] || 'bg-gray-500 text-[#f5f3ee]' : 'bg-gray-500 text-[#f5f3ee]'} 
          uppercase tracking-wider whitespace-nowrap`}
        >
          {initiative.status || 'Unknown'}
        </span>
      </div>

      {/* ✅ FIXED DESCRIPTION */}
      <p className="text-premium mb-4 sm:mb-5 md:mb-6 leading-relaxed text-base sm:text-lg 
      min-h-[5rem] line-clamp-3">
        {initiative.description}
      </p>

      {/* ✅ PUSH IMPACT SECTION DOWN */}
      <div className="mt-auto">
        <div className="glass-effect p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-gray-100">

          <div className="flex flex-col gap-2">

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-[#C8A75E] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#f5f3ee]" />
              </div>

              <h4 className="font-bold text-[#f5f3ee] uppercase tracking-wider text-xs sm:text-sm">
                Impact
              </h4>
            </div>

            {/* ✅ FIXED IMPACT HEIGHT */}
            <p className="text-premium leading-relaxed text-sm sm:text-base min-h-[4rem] line-clamp-3">
              {initiative.impact}
            </p>

          </div>
        </div>
      </div>

    </div>
  )
}