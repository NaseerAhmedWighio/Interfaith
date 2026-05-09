import { Users, Heart, Globe as Globe2, BookHeart, Sparkles, Target } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Interfaith Peace Bridge',
  description: 'A global movement dedicated to building bridges of understanding, compassion, and unity across all faith traditions through the timeless wisdom of Sufism.',
}

export default function AboutUs() {
  return (
    <div>
      <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#c8a75e]" />
            <span className="text-xs sm:text-sm font-semibold text-[#C8A75E]">
              Who We Are
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight px-4">
            About
            <span className="block text-[#C8A75E] mt-2">Interfaith Peace Bridge</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed max-w-3xl mx-auto px-4">
            A global movement dedicated to building bridges of understanding, compassion, and unity
            across all faith traditions through the timeless wisdom of Sufism.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center mb-12 sm:mb-16 md:mb-20">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 px-4 sm:px-0">Our Story</h2>
              <div className="divider-premium max-w-xs mb-6 sm:mb-8 mx-4 sm:mx-0"></div>
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-premium leading-relaxed px-4 sm:px-0">
                <p>
                  Founded in 2018, Interfaith Peace Bridge emerged from a simple yet profound vision:
                  to create a world where religious differences become opportunities for dialogue rather
                  than division.
                </p>
                <p>
                  Inspired by the universal teachings of Sufi masters who saw all religions as paths to
                  the same divine truth, we began as a small group of seekers from diverse faith backgrounds
                  meeting in community centers and homes.
                </p>
                <p>
                  Today, we've grown into a global network of over 50,000 members across 75 countries,
                  united in our commitment to peace, understanding, and the recognition of our shared humanity.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="card-premium p-8 sm:p-10 md:p-12 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-xl bg-[#C8A75E] flex items-center justify-center shadow-2xl">
                  <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-[#f5f3ee]" />
                </div>
                <h3 className="text-xl sm:text-2xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4">Our Vision</h3>
                <p className="text-sm sm:text-base text-premium leading-relaxed">
                  A world where every human being recognizes the divine spark in every other,
                  transcending the boundaries of religion, culture, and nationality to embrace
                  our fundamental interconnectedness.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">Our Core Values</h2>
            <div className="divider-premium max-w-xs mx-auto mb-6 sm:mb-8"></div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <ValueCard
              icon={<Heart className="w-10 h-10" />}
              title="Universal Love"
              description="We believe that love is the essence of all spiritual traditions and the foundation for lasting peace."
              color="#E07070"
            />
            <ValueCard
              icon={<Globe2 className="w-10 h-10" />}
              title="Inclusivity"
              description="Every faith, every tradition, every seeker is welcomed and honored in our community."
              color="#C8A75E"
            />
            <ValueCard
              icon={<BookHeart className="w-10 h-10" />}
              title="Sacred Wisdom"
              description="We draw from the deep wells of Sufi teachings while honoring the truth in all spiritual paths."
              color="#D4A07B"
            />
            <ValueCard
              icon={<Users className="w-10 h-10" />}
              title="Community"
              description="Together we are stronger. We build meaningful connections that transcend superficial differences."
              color="#27AE60"
            />
            <ValueCard
              icon={<Sparkles className="w-10 h-10" />}
              title="Transformation"
              description="We commit to inner growth and outer action, becoming agents of positive change in our world."
              color="#9B59B6"
            />
            <ValueCard
              icon={<Target className="w-10 h-10" />}
              title="Authenticity"
              description="We practice what we teach, grounding our mission in genuine spiritual experience and integrity."
              color="#14B8A6"
            />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 sacred-pattern">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">Our Leadership</h2>
            <div className="divider-premium max-w-xs mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-premium max-w-3xl mx-auto px-4">
              Guided by scholars, spiritual teachers, and interfaith activists committed to our mission
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <LeaderCard
              name="Dr. Amina Hassan"
              role="Founder & Spiritual Director"
              description="Sufi scholar and interfaith dialogue facilitator with 25 years of experience bridging religious communities."
            />
            <LeaderCard
              name="Rabbi David Cohen"
              role="Director of Interfaith Programs"
              description="Dedicated to Jewish-Muslim dialogue and building coalitions for peace across Abrahamic traditions."
            />
            <LeaderCard
              name="Rev. Maria Santos"
              role="Community Engagement Lead"
              description="Christian mystic and community organizer passionate about grassroots interfaith movements."
            />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">Our Impact</h2>
            <div className="divider-premium max-w-xs mx-auto mb-8 sm:mb-12"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <ImpactStat number="50,000+" label="Active Members" />
            <ImpactStat number="75" label="Countries Reached" />
            <ImpactStat number="1,200+" label="Dialogue Events" />
            <ImpactStat number="500+" label="Community Partners" />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A] text-[#f5f3ee]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight px-4">
            Join Us in Building Bridges
          </h2>
          <p className="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed mb-6 sm:mb-8 px-4">
            Be part of a global movement transforming interfaith relations, one conversation at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/join" className="btn-primary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-[#0b0f2a] text-[#0b0f2a] hover:bg-[#c8a75e]/10">
              Join the Movement
            </Link>
            <Link href="/subscribe" className="btn-secondary text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 border-2 border-[#c8a75e] text-[#f5f3ee] hover:bg-[#0b0f2a]/10">
              Subscribe to Newsletter
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function ValueCard({ icon, title, description, color }: any) {
  return (
    <div className="tradition-card p-6 sm:p-7 md:p-8 text-center group">
      <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl`} style={{ backgroundColor: color }}>
        <div className="text-[#f5f3ee] [&>svg]:w-8 [&>svg]:h-8 sm:[&>svg]:w-9 sm:[&>svg]:h-9 md:[&>svg]:w-10 md:[&>svg]:h-10">{icon}</div>
      </div>
      <h3 className="text-lg sm:text-xl heading-premium text-[#f5f3ee] mb-2 sm:mb-3">{title}</h3>
      <p className="text-premium text-xs sm:text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function LeaderCard({ name, role, description }: any) {
  return (
    <div className="card-premium p-6 sm:p-7 md:p-8 text-center">
      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-xl bg-[#6B7280] flex items-center justify-center">
        <Users className="w-10 h-10 sm:w-12 sm:h-12 text-[#f5f3ee]" />
      </div>
      <h3 className="text-lg sm:text-xl heading-premium text-[#f5f3ee] mb-2">{name}</h3>
      <p className="text-xs sm:text-sm font-semibold text-[#c8a75e] mb-3 sm:mb-4">{role}</p>
      <p className="text-premium text-xs sm:text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function ImpactStat({ number, label }: any) {
  return (
    <div className="glass-effect p-6 sm:p-7 md:p-8 rounded-xl text-center">
      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#C8A75E] mb-2 sm:mb-3">{number}</div>
      <div className="text-xs sm:text-sm text-[#aab0d6]/80 font-semibold uppercase tracking-wider">{label}</div>
    </div>
  )
}
