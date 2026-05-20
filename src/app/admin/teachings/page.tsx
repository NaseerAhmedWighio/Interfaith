'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search, BookOpen } from 'lucide-react'
import ContentSort, { applySort, loadSortSetting, type SortConfig } from '@/components/admin/ContentSort'
import BulkUpload from '@/components/admin/BulkUpload'

interface Teaching {
  id: string
  title: string
  content: string
  source: string
  tradition_id: string
  created_at: string
  tradition: {
    name: string
    color: string
    symbol: string
  }
}

export default function TeachingsManagement() {
  const [teachings, setTeachings] = useState<Teaching[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'date', order: 'desc' })

  useEffect(() => {
    loadSortSetting('sort_teachings').then(setSortConfig)
  }, [])

  useEffect(() => {
    loadTeachings()
  }, [])

  async function loadTeachings() {
    try {
      const response = await fetch('/api/teachings')
      const data = await response.json()
      if (Array.isArray(data)) {
        setTeachings(data)
      } else {
        setTeachings([])
      }
    } catch (error) {
      console.error('Error loading teachings:', error)
      setTeachings([])
    } finally {
      setLoading(false)
    }
  }

  async function deleteTeaching(id: string) {
    if (!confirm('Are you sure you want to delete this teaching?')) return

    try {
      const response = await fetch(`/api/teachings/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTeachings(teachings.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Error deleting teaching:', error)
      alert('Failed to delete teaching')
    }
  }

  const filteredTeachings = teachings.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.tradition?.name || 'Universal').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedTeachings = applySort(filteredTeachings, sortConfig, 'title', 'created_at')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading teachings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Teachings</h1>
          <p className="text-premium-light mt-1 text-sm lg:text-base">Manage sacred teachings and wisdom</p>
        </div>
        <Link
          href="/admin/teachings/new"
          className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium text-sm lg:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
          Add Teaching
        </Link>
        <BulkUpload type="teachings" onComplete={loadTeachings} />
      </div>

      {/* Search & Sort */}
      <div className="glass-effect rounded-xl p-4 border border-[#c8a75e]/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-premium-light" />
            <input
              type="text"
              placeholder="Search teachings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-[#0b0f2a]/50 border border-[#c8a75e]/20 rounded-lg sm:rounded-xl text-sm sm:text-base text-[#f5f3ee] placeholder-premium-light focus:outline-none focus:border-[#c8a75e] transition-colors"
            />
          </div>
          <ContentSort sortConfig={sortConfig} onSortChange={setSortConfig} settingKey="sort_teachings" />
        </div>
      </div>

      {/* Teachings Grid */}
      <div className="grid gap-4">
        {sortedTeachings.map((teaching) => (
          <div key={teaching.id} className="glass-effect rounded-xl p-4 sm:p-6 border border-[#c8a75e]/20 hover:border-[#c8a75e]/40 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3">
                    <h3 className="text-sm sm:text-xl font-semibold text-[#f5f3ee] truncate">{teaching.title}</h3>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 self-end sm:self-auto">
                      <Link
                        href={`/admin/teachings/${teaching.id}`}
                        className="p-1.5 sm:p-2 hover:bg-[#c8a75e]/20 rounded-lg sm:rounded-xl transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c8a75e]" />
                      </Link>
                      <button
                        onClick={() => deleteTeaching(teaching.id)}
                        className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg sm:rounded-xl transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 mt-1 sm:mt-2">
                    <span
                      className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-medium border"
                      style={{
                        backgroundColor: teaching.tradition ? `${teaching.tradition.color}20` : '#c8a75e20',
                        color: teaching.tradition?.color || '#c8a75e',
                        borderColor: teaching.tradition ? `${teaching.tradition.color}40` : '#c8a75e40'
                      }}
                    >
                      {teaching.tradition?.name || 'Universal'}
                    </span>
                    <span className="text-premium-light text-[11px] sm:text-sm">{teaching.source}</span>
                  </div>
                  <p className="text-premium-light text-sm leading-relaxed line-clamp-3">{teaching.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedTeachings.length === 0 && (
        <div className="glass-effect rounded-xl p-12 text-center border border-[#c8a75e]/20">
          <BookOpen className="w-16 h-16 text-premium-light mx-auto mb-4" />
          <p className="text-premium-light">No teachings found</p>
        </div>
      )}

      {/* Footer Stats */}
      <div className="text-center text-premium-light text-sm">
        Showing {sortedTeachings.length} of {teachings.length} teachings
      </div>
    </div>
  )
}
