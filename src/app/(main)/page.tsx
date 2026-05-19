'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Flame, Heart, Lightbulb, HandHeart, Globe as Globe2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { getTraditions, getTeachings } from '@/actions/database'

interface Tradition {
  id: string
  name: string
}

interface Teaching {
  id: string
  title: string
}

interface CorePillar {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

const iconMap: Record<string, React.ReactNode> = {
  Heart: <Heart className="w-10 h-10" />,
  Lightbulb: <Lightbulb className="w-10 h-10" />,
  HandHeart: <HandHeart className="w-10 h-10" />,
  Flame: <Flame className="w-10 h-10" />,
  Globe2: <Globe2 className="w-10 h-10" />,
  BookOpen: <BookOpen className="w-10 h-10" />,
}

export default function Home() {
  const [traditions, setTraditions] = useState<Tradition[]>([])
  const [teachings, setTeachings] = useState<Teaching[]>([])
  const [corePillars, setCorePillars] = useState<CorePillar[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const [traditionsResult, teachingsResult] = await Promise.all([
      getTraditions(),
      getTeachings(6),
    ])

    if (traditionsResult.data) setTraditions(traditionsResult.data)
    if (teachingsResult.data) setTeachings(teachingsResult.data)

    try {
      const res = await fetch('/api/core-pillars')
      if (res.ok) setCorePillars(await res.json())
    } catch (err) {
      console.error('Error fetching core pillars:', err)
    }
  }

  return (
    <div>
      <section className="relative section-premium pt-32 sm:pt-28 md:pt-32 lg:pt-36 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-[#c8a75e]/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-[#d4b56d]/30 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[#e6d5a8]/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div> */}

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="floating-accent mb-5 sm:mb-6 md:mb-7">
              <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-xl shadow-premium">
                <Flame className="w-4 h-4 sm:w-4 sm:h-4 text-[#d4a07b] animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-[#C8A75E]">
                  Bearer of Sufi Wisdom
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl heading-premium text-[#f5f3ee] mb-5 sm:mb-6 md:mb-7 leading-[1.15] px-2">
              Uniting Hearts Through
              <span className="block gradient-text mt-2 sm:mt-2.5 md:mt-3 animate-gradient">Divine Love & Understanding</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl text-premium max-w-3xl mx-auto mb-7 sm:mb-8 md:mb-9 leading-relaxed font-light px-4">
              A sacred space to eliminate hatred, dispel misconceptions, and discover the universal truths
              that bind all faiths together in peace, compassion, and divine love.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12 md:mb-14 px-4">
              <Link href="/assessment" className="btn-primary text-sm sm:text-base px-6 sm:px-7 md:px-8 py-3 sm:py-3 inline-flex items-center justify-center shadow-premium">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span>Take Faith Assessment</span>
              </Link>
              <Link href="/join" className="btn-secondary text-sm sm:text-base px-6 sm:px-7 md:px-8 py-3 sm:py-3 inline-flex items-center justify-center">
                <span>Join the Movement</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-4xl mx-auto px-4">
              <StatCard number={traditions.length} label="Faith Traditions" />
              <StatCard number="∞" label="Divine Love" />
              <StatCard number={teachings.length} label="Sacred Teachings" />
              <StatCard number="1" label="Humanity" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4">
              Our Sacred Mission
            </h2>
            <div className="divider-premium max-w-xs mx-auto mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base md:text-lg text-premium max-w-3xl mx-auto px-4">
              Guided by Sufi wisdom, we illuminate the path to interfaith harmony
            </p>
          </div>

          <div className="feature-grid">
            {corePillars.length > 0 ? (
              corePillars.map((pillar) => (
                <MissionCard
                  key={pillar.id}
                  icon={iconMap[pillar.icon] || <Heart className="w-10 h-10" />}
                  title={pillar.title}
                  description={pillar.description}
                  gradient={pillar.color ? `from-[${pillar.color}] to-[${pillar.color}]` : ''}
                />
              ))
            ) : (
              <>
                <MissionCard icon={<Heart className="w-10 h-10" />} title="Eliminate Hatred" description="Through divine love and understanding, we dissolve the barriers of prejudice and fear that separate hearts." gradient="from-[#e07070] to-[#e74c3c]" />
                <MissionCard icon={<Lightbulb className="w-10 h-10" />} title="Dispel Misconceptions" description="Illuminate truth by addressing falsehoods and revealing the authentic beauty of each tradition." gradient="from-[#d4a07b] to-[#d4a07b]" />
                <MissionCard icon={<HandHeart className="w-10 h-10" />} title="Foster Unity" description="Discover the universal thread of compassion, mercy, and love woven through all spiritual paths." gradient="from-[#c8a75e] to-[#d4b56d]" />
                <MissionCard icon={<Flame className="w-10 h-10" />} title="Sufi Teachings" description="Share the timeless wisdom of Sufism, the path of divine love that embraces all of humanity." gradient="from-[#d4a07b] to-[#e07070]" />
                <MissionCard icon={<Globe2 className="w-10 h-10" />} title="Global Peace" description="Build bridges of understanding that span cultures, languages, and traditions worldwide." gradient="from-[#27ae60] to-[#16a085]" />
                <MissionCard icon={<BookOpen className="w-10 h-10" />} title="Sacred Knowledge" description="Preserve and share the profound wisdom that guides seekers toward truth and enlightenment." gradient="from-[#9b59b6] to-[#c8b4e8]" />
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 section-premium">
        <div className="container mx-auto max-w-4xl">
          <div className="gradient-border p-6 sm:p-7 md:p-9 lg:p-10 text-center">
            <div className="pulse-glow inline-flex p-3 sm:p-3.5 rounded-xl bg-[#C8A75E] mb-4 sm:mb-5">
              <Heart className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-[#0b0f2a]" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl heading-premium text-[#f5f3ee] mb-4 sm:mb-5 px-4">
              Join the Movement for Peace
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-premium mb-6 sm:mb-7 max-w-2xl mx-auto leading-relaxed px-4">
              Together, we can create a world where love triumphs over hate,
              understanding dissolves fear, and all hearts recognize their shared divine origin.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link href="/join" className="btn-primary text-sm sm:text-base px-6 sm:px-7 md:px-8 py-3 inline-flex items-center justify-center">
                <span>Join the Movement</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Link>
              <Link href="/mission" className="btn-secondary text-sm sm:text-base px-6 sm:px-7 md:px-8 py-3">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({ number, label }: { number: string | number; label: string }) {
  return (
    <div className="card-premium p-3 sm:p-4 md:p-5 lg:p-6 text-center group">
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-[#C8A75E] mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform duration-500">
        {number}
      </div>
      <div className="text-xs sm:text-xs md:text-sm text-[#aab0d6] font-semibold uppercase tracking-wider">{label}</div>
    </div>
  )
}

function MissionCard({ icon, title, description, gradient }: any) {
  return (
    <div className="tradition-card p-5 sm:p-6 md:p-7 group">
      <div className="icon-circle mb-4 sm:mb-5 group-hover:shadow-2xl">
        <div className="text-[#0B0F2A] [&>svg]:w-7 [&>svg]:h-7 sm:[&>svg]:w-8 sm:[&>svg]:h-8 md:[&>svg]:w-9 md:[&>svg]:h-9">{icon}</div>
      </div>
      <h3 className="text-lg sm:text-xl md:text-2xl heading-premium text-[#f5f3ee] mb-2.5 sm:mb-3">{title}</h3>
      <p className="text-sm sm:text-base text-premium leading-relaxed">{description}</p>
    </div>
  )
}




// from-[#0e122a] via-[#141a3b] to-[#0e122a]
