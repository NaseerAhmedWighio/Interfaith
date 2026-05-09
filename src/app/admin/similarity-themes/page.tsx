'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, Plus, Edit, Trash2 } from 'lucide-react'

interface SimilarityTheme {
  id: string
  title: string
  description: string
  slug: string
  icon: string
  order_index: number
  created_at: string
}

export default function SimilarityThemesManagement() {
  const [themes, setThemes] = useState<SimilarityTheme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadThemes()
  }, [])

  async function loadThemes() {
    try {
      const response = await fetch('/api/similarity-themes')
      const data = await response.json()
      if (Array.isArray(data)) {
        setThemes(data)
      } else {
        setThemes([])
      }
    } catch (error) {
      console.error('Error loading themes:', error)
      setThemes([])
    } finally {
      setLoading(false)
    }
  }

  async function deleteTheme(id: string) {
    if (!confirm('Are you sure you want to delete this similarity theme?')) return

    try {
      const response = await fetch(`/api/similarity-themes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setThemes(themes.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting theme:', error)
      alert('Failed to delete theme')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading similarity themes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Similarity Themes</h1>
          <p className="text-premium-light mt-1 text-sm lg:text-base">Manage interfaith similarity themes</p>
        </div>
        <Link
          href="/admin/similarity-themes/new"
          className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium text-sm lg:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
          Add Theme
        </Link>
      </div>

      {/* Themes Grid */}
      <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
        {themes.map((theme) => (
          <div key={theme.id} className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col items-start gap-4 flex-1">
                  <div className="text-4xl">{theme.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-[#f5f3ee]">{theme.title}</h3>
                      <span className="px-2 py-1 bg-[#0b0f2a]/20 rounded text-xs text-premium-light">
                        #{theme.order_index}
                      </span>
                    </div>
                    <p className="text-premium-light text-sm mb-2">Slug: /{theme.slug}</p>
                    <p className="text-premium-light leading-relaxed">{theme.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/similarity-themes/${theme.id}`}
                    className="p-2 hover:bg-[#c8a75e]/20 rounded-xl transition-colors"
                  >
                    <Edit className="w-4 h-4 text-[#c8a75e]" />
                  </Link>
                  <button
                    onClick={() => deleteTheme(theme.id)}
                    className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {themes.length === 0 && (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <TrendingUp className="w-16 h-16 text-premium-light mx-auto mb-4" />
            <p className="text-premium-light">No similarity themes found</p>
          </div>
        )}

        <div className="mt-6 text-center text-premium-light">
          Total Themes: {themes.length}
        </div>
    </div>
  )
}
