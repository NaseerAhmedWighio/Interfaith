import { Heart, Lightbulb, HandHeart, Flame, Globe as Globe2, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Mission | Interfaith Peace Bridge',
  description: 'Rooted in the timeless wisdom of Sufism, we dedicate ourselves to building bridges of understanding, eliminating hatred, and revealing the divine unity that connects all hearts.',
}

export default function Mission() {
  return (
    <div>
      <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4a07b]" />
            <span className="text-xs sm:text-sm font-semibold text-[#C8A75E]">
              Our Sacred Purpose
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight px-4">
            Our Mission for
            <span className="block text-[#C8A75E] mt-2">Interfaith Harmony</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed max-w-3xl mx-auto px-4">
            Rooted in the timeless wisdom of Sufism, we dedicate ourselves to building bridges
            of understanding, eliminating hatred, and revealing the divine unity that connects all hearts.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">
              Core Pillars of Our Work
            </h2>
            <div className="divider-premium max-w-xs mx-auto"></div>
          </div>

          <div className="feature-grid">
            <MissionCard
              icon={<Heart className="w-8 h-8" />}
              title="Eliminate Hatred"
              description="Through divine love and understanding, we dissolve the barriers of prejudice and fear that separate hearts. We believe that when hearts are purified through spiritual practice, they become mirrors reflecting the Divine Light in all beings."
              color="#E07070"
            />
            <MissionCard
              icon={<Lightbulb className="w-8 h-8" />}
              title="Dispel Misconceptions"
              description="Illuminate truth by addressing falsehoods and revealing the authentic beauty of each tradition. Through education and compassionate dialogue, we replace ignorance with understanding and fear with appreciation."
              color="#D4A07B"
            />
            <MissionCard
              icon={<HandHeart className="w-8 h-8" />}
              title="Foster Unity"
              description="Discover the universal thread of compassion, mercy, and love woven through all spiritual paths. We celebrate both the unique beauty of each tradition and the shared essence that unites all seekers of truth."
              color="#C8A75E"
            />
            <MissionCard
              icon={<Flame className="w-8 h-8" />}
              title="Share Sufi Wisdom"
              description="Share the timeless wisdom of Sufism, the path of divine love that embraces all of humanity. Sufi teachings remind us that all rivers of faith flow toward the same infinite ocean of Divine Truth."
              color="#D4A07B"
            />
            <MissionCard
              icon={<Globe2 className="w-8 h-8" />}
              title="Build Global Peace"
              description="Build bridges of understanding that span cultures, languages, and traditions worldwide. We envision a world where diversity is celebrated as a reflection of divine creativity and unity."
              color="#27AE60"
            />
            <MissionCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Preserve Sacred Knowledge"
              description="Preserve and share the profound wisdom that guides seekers toward truth and enlightenment. We honor the sacred texts, teachings, and practices of all traditions as pathways to the Divine."
              color="#9B59B6"
            />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-4xl">
          <div className="card-premium p-6 sm:p-8 md:p-10 lg:p-12">
            <h2 className="text-2xl sm:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 text-center px-4">
              The Sufi Path to Interfaith Harmony
            </h2>
            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base text-premium leading-relaxed">
              <p>
                Sufism teaches that the Divine is infinite and cannot be contained by any single form or expression.
                Just as the sun's light illuminates countless windows, each with its own unique color and character,
                the Divine Light manifests through diverse spiritual traditions, each offering a unique window into the infinite.
              </p>
              <p>
                At the heart of Sufism is the principle of Divine Love - a love that sees beyond superficial differences
                to recognize the sacred essence in every being. This love does not tolerate hatred, because when one truly
                sees with the eye of the heart, one recognizes that harming another is harming oneself.
              </p>
              <p>
                We carry forward this Sufi wisdom as a torch to light the path toward interfaith understanding. By purifying
                our hearts of prejudice, seeking knowledge over ignorance, and choosing compassion over judgment, we become
                living bridges between communities that might otherwise remain divided.
              </p>
              <p className="font-semibold text-sm sm:text-base md:text-lg text-[#c8a75e]">
                Our mission is not to erase the beautiful diversity of spiritual traditions, but to reveal the unity
                that already exists beneath the surface - the unity of hearts seeking truth, peace, and divine connection.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function MissionCard({ icon, title, description, color }: any) {
  return (
    <div className="tradition-card p-6 sm:p-7 md:p-8">
      <div className='flex flex-row md:flex-col justify-start items-center gap-3 md:gap-0'>
      <div className={`icon-circle mb-4 sm:mb-5 md:mb-6`} style={{ backgroundColor: color }}>
        <div className="text-[#f5f3ee] [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-7 sm:[&>svg]:h-7 md:[&>svg]:w-10 md:[&>svg]:h-10">{icon}</div>
      </div>
      <h3 className="text-xl sm:text-2xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4">{title}</h3>
      </div>
      <p className="text-sm sm:text-base text-premium leading-relaxed">{description}</p>
    </div>
  )
}
