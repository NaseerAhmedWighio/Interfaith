'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function EditSimilarityTheme({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    theme: '',
    description: '',
    examples: [''],
    orderIndex: 0
  })

  useEffect(() => {
    loadTheme()
  }, [resolvedParams.id])

  async function loadTheme() {
    try {
      const response = await fetch(`/api/similarity-themes/${resolvedParams.id}`)
      if (!response.ok) throw new Error('Failed to load similarity theme')

      const data = await response.json()
      setFormData({
        theme: data.theme || '',
        description: data.description || '',
        examples: data.examples && data.examples.length > 0 ? data.examples : [''],
        orderIndex: data.orderIndex || 0
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addExample = () => {
    setFormData({ ...formData, examples: [...formData.examples, ''] })
  }

  const removeExample = (index: number) => {
    setFormData({
      ...formData,
      examples: formData.examples.filter((_, i) => i !== index)
    })
  }

  const updateExample = (index: number, value: string) => {
    const newExamples = [...formData.examples]
    newExamples[index] = value
    setFormData({ ...formData, examples: newExamples })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/similarity-themes/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          examples: formData.examples.filter(ex => ex.trim() !== '')
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update similarity theme')
      }

      router.push('/admin/similarity-themes')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
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
          <p className="text-lg text-premium-light">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/similarity-themes"
          className="p-2 hover:bg-[#c8a75e]/10 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#f5f3ee]" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Edit Similarity Theme</h1>
          <p className="text-premium-light mt-1 text-sm">Update similarity theme details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20 space-y-6">
        {error && (
          <div className="p-4 bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-xl">
            <p className="text-[#e74c3c] text-sm">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
            Theme *
          </label>
          <input
            type="text"
            required
            value={formData.theme}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
            placeholder="e.g., Golden Rule, Compassion, Unity"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
            Description *
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
            placeholder="Describe the similarity theme..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
            Examples
          </label>
          <div className="space-y-3">
            {formData.examples.map((example, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={example}
                  onChange={(e) => updateExample(index, e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
                  placeholder="Enter an example..."
                />
                {formData.examples.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExample(index)}
                    className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addExample}
              className="px-4 py-2 bg-[#c8a75e]/10 border border-[#c8a75e]/20 text-[#c8a75e] rounded-xl hover:bg-[#c8a75e]/20 transition-all text-sm"
            >
              + Add Example
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#aab0d6] mb-2 uppercase tracking-wider">
            Order Index
          </label>
          <input
            type="number"
            value={formData.orderIndex}
            onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 rounded-xl bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] placeholder-[#aab0d6]/50 focus:border-[#c8a75e] focus:ring-2 focus:ring-[#c8a75e]/30 focus:bg-[#0b0f2a]/80 transition-all"
            placeholder="0"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl hover:shadow-premium transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/similarity-themes"
            className="px-6 py-3 bg-[#0b0f2a]/60 border border-[#c8a75e]/20 text-[#f5f3ee] rounded-xl hover:bg-[#0b0f2a]/80 transition-all font-medium text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
