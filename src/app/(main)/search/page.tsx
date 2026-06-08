'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
  label: string
  href: string
  description: string
}

const pages: SearchResult[] = [
  { label: 'Home', href: '/', description: 'Interfaith Peace Bridge — uniting humanity through divine love and Sufi wisdom' },
  { label: 'Mission', href: '/mission', description: 'Our mission for interfaith harmony and eliminating hatred' },
  { label: 'About Us', href: '/about', description: 'Who we are — a global movement for interfaith understanding' },
  { label: 'Approach', href: '/approach', description: 'Our methodology for building genuine interfaith harmony' },
  { label: 'Sufi Teachings', href: '/sufi-teachings', description: 'Explore the timeless wisdom of Sufism' },
  { label: 'Teachings', href: '/teachings', description: 'Timeless teachings of love and unity across faiths' },
  { label: 'Sacred Texts', href: '/sacred-texts', description: 'Sacred texts and scriptures from world religions' },
  { label: 'Sacred Texts Explorer', href: '/sacred-texts-explorer', description: 'Compare sacred writings side by side' },
  { label: 'Truth Library', href: '/truth', description: 'Revealing truth and dispelling misconceptions' },
  { label: 'Traditions', href: '/traditions', description: 'Honoring all paths to the Divine' },
  { label: 'Peace Work', href: '/peace', description: 'Our peace initiatives and active programs' },
  { label: 'Peace Initiatives', href: '/peace-initiatives', description: 'Active programs building bridges worldwide' },
  { label: 'Interfaith Glossary', href: '/resources/interfaith-glossary', description: 'A respectful guide to sacred terms across world faiths' },
  { label: 'Founder', href: '/founder', description: 'Our founder and representative stewardship' },
  { label: 'Share Sacred Wisdom', href: '/share-quotes', description: 'Beautiful quote cards from world religions' },
  { label: 'Faith Assessment', href: '/assessment', description: 'A self-reflection journey discovering universal values' },
  { label: 'Join the Movement', href: '/join', description: 'Become part of a global interfaith family' },
  { label: 'Subscribe', href: '/subscribe', description: 'Receive inspiration and sacred wisdom in your inbox' },
  { label: 'Contact Us', href: '/contact-us', description: 'Get in touch with the Interfaith Peace Bridge team' },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    if (!query) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(
      pages.filter(p =>
        p.label.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    )
  }, [query])

  return (
    <div className="section-premium pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 min-h-screen">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 glass-effect px-4 sm:px-6 py-2 sm:py-3 rounded-xl mb-4 sm:mb-6">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8A75E]" />
            <span className="text-xs sm:text-sm font-semibold text-[#C8A75E]">Search</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl heading-premium text-[#f5f3ee] mb-4">
            Search Results
          </h1>
          {query && (
            <p className="text-[#aab0d6] text-sm sm:text-base">
              Showing results for &ldquo;<span className="text-[#f5f3ee] font-semibold">{query}</span>&rdquo;
            </p>
          )}
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aab0d6]" />
          <input
            type="text"
            defaultValue={query}
            placeholder="Search the site..."
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value.trim()
                if (val) window.location.href = `/search?q=${encodeURIComponent(val)}`
              }
            }}
            className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl bg-[#141A3A] border border-[#C8A75E]/30 text-[#f5f3ee] placeholder-[#aab0d6]/60 focus:outline-none focus:border-[#C8A75E] focus:ring-1 focus:ring-[#C8A75E]/30 transition-all text-sm sm:text-base"
          />
        </div>

        {query && results.length === 0 && (
          <div className="card-premium p-8 sm:p-12 text-center">
            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-[#C8A75E]/40 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-[#f5f3ee] mb-2">No results found</h3>
            <p className="text-sm sm:text-base text-[#aab0d6]">Try a different search term.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {results.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="card-premium p-4 sm:p-6 flex items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-[#f5f3ee] group-hover:text-[#C8A75E] transition-colors">
                    {r.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#aab0d6] mt-1 line-clamp-2">{r.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8A75E] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        )}

        {!query && (
          <div className="text-center py-12">
            <p className="text-[#aab0d6] text-sm sm:text-base">Enter a search term above to find pages.</p>
          </div>
        )}
      </div>
    </div>
  )
}
