'use client'

import { useState } from 'react'
import * as LucideIcons from 'lucide-react'

const ICONS = Object.keys(LucideIcons.icons).sort()

export interface IconPickerProps {
  value: string
  onChange: (icon: string) => void
  label?: string
}

export function IconPicker({ value, onChange, label = 'Icon' }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = search
    ? ICONS.filter(name => name.toLowerCase().includes(search.toLowerCase()))
    : ICONS

  const SelectedIcon = value && LucideIcons[value as keyof typeof LucideIcons]
    ? LucideIcons[value as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>
    : null

  return (
    <div>
      <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] cursor-pointer hover:border-[#c8a75e]/50 transition-all"
        >
          {SelectedIcon ? (
            <>
              <SelectedIcon className="w-5 h-5 text-[#c8a75e]" />
              <span>{value}</span>
            </>
          ) : (
            <span className="text-[#aab0d6]/50">Click to select an icon</span>
          )}
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="px-3 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {open && (
        <div className="mt-2 p-3 rounded-xl bg-[#0b0f2a] border border-[#c8a75e]/30 max-h-60 overflow-y-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons..."
            className="w-full px-3 py-2 mb-3 rounded-lg bg-[#141A3A] border border-[#c8a75e]/20 text-[#f5f3ee] text-sm placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 transition-all"
          />
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
            {filtered.map((name) => {
              const IconComp = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }> | undefined
              if (!IconComp) return null
              const isSelected = value === name
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => { onChange(name); setOpen(false) }}
                  title={name}
                  className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-[#c8a75e]/20 border border-[#c8a75e]/50 text-[#c8a75e]'
                      : 'bg-[#141A3A] border border-transparent text-[#aab0d6] hover:bg-[#c8a75e]/10 hover:text-[#f5f3ee] hover:border-[#c8a75e]/20'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </button>
              )
            })}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-4 text-sm text-[#aab0d6]/50">
                No icons found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
