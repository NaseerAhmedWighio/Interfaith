import { Target, Users, BookOpen, Heart, MessageCircle, Globe as Globe2, Lightbulb, HandHeart } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Approach to Unity | Interfaith Peace Bridge',
  description: 'A proven methodology combining ancient wisdom with modern engagement strategies to build lasting bridges across faith traditions.',
}

export default function OurApproach() {
  return (
    <div>
      <section className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4b56d]" />
            <span className="text-xs sm:text-sm font-semibold text-[#C8A75E]">
              Our Methodology
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl heading-premium text-[#f5f3ee] mb-4 sm:mb-6 leading-tight px-4">
            Our
            <span className="block text-[#C8A75E] mt-2">Approach to Unity</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-premium leading-relaxed max-w-3xl mx-auto px-4">
            A proven methodology combining ancient wisdom with modern engagement strategies
            to build lasting bridges across faith traditions.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl heading-premium text-[#f5f3ee] mb-3 sm:mb-4 px-4">Four Pillars of Our Work</h2>
            <div className="divider-premium max-w-xs mx-auto mb-8 sm:mb-10"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-7 md:gap-8 mb-12 sm:mb-16 md:mb-20">
            <PillarCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Education & Learning"
              description="We believe understanding comes before unity. Our educational programs demystify religious traditions, correct misconceptions, and highlight shared values across faiths."
              features={[
                'Interfaith study circles',
                'Sacred text exploration workshops',
                'Online courses on world religions',
                'Scholar-led seminars and webinars',
              ]}
              color="#C8A75E"
            />
            <PillarCard
              icon={<MessageCircle className="w-8 h-8" />}
              title="Dialogue & Exchange"
              description="Creating safe, sacred spaces where people of different faiths can speak from the heart, listen deeply, and discover our common humanity."
              features={[
                'Facilitated interfaith dialogues',
                'Community conversation circles',
                'Virtual global gatherings',
                'One-on-one faith pairing programs',
              ]}
              color="#9B59B6"
            />
            <PillarCard
              icon={<HandHeart className="w-8 h-8" />}
              title="Service & Action"
              description="Faith without action is incomplete. We unite diverse communities through collaborative service projects that address real needs."
              features={[
                'Interfaith volunteer initiatives',
                'Community development projects',
                'Disaster relief partnerships',
                'Social justice advocacy',
              ]}
              color="#E07070"
            />
            <PillarCard
              icon={<Heart className="w-8 h-8" />}
              title="Spiritual Practice"
              description="Shared contemplative practices create heart connections that transcend intellectual understanding and theological differences."
              features={[
                'Interfaith meditation gatherings',
                'Peace prayer ceremonies',
                'Sufi-inspired spiritual retreats',
                'Contemplative practice workshops',
              ]}
              color="#D4A07B"
            />
          </div>

          <div className="card-premium p-12 text-center">
            <Lightbulb className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto mb-6 text-[#d4b56d]" />
            <h3 className="text-3xl heading-premium text-[#f5f3ee] mb-6">Our Philosophy</h3>
            <p className="text-xl text-premium leading-relaxed max-w-3xl mx-auto">
              We don't seek to create a new religion or minimize differences. Instead, we honor
              the unique beauty of each tradition while recognizing that all authentic spiritual
              paths lead to the same Source. Unity in diversity, not uniformity.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sacred-pattern">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl heading-premium text-[#f5f3ee] mb-4">Our Methodology in Action</h2>
            <div className="divider-premium max-w-xs mx-auto mb-6"></div>
            <p className="text-xl text-premium max-w-3xl mx-auto">
              A step-by-step process for building genuine interfaith understanding
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            <StepCard
              number="1"
              title="Connect"
              description="Bring people together in welcoming, inclusive spaces"
              color="#C8A75E"
            />
            <StepCard
              number="2"
              title="Learn"
              description="Share knowledge about different faith traditions authentically"
              color="#9B59B6"
            />
            <StepCard
              number="3"
              title="Relate"
              description="Find common ground through shared values and experiences"
              color="#14B8A6"
            />
            <StepCard
              number="4"
              title="Serve"
              description="Work together on meaningful projects that benefit communities"
              color="#D4A07B"
            />
            <StepCard
              number="5"
              title="Transform"
              description="Become ambassadors of peace in your own circles"
              color="#E07070"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl heading-premium text-[#f5f3ee] mb-4">Core Principles</h2>
            <div className="divider-premium max-w-xs mx-auto mb-12"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PrincipleCard
              title="Mutual Respect"
              description="We honor each tradition's integrity, authenticity, and sacred teachings. No faith is superior or inferior; each is a valid path to the Divine."
              icon={<Users className="w-10 h-10 text-[#c8a75e]" />}
            />
            <PrincipleCard
              title="Deep Listening"
              description="We create spaces for genuine dialogue where people feel truly heard. Understanding precedes agreement, and connection transcends conversion."
              icon={<MessageCircle className="w-10 h-10 text-[#d4b56d]" />}
            />
            <PrincipleCard
              title="Heart-Centered Approach"
              description="We engage from the heart, not just the head. Spiritual connection and lived experience complement intellectual understanding."
              icon={<Heart className="w-10 h-10 text-rose-600" />}
            />
            <PrincipleCard
              title="Collaborative Spirit"
              description="We work with, not for, communities. Local leaders and participants co-create programs that reflect their unique contexts and needs."
              icon={<HandHeart className="w-10 h-10 text-amber-600" />}
            />
            <PrincipleCard
              title="Action-Oriented"
              description="Dialogue without action is incomplete. We translate understanding into concrete initiatives that create positive change."
              icon={<Target className="w-10 h-10 text-violet-600" />}
            />
            <PrincipleCard
              title="Global-Local Balance"
              description="We maintain a global vision while honoring local contexts, cultures, and specific interfaith dynamics in each community."
              icon={<Globe2 className="w-10 h-10 text-emerald-600" />}
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl heading-premium text-[#f5f3ee] mb-6">What Makes Us Different?</h2>
              <div className="divider-premium max-w-xs mb-8"></div>
              <div className="space-y-6">
                <DifferentiatorItem
                  title="Rooted in Tradition, Open to All"
                  description="While grounded in Sufi wisdom, we welcome people of all faiths and none. Our Sufi foundation provides spiritual depth without exclusivity."
                />
                <DifferentiatorItem
                  title="Experience Over Theory"
                  description="We emphasize lived experience and personal transformation, not just academic knowledge or theological debate."
                />
                <DifferentiatorItem
                  title="Sustainable Relationships"
                  description="We're not interested in one-time events. We build long-term relationships and communities that continue growing together."
                />
                <DifferentiatorItem
                  title="Grassroots Empowerment"
                  description="We train local leaders to facilitate interfaith work in their own communities, creating a multiplier effect."
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="card-premium p-8">
                <h3 className="text-2xl heading-premium text-[#f5f3ee] mb-4">Success Metrics</h3>
                <p className="text-premium mb-6">We measure our impact through:</p>
                <ul className="space-y-3 text-premium">
                  <li className="flex items-start">
                    <span className="text-[#d4b56d] mr-2 mt-1">✓</span>
                    <span>Number of lasting friendships formed across faith lines</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d4b56d] mr-2 mt-1">✓</span>
                    <span>Community projects completed collaboratively</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d4b56d] mr-2 mt-1">✓</span>
                    <span>Participants reporting reduced prejudice and increased understanding</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d4b56d] mr-2 mt-1">✓</span>
                    <span>New interfaith initiatives launched by trained leaders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d4b56d] mr-2 mt-1">✓</span>
                    <span>Stories of personal transformation and spiritual growth</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0F2A] text-[#f5f3ee]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to Experience Our Approach?
          </h2>
          <p className="text-xl opacity-90 leading-relaxed mb-8">
            Join us in building a world where religious diversity enriches rather than divides.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join" className="btn-primary text-lg px-10 py-4 bg-[#c8a75e] text-[#0b0f2a] hover:text-[#c8a75e] hover:bg-[#c8a75e]/20">
              Join the Movement
            </Link>
            <Link href="/peace" className="btn-secondary text-lg px-10 py-4 border-2 border-[#c8a75e] text-[#f5f3ee] hover:bg-[#c8a75e]">
              View Our Initiatives
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function PillarCard({ icon, title, description, features, color }: any) {
  return (
    <div className="card-premium p-8">
      <div className={`w-14 h-14 mb-6 rounded-xl flex items-center justify-center shadow-xl`} style={{ backgroundColor: color }}>
        <div className="text-[#f5f3ee]">{icon}</div>
      </div>
      <h3 className="text-2xl heading-premium text-[#f5f3ee] mb-4">{title}</h3>
      <p className="text-premium leading-relaxed mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start text-sm text-premium">
            <span className="text-[#d4b56d] mr-2 mt-1">•</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepCard({ number, title, description, color }: any) {
  return (
    <div className="text-center">
      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center text-[#f5f3ee] font-bold text-2xl shadow-xl`} style={{ backgroundColor: color }}>
        {number}
      </div>
      <h3 className="text-lg heading-premium text-[#f5f3ee] mb-2">{title}</h3>
      <p className="text-premium text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function PrincipleCard({ title, description, icon }: any) {
  return (
    <div className="tradition-card p-8">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl heading-premium text-[#f5f3ee] mb-3">{title}</h3>
      <p className="text-premium leading-relaxed">{description}</p>
    </div>
  )
}

function DifferentiatorItem({ title, description }: any) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-2 h-2 bg-[#141a3a]0 rounded-full mt-2 flex-shrink-0"></div>
      <div>
        <h4 className="font-bold text-[#f5f3ee] mb-2">{title}</h4>
        <p className="text-premium leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
