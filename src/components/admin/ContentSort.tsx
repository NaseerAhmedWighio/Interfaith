'use client'

import { useState } from 'react'
import { ArrowUpDown, ArrowUpZA, ArrowDownZA, Calendar, Save } from 'lucide-react'

export type SortField = 'name' | 'date'
export type SortOrder = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  order: SortOrder
}

interface ContentSortProps {
  sortConfig: SortConfig
  onSortChange: (config: SortConfig) => void
  settingKey?: string
  label?: string
}

const options: { value: SortConfig; label: string; icon: typeof ArrowUpDown }[] = [
  { value: { field: 'name', order: 'asc' }, label: 'A-Z', icon: ArrowUpZA },
  { value: { field: 'name', order: 'desc' }, label: 'Z-A', icon: ArrowDownZA },
  { value: { field: 'date', order: 'desc' }, label: 'Newest', icon: Calendar },
  { value: { field: 'date', order: 'asc' }, label: 'Oldest', icon: Calendar },
]

export default function ContentSort({ sortConfig, onSortChange, settingKey, label }: ContentSortProps) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!settingKey) return
    setSaving(true)
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: settingKey, value: sortConfig }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Failed to save sort setting:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-[#aab0d6] font-medium">{label}</span>}
      <div className="flex bg-[#0b0f2a] border border-[#c8a75e]/20 rounded-lg overflow-hidden">
        {options.map((opt) => {
          const isActive = sortConfig.field === opt.value.field && sortConfig.order === opt.value.order
          const Icon = opt.icon
          return (
            <button
              key={opt.label}
              onClick={() => onSortChange(opt.value)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#c8a75e] text-[#0b0f2a]'
                  : 'text-[#aab0d6] hover:text-[#f5f3ee] hover:bg-[#c8a75e]/10'
              }`}
            >
              <Icon className="w-3 h-3" />
              {opt.label}
            </button>
          )
        })}
      </div>
      {settingKey && (
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            saved
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-[#c8a75e]/10 text-[#c8a75e] border border-[#c8a75e]/20 hover:bg-[#c8a75e]/20'
          }`}
        >
          <Save className="w-3 h-3" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      )}
    </div>
  )
}

export async function loadSortSetting(key: string): Promise<SortConfig> {
  try {
    const res = await fetch('/api/admin/settings')
    const data = await res.json()
    return data.settings?.[key] || { field: 'date', order: 'desc' }
  } catch {
    return { field: 'date', order: 'desc' }
  }
}

export function applySort<T extends Record<string, any>>(items: T[], config: SortConfig, nameKey: string = 'name', dateKey: string = 'created_at'): T[] {
  return [...items].sort((a, b) => {
    if (config.field === 'name') {
      const aVal = (a[nameKey] ?? '').toString().toLowerCase()
      const bVal = (b[nameKey] ?? '').toString().toLowerCase()
      return config.order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    const aDate = new Date(a[dateKey] || a.createdAt || 0).getTime()
    const bDate = new Date(b[dateKey] || b.createdAt || 0).getTime()
    return config.order === 'desc' ? bDate - aDate : aDate - bDate
  })
}
