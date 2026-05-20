'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { TrendingUp, Plus, Edit, Trash2, Search } from 'lucide-react'
import BulkUpload from '@/components/admin/BulkUpload'
import ContentSort, { applySort, loadSortSetting, type SortConfig } from '@/components/admin/ContentSort'

interface SimilarityTheme {
  id: string
  title: string
  description: string
  slug: string
  icon: string
  color: string | null
  orderIndex: number
  createdAt: string
  _count?: { teachings: number }
}

export default function SimilarityThemesManagement() {
  const [themes, setThemes] = useState<SimilarityTheme[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date', order: 'desc' })

  useEffect(() => {
    loadSortSetting('sort_similarity_themes').then(setSortConfig)
  }, [])

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
    if (!confirm('Are you sure you want to delete this similarity theme? (Its related teachings will also be deleted)')) return
    try {
      const response = await fetch(`/api/similarity-themes/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setThemes(themes.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting theme:', error)
      alert('Failed to delete theme')
    }
  }

  const filteredThemes = themes.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedThemes = applySort(filteredThemes, sortConfig, 'title', 'createdAt')

  function renderIcon(iconName: string | null, color: string | null) {
    const Icon = iconName && LucideIcons[iconName as keyof typeof LucideIcons]
      ? LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ className?: string; style?: React.CSSProperties }>
      : null
    if (!Icon) return null
    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color || '#6B7280' }}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#f5f3ee]" />
      </div>
    )
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Similarity Themes</h1>
          <p className="text-premium-light mt-1 text-sm lg:text-base">Manage interfaith similarity themes and their teachings</p>
        </div>
          <div className="flex items-center gap-3">
            <BulkUpload type="similarity-themes" onComplete={loadThemes} />
            <Link
              href="/admin/similarity-themes/new"
              className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium text-sm lg:text-base whitespace-nowrap"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
              Add Theme
            </Link>
          </div>
      </div>

      <div className="glass-effect rounded-xl p-4 border border-[#c8a75e]/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-premium-light" />
            <input
              type="text"
              placeholder="Search similarity themes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-[#0b0f2a]/20 border border-[#c8a75e]/20 rounded-lg sm:rounded-xl text-sm sm:text-base text-[#f5f3ee] placeholder-premium-light focus:outline-none focus:border-[#c8a75e] transition-colors"
            />
          </div>
          <ContentSort sortConfig={sortConfig} onSortChange={setSortConfig} settingKey="sort_similarity_themes" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
        {sortedThemes.map((theme) => (
          <div key={theme.id} className="glass-effect rounded-xl p-4 sm:p-6 border border-[#c8a75e]/20">
            <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
              <div className="flex flex-col md:flex-row items-start gap-3 sm:gap-4 flex-1 min-w-0">
                {renderIcon(theme.icon, theme.color)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm sm:text-lg font-semibold text-[#f5f3ee] truncate">{theme.title}</h3>
                    <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-[#0b0f2a]/20 rounded text-[10px] sm:text-xs text-premium-light whitespace-nowrap">
                      #{theme.orderIndex}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-premium-light mb-1 truncate">/{theme.slug}</p>
                  <p className="text-xs sm:text-sm text-premium-light leading-relaxed line-clamp-2">{theme.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-premium-light">
                    <span>{theme._count?.teachings ?? 0} teachings</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link
                  href={`/admin/similarity-themes/${theme.id}`}
                  className="p-1.5 sm:p-2 hover:bg-[#c8a75e]/20 rounded-lg sm:rounded-xl transition-colors"
                >
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8a75e]" />
                </Link>
                <button
                  onClick={() => deleteTheme(theme.id)}
                  className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg sm:rounded-xl transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedThemes.length === 0 && (
        <div className="glass-effect rounded-xl sm:rounded-2xl p-12 text-center">
          <TrendingUp className="w-16 h-16 text-premium-light mx-auto mb-4" />
          <p className="text-premium-light">No similarity themes found</p>
        </div>
      )}

      <div className="mt-6 text-center text-premium-light">
        Showing {sortedThemes.length} of {themes.length} themes
      </div>
    </div>
  )
}
