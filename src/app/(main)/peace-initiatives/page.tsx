import { Heart, Users, Globe as Globe2, BookOpen, HandHeart, Sparkles, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Peace Initiatives | Interfaith Peace Bridge',
  description: 'Active programs and collaborative projects bringing people of all faiths together to create lasting peace in communities around the world.',
}

export default function PeaceInitiatives() {
  return (
    <div>
      <section className="section-premium pt-28 md:pt-36 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center space-x-2 glass-effect px-6 py-3 rounded-xl mb-6">
            <Heart className="w-5 h-5 text-rose-500" />
            <span className="text-sm font-semibold text-[#E07070]">
              Building Peace Together
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl heading-premium text-[#f5f3ee] mb-6 leading-tight">
            Peace
            <span className="block text-[#C8A75E] mt-2">Initiatives</span>
          </h1>

          <p className="text-xl text-premium leading-relaxed max-w-3xl mx-auto">
            Active programs and collaborative projects bringing people of all faiths together
            to create lasting peace in communities around the world.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl heading-premium text-[#f5f3ee] mb-4">Our Current Initiatives</h2>
            <div className="divider-premium max-w-xs mx-auto mb-12"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <InitiativeCard
              title="Global Dialogue Series"
              category="Interfaith Dialogue"
              description="Monthly virtual gatherings bringing together faith leaders, scholars, and practitioners from around the world to discuss pressing global issues through an interfaith lens."
              impact="12,000+ participants across 65 countries"
              nextEvent="May 15, 2026 - Climate Justice & Sacred Stewardship"
              color="#C8A75E"
              icon={<Globe2 className="w-8 h-8" />}
            />
            <InitiativeCard
              title="Community Peace Circles"
              category="Grassroots Peacebuilding"
              description="Facilitated small-group dialogues in local communities where neighbors of different faiths share stories, build relationships, and collaborate on community projects."
              impact="450+ active circles in 28 countries"
              nextEvent="Weekly circles ongoing - Find one near you"
              color="#27AE60"
              icon={<Users className="w-8 h-8" />}
            />
            <InitiativeCard
              title="Interfaith Youth Leadership Program"
              category="Youth Empowerment"
              description="Year-long intensive training for young adults (18-30) to become interfaith leaders in their communities, combining theological education, leadership skills, and hands-on peacebuilding."
              impact="200+ graduates serving in 40 countries"
              nextEvent="Applications open June 2026 for 2027 cohort"
              color="#9B59B6"
              icon={<Sparkles className="w-8 h-8" />}
            />
            <InitiativeCard
              title="Sacred Service Days"
              category="Community Service"
              description="Quarterly interfaith volunteer events where people of all faiths work together on community projects - from feeding the hungry to environmental restoration."
              impact="25,000+ volunteers, 150+ projects completed"
              nextEvent="June 21, 2026 - Summer Solstice Service Day"
              color="#D4A07B"
              icon={<HandHeart className="w-8 h-8" />}
            />
          </div>

          <div className="card-premium p-12 text-center">
            <h3 className="text-3xl heading-premium text-[#f5f3ee] mb-6">2026 Impact Goals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <ImpactGoal number="100K" label="Active Participants" />
              <ImpactGoal number="100" label="Countries Reached" />
              <ImpactGoal number="1,000" label="Peace Circles" />
              <ImpactGoal number="500" label="Community Projects" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sacred-pattern">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl heading-premium text-[#f5f3ee] mb-4">Featured Programs</h2>
            <div className="divider-premium max-w-xs mx-auto mb-12"></div>
          </div>

          <div className="space-y-12">
            <ProgramCard
              title="Wisdom Exchange"
              description="A unique program pairing spiritual practitioners from different traditions for one-on-one exchange over 6 months. Participants learn about each other's practices, attend each other's services, and develop lasting friendships."
              details={[
                'Duration: 6 months',
                'Format: Monthly in-person or virtual meetings',
                'Commitment: 2-3 hours per month',
                'Outcome: Interfaith friendship certificate',
              ]}
              testimonial={{
                text: "Being paired with a Hindu priest transformed my understanding of prayer and devotion. We've become lifelong friends and now co-teach workshops together.",
                author: "Father Michael O'Brien, Catholic Priest"
              }}
            />
            <ProgramCard
              title="Peacebuilding Toolkit Training"
              description="Comprehensive training program teaching practical skills for interfaith dialogue facilitation, conflict resolution, and community organizing. Graduates receive certification and ongoing support."
              details={[
                'Duration: 3-month intensive',
                'Format: Weekly online sessions + retreat',
                'Topics: Facilitation, mediation, trauma healing',
                'Includes: Toolkit, certification, mentorship',
              ]}
              testimonial={{
                text: "The skills I learned helped me mediate a major conflict between religious communities in my city. This training literally helped prevent violence.",
                author: "Aisha Rahman, Community Organizer"
              }}
            />
            <ProgramCard
              title="Sacred Spaces Open House"
              description="Annual global event where houses of worship open their doors for neighbors to visit, learn, and experience worship from different traditions. Creates direct, positive encounters with religious diversity."
              details={[
                'Date: First weekend of October',
                'Participation: 2,500+ congregations globally',
                'Format: Tours, Q&A, shared meals',
                'Materials: Free promotional toolkit provided',
              ]}
              testimonial={{
                text: "Hosting Open House brought 300 neighbors into our synagogue who had never entered before. Many said it dissolved years of misconceptions.",
                author: "Rabbi Sarah Goldstein"
              }}
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl heading-premium text-[#f5f3ee] mb-4">Regional Initiatives</h2>
            <div className="divider-premium max-w-xs mx-auto mb-12"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <RegionCard
              region="Middle East & North Africa"
              initiatives={[
                'Jerusalem Interfaith Youth Network',
                'Abrahamic Family Houses dialogue',
                'Egypt-based Sufi peace councils',
                'Lebanon refugee support program',
              ]}
              icon={<MapPin className="w-8 h-8" />}
            />
            <RegionCard
              region="Asia Pacific"
              initiatives={[
                'India-Pakistan peace bridge',
                'Buddhist-Muslim dialogue in Myanmar',
                'Indonesian interfaith disaster response',
                'Singapore harmony circles',
              ]}
              icon={<MapPin className="w-8 h-8" />}
            />
            <RegionCard
              region="Europe"
              initiatives={[
                'UK mosque-church partnerships',
                'French interfaith youth camps',
                'German integration dialogue',
                'Balkans reconciliation program',
              ]}
              icon={<MapPin className="w-8 h-8" />}
            />
            <RegionCard
              region="North America"
              initiatives={[
                'US campus interfaith network',
                'Canadian truth & reconciliation',
                'Mexico indigenous-Catholic dialogue',
                'Multi-faith disaster chaplaincy',
              ]}
              icon={<MapPin className="w-8 h-8" />}
            />
            <RegionCard
              region="Latin America"
              initiatives={[
                'Brazil Candomblé-Catholic bridge',
                'Argentina Jewish-Muslim friendship',
                'Colombia peace & reconciliation',
                'Peru indigenous rights advocacy',
              ]}
              icon={<MapPin className="w-8 h-8" />}
            />
            <RegionCard
              region="Africa"
              initiatives={[
                'Nigeria interfaith peace committees',
                'Kenya youth peace ambassadors',
                'South Africa healing circles',
                'Ethiopia Christian-Muslim unity',
              ]}
              icon={<MapPin className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0F2A]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl heading-premium text-[#f5f3ee] mb-6">Get Involved</h2>
              <div className="divider-premium max-w-xs mb-8"></div>
              <p className="text-md md:text-lg lg:text-xl text-premium leading-relaxed mb-8">
                Every initiative needs dedicated people like you. Whether you have 2 hours a month
                or want to launch a program in your community, there's a place for you.
              </p>
              <div className="space-y-6">
                <WayToHelp
                  title="Start a Peace Circle"
                  description="Gather 6-10 people from different traditions in your neighborhood. We provide training and materials."
                />
                <WayToHelp
                  title="Volunteer at Events"
                  description="Help organize dialogue sessions, service days, or cultural celebrations in your area."
                />
                <WayToHelp
                  title="Share Your Story"
                  description="Your interfaith journey can inspire others. Contribute to our blog or speak at events."
                />
                <WayToHelp
                  title="Become a Facilitator"
                  description="Complete our training to lead interfaith dialogues professionally."
                />
              </div>
            </div>
            <div className="card-premium p-6 md:p-8 lg:p-10">
              <div className="text-center mb-8">
                <Calendar className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto mb-4 text-[#c8a75e]" />
                <h3 className="text-xl md:text-2xl heading-premium text-[#f5f3ee] mb-2">Upcoming Events</h3>
              </div>
              <div className="space-y-6">
                <EventItem
                  date="May 15"
                  title="Global Dialogue: Climate Justice"
                  format="Virtual - Global"
                />
                <EventItem
                  date="Jun 1-3"
                  title="Youth Leadership Retreat"
                  format="Barcelona, Spain"
                />
                <EventItem
                  date="Jun 21"
                  title="Summer Solstice Service Day"
                  format="Worldwide - 150+ cities"
                />
                <EventItem
                  date="Jul 10"
                  title="Facilitator Training Program Starts"
                  format="Online - 12 weeks"
                />
              </div>
              <div className="flex mt-8">
                <Link href="/peace" className="btn-primary w-full justify-center text-center">
                  View All Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#0B0F2A] text-[#f5f3ee]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Peace is Not Passive
          </h2>
          <p className="text-md md:text-lg lg:text-xl opacity-90 leading-relaxed mb-8">
            Join us in actively building the bridges that will carry humanity toward a more
            harmonious future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join" className="btn-primary text-lg px-10 py-4 bg-[#0b0f2a] text-[#0b0f2a] hover:bg-[#c8a75e]/10">
              Join the Movement
            </Link>
            <Link href="/peace" className="btn-secondary text-md md:text-lg px-10 py-4 border-2 border-[#c8a75e] text-[#f5f3ee] hover:bg-[#0b0f2a]/10">
              Explore All Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function InitiativeCard({ title, category, description, impact, nextEvent, color, icon }: any) {
  return (
    <div className="card-premium p-8">
      <div className={`w-14 h-14 mb-6 rounded-xl flex items-center justify-center shadow-xl`} style={{ backgroundColor: color }}>
        <div className="text-[#f5f3ee]">{icon}</div>
      </div>
      <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-xl mb-4">
        {category}
      </div>
      <h3 className="text-2xl heading-premium text-[#f5f3ee] mb-4">{title}</h3>
      <p className="text-premium leading-relaxed mb-6">{description}</p>
      <div className="space-y-3 pt-6 border-t border-[#aab0d6]/20">
        <div className="flex items-start text-sm">
          <Users className="w-4 h-4 text-[#c8a75e] mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-premium">{impact}</span>
        </div>
        <div className="flex items-start text-sm">
          <Calendar className="w-4 h-4 text-[#d4b56d] mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-premium">{nextEvent}</span>
        </div>
      </div>
    </div>
  )
}

function ImpactGoal({ number, label }: any) {
  return (
    <div>
      <div className="text-3xl md:text-5xl font-bold text-[#C8A75E] mb-2">{number}</div>
      <div className="text-[10px] md:text-sm text-[#aab0d6]/80 font-semibold uppercase tracking-wider">{label}</div>
    </div>
  )
}

function ProgramCard({ title, description, details, testimonial }: any) {
  return (
    <div className="tradition-card p-5 md:p-8 lg:p-10">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h3 className="text-xl md:text-3xl heading-premium text-[#f5f3ee] mb-4">{title}</h3>
          <p className="md:text-premium leading-relaxed mb-6 text-sm">{description}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {details.map((detail: string, index: number) => (
              <div key={index} className="flex items-start text-sm text-premium">
                <span className="text-[#d4b56d] mr-2 mt-1">•</span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-effect p-6 rounded-xl">
          <BookOpen className="w-5 h-5 md:w-8 md:h-8 text-[#c8a75e] mb-4" />
          <p className="text-sm text-premium italic leading-relaxed mb-4">"{testimonial.text}"</p>
          <p className="text-xs font-bold text-[#aab0d6]">— {testimonial.author}</p>
        </div>
      </div>
    </div>
  )
}

function RegionCard({ region, initiatives, icon }: any) {
  return (
    <div className="card-premium p-3  md:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="text-[#c8a75e]">{icon}</div>
        <h3 className="text-xl heading-premium text-[#f5f3ee]">{region}</h3>
      </div>
      <ul className="space-y-2">
        {initiatives.map((initiative: string, index: number) => (
          <li key={index} className="flex items-start text-sm text-premium">
            <span className="text-[#d4b56d] mr-2 mt-1">•</span>
            <span>{initiative}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function WayToHelp({ title, description }: any) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-2 h-2 bg-[#0b0f2a]0 rounded-full mt-2 flex-shrink-0"></div>
      <div>
        <h5 className="font-bold text-[#f5f3ee] mb-2">{title}</h5>
        <p className="text-premium leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function EventItem({ date, title, format }: any) {
  return (
    <div className="flex items-start space-x-4 pb-4 border-b border-[#aab0d6]/20 last:border-0 last:pb-0">
      <div className="text-center flex-shrink-0">
        <div className="text-lg md:text-2xl font-bold text-[#c8a75e]">{date}</div>
      </div>
      <div>
        <h4 className="font-bold text-md md:text-lg text-[#f5f3ee] mb-1">{title}</h4>
        <p className="text-sm text-premium">{format}</p>
      </div>
    </div>
  )
}
