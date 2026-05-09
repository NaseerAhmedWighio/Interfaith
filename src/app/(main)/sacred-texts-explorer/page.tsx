'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Search, Filter, Globe, Share2, Download, Heart } from 'lucide-react'
import { getTraditions, getSacredTexts, getTextComparisons } from '@/actions/database'

interface Tradition {
  id: string
  name: string
  color?: string
  symbol?: string
}

interface SacredText {
  id: string
  title: string
  source: string
  textContent: string
  theme: string
  context: string | null
  translation: string | null
  traditionId?: string | null
  createdAt?: Date | null
  updatedAt?: Date | null
  tradition?: Tradition | null
}

interface TextComparison {
  id: string
  theme: string
  title: string
  description: string
  texts?: SacredText[]
}

export default function SacredTextsExplorer() {
  const [comparisons, setComparisons] = useState<TextComparison[]>([])
  const [allTexts, setAllTexts] = useState<SacredText[]>([])
  const [selectedTheme, setSelectedTheme] = useState<string>('all')
  const [selectedTradition, setSelectedTradition] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [traditions, setTraditions] = useState<Tradition[]>([])
  const [viewMode, setViewMode] = useState<'comparisons' | 'browse'>('comparisons')

  const themes = [
    { value: 'all', label: 'All Themes', icon: Globe },
    { value: 'love', label: 'Love & Compassion', icon: Heart },
    { value: 'unity', label: 'Unity', icon: Globe },
    { value: 'peace', label: 'Peace', icon: Heart },
    { value: 'wisdom', label: 'Wisdom', icon: BookOpen },
    { value: 'justice', label: 'Justice', icon: BookOpen },
    { value: 'service', label: 'Service', icon: Heart },
    { value: 'forgiveness', label: 'Forgiveness', icon: Heart },
  ]

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [traditionsRes, textsRes, comparisonsRes] = await Promise.all([
        getTraditions(),
        getSacredTexts(),
        getTextComparisons(),
      ])

      if (traditionsRes.data) setTraditions(traditionsRes.data)
      if (textsRes.data) setAllTexts(textsRes.data)
      if (comparisonsRes.data) setComparisons(comparisonsRes.data)
    } catch (error) {
      console.error('Error loading sacred texts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredComparisons = comparisons.filter(comp => {
    if (selectedTheme !== 'all' && comp.theme !== selectedTheme) return false
    if (searchQuery && !comp.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !comp.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const filteredTexts = allTexts.filter(text => {
    if (selectedTheme !== 'all' && text.theme !== selectedTheme) return false
    if (selectedTradition !== 'all' && text.tradition?.id !== selectedTradition) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return text.title.toLowerCase().includes(query) ||
             text.textContent.toLowerCase().includes(query) ||
             text.source.toLowerCase().includes(query) ||
             text.tradition?.name.toLowerCase().includes(query)
    }
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading sacred texts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
            <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gradient-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6 px-4">
            <span className="text-gradient-primary">Sacred Texts</span> Explorer
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-premium-light max-w-3xl mx-auto leading-relaxed px-4">
            Discover the profound similarities across world religions. Compare sacred teachings side-by-side and witness how the same universal truths echo through different traditions.
          </p>
        </div>

        <div className="glass-effect rounded-xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-premium-light w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search sacred texts, themes, or traditions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[#0b0f2a]/5 border border-[#c8a75e]/10 rounded-xl text-[#f5f3ee] placeholder-premium-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setViewMode('comparisons')}
                className={`flex-1 sm:flex-none px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-medium transition-all ${
                  viewMode === 'comparisons'
                    ? 'bg-[#C8A75E] text-[#f5f3ee] shadow-premium'
                    : 'bg-[#0b0f2a]/5 text-premium-light hover:bg-[#0b0f2a]/10'
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setViewMode('browse')}
                className={`flex-1 sm:flex-none px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-medium transition-all ${
                  viewMode === 'browse'
                    ? 'bg-[#C8A75E] text-[#f5f3ee] shadow-premium'
                    : 'bg-[#0b0f2a]/5 text-premium-light hover:bg-[#0b0f2a]/10'
                }`}
              >
                Browse All
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-premium-light">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>

            {themes.map(theme => (
              <button
                key={theme.value}
                onClick={() => setSelectedTheme(theme.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedTheme === theme.value
                    ? 'bg-[#C8A75E] text-[#f5f3ee] shadow-md'
                    : 'bg-[#0b0f2a]/5 text-premium-light hover:bg-[#0b0f2a]/10'
                }`}
              >
                {theme.label}
              </button>
            ))}

            {viewMode === 'browse' && (
              <select
                value={selectedTradition}
                onChange={(e) => setSelectedTradition(e.target.value)}
                className="px-4 py-2 bg-[#0b0f2a]/5 border border-[#c8a75e]/10 rounded-xl text-[#f5f3ee] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Traditions</option>
                {traditions.map(tradition => (
                  <option key={tradition.id} value={tradition.id}>
                    {tradition.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-premium-light">
            <span>
              {viewMode === 'comparisons'
                ? `${filteredComparisons.length} comparison${filteredComparisons.length !== 1 ? 's' : ''}`
                : `${filteredTexts.length} text${filteredTexts.length !== 1 ? 's' : ''}`
              } found
            </span>
            {(selectedTheme !== 'all' || selectedTradition !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedTheme('all')
                  setSelectedTradition('all')
                  setSearchQuery('')
                }}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {viewMode === 'comparisons' ? (
          <div className="space-y-12">
            {filteredComparisons.map(comparison => (
              <ComparisonCard key={comparison.id} comparison={comparison} />
            ))}
            {filteredComparisons.length === 0 && (
              <div className="text-center py-16">
                <p className="text-premium-light text-lg">No comparisons found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTexts.map(text => (
              <TextCard key={text.id} text={text} />
            ))}
            {filteredTexts.length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-premium-light text-lg">No texts found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ComparisonCard({ comparison }: { comparison: TextComparison }) {
  return (
    <div className="glass-effect rounded-xl p-8 border border-[#c8a75e]/10">
      <div className="mb-8">
        <div className="inline-block px-4 py-1 bg-[#C8A75E]/20 border border-[#c8a75e]/30 rounded-xl mb-4">
          <span className="text-sm font-medium text-blue-300 capitalize">{comparison.theme}</span>
        </div>
        <h2 className="text-3xl font-bold text-[#f5f3ee] mb-3">{comparison.title}</h2>
        <p className="text-premium-light text-lg">{comparison.description}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(comparison.texts || []).map((text, index) => (
          <div
            key={text.id}
            className="bg-[#C8A75E]/5 rounded-xl p-6 border border-[#c8a75e]/10 hover:border-[#c8a75e]/20 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: text.tradition?.color || '#6b7280' }}
              ></div>
              <span className="text-sm font-medium" style={{ color: text.tradition?.color || '#6b7280' }}>
                {text.tradition?.name}
              </span>
            </div>

            <blockquote className="text-[#f5f3ee] text-lg leading-relaxed mb-4 italic">
              "{text.textContent}"
            </blockquote>

            <div className="space-y-2 text-sm text-premium-light">
              <p className="font-medium text-[#f5f3ee]">{text.source}</p>
              {text.translation && <p className="text-xs">{text.translation}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TextCard({ text }: { text: SacredText }) {
  return (
    <div className="glass-effect rounded-xl p-6 border border-[#c8a75e]/10 hover:border-[#c8a75e]/20 transition-all hover:-translate-y-2 group">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: text.tradition?.color || '#6b7280' }}
        ></div>
        <span className="text-sm font-medium" style={{ color: text.tradition?.color || '#6b7280' }}>
          {text.tradition?.name}
        </span>
        <span className="ml-auto text-xs px-2 py-1 bg-[#0b0f2a]/5 rounded-full text-premium-light capitalize">
          {text.theme}
        </span>
      </div>

      <h3 className="text-xl font-bold text-[#f5f3ee] mb-3">{text.title}</h3>

      <blockquote className="text-premium-light leading-relaxed mb-4 italic">
        "{text.textContent}"
      </blockquote>

      <div className="space-y-2 text-sm text-premium-light border-t border-[#c8a75e]/10 pt-4">
        <p className="font-medium text-[#f5f3ee]">{text.source}</p>
        {text.translation && <p className="text-xs">{text.translation}</p>}
        {text.context && <p className="text-xs mt-2 text-premium-light/80">{text.context}</p>}
      </div>

      <button className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm group-hover:translate-x-1">
        <Share2 className="w-4 h-4" />
        Share this teaching
      </button>
    </div>
  )
}
