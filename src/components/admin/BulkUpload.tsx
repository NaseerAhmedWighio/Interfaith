'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileJson, CheckCircle, AlertCircle, Loader2, ChevronDown, ChevronRight, Download } from 'lucide-react'

interface BulkUploadResult {
  total: number
  created: number
  errors: { index: number; message: string }[]
}

interface Props {
  type: string
  onComplete: () => void
}

const REQUIRED_FIELDS_HINT: Record<string, string> = {
  teachings: 'title, content, source',
  'sacred-texts': 'title, source, textContent',
  traditions: 'name, description',
  'truth-sections': 'sectionKey, title, content',
  'similarity-themes': 'title, description, icon, slug',
}

const SAMPLE_EXAMPLES: Record<string, string> = {
  teachings: JSON.stringify([
    { title: 'Example Teaching', content: 'Full content text here...', source: 'Source Name', traditionId: '', category: 'unity' }
  ], null, 2),
  'sacred-texts': JSON.stringify([
    { title: 'Example Text Title', source: 'Tradition Name', textContent: 'Full sacred text content...', theme: 'peace', context: 'Historical context...', translation: 'Translation name', traditionId: '' }
  ], null, 2),
  traditions: JSON.stringify([
    { name: 'Tradition Name', description: 'Detailed description of the tradition...', coreValues: ['Value1', 'Value2', 'Value3'] }
  ], null, 2),
  'truth-sections': JSON.stringify([
    { sectionKey: 'unique_key', title: 'Section Title', content: 'Section content text...' }
  ], null, 2),
  'similarity-themes': JSON.stringify([
    { title: 'Sacred Texts', description: 'Explore how different faith traditions honor their sacred scriptures', icon: 'BookOpen', slug: 'sacred-texts', color: '#C8A75E', orderIndex: 1 },
    { title: 'Compassion & Love', description: 'Comparative study of the golden rule across world religions', icon: 'Heart', slug: 'compassion-love', color: '#E88D67', orderIndex: 2 },
    { title: 'Prayer & Meditation', description: 'Contemplative practices and devotional traditions from around the world', icon: 'Prayer', slug: 'prayer-meditation', color: '#6B8F71', orderIndex: 3 }
  ], null, 2),
}

export default function BulkUpload({ type, onComplete }: Props) {
  const [open, setOpen] = useState(false)
  const [raw, setRaw] = useState('')
  const [parsed, setParsed] = useState<any[] | null>(null)
  const [parseError, setParseError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<BulkUploadResult | null>(null)
  const [showExample, setShowExample] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setRaw(text)
      try {
        const data = JSON.parse(text)
        if (!Array.isArray(data)) throw new Error('JSON must be an array')
        setParsed(data)
        setParseError('')
      } catch (err: any) {
        setParsed(null)
        setParseError(err.message || 'Invalid JSON')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleUpload = async () => {
    if (!parsed || parsed.length === 0) return
    setUploading(true)
    setResult(null)
    try {
      const res = await fetch(`/api/admin/bulk-upload/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      })
      const data = await res.json()
      setResult(data)
      if (res.ok) onComplete()
    } catch (err) {
      setResult({ total: parsed.length, created: 0, errors: [{ index: -1, message: 'Network error' }] })
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    setRaw('')
    setParsed(null)
    setParseError('')
    setResult(null)
  }

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_EXAMPLES[type] || ''], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sample-${type}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-[#1c1f4a] text-[#c8a75e] border border-[#c8a75e]/40 rounded-xl hover:bg-[#c8a75e]/10 transition-all font-medium text-sm lg:text-base whitespace-nowrap"
      >
        <Upload className="w-4 h-4 lg:w-5 lg:h-5" />
        Bulk Upload
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#141A3A] rounded-2xl border border-[#c8a75e]/30 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#c8a75e]/20">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-[#c8a75e]" />
            <h2 className="text-lg font-bold text-[#f5f3ee]">Bulk Upload {type.replace('-', ' ')}</h2>
          </div>
          <button onClick={() => { setOpen(false); reset() }} className="text-premium-light hover:text-[#f5f3ee] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-sm text-premium-light">
            Upload a JSON file containing an array of records. Required fields: <span className="text-[#c8a75e] font-mono">{REQUIRED_FIELDS_HINT[type]}</span>
          </div>

          <div>
            <button
              onClick={() => setShowExample(!showExample)}
              className="flex items-center gap-2 text-sm text-[#c8a75e] hover:text-[#d4b56d] transition-colors"
            >
              {showExample ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              Show Example Format
            </button>
            {showExample && (
              <div className="mt-2 p-3 bg-[#0b0f2a] rounded-xl border border-[#c8a75e]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-premium-light uppercase tracking-wider">Example JSON</span>
                  <button
                    onClick={downloadSample}
                    className="inline-flex items-center gap-1.5 text-xs text-[#c8a75e] hover:text-[#d4b56d] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Sample
                  </button>
                </div>
                <pre className="text-xs text-[#f5f3ee]/80 font-mono whitespace-pre-wrap overflow-x-auto">
                  {SAMPLE_EXAMPLES[type] || 'No example available'}
                </pre>
              </div>
            )}
          </div>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#c8a75e]/30 rounded-xl p-8 cursor-pointer hover:border-[#c8a75e]/60 hover:bg-[#c8a75e]/5 transition-all">
            <FileJson className="w-10 h-10 text-[#c8a75e] mb-3" />
            <span className="text-sm text-premium-light">Click to select JSON file</span>
            <input ref={fileRef} type="file" accept=".json" onChange={handleFile} className="hidden" />
          </label>

          {raw && (
            <div className="text-xs text-premium-light truncate">
              Loaded: {(raw.length / 1024).toFixed(1)} KB, {parsed?.length || 0} records
            </div>
          )}

          {parseError && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {parsed && parsed.length > 0 && (
            <div className="max-h-48 overflow-y-auto glass-effect rounded-xl p-3 border border-[#c8a75e]/20">
              <p className="text-xs font-semibold text-premium-light mb-2 uppercase tracking-wider">Preview ({parsed.length} records)</p>
              <pre className="text-xs text-[#f5f3ee]/80 font-mono whitespace-pre-wrap">
                {JSON.stringify(parsed.slice(0, 3), null, 2)}
                {parsed.length > 3 && `\n... and ${parsed.length - 3} more`}
              </pre>
            </div>
          )}

          {result && (
            <div className={`p-4 rounded-xl border ${result.created === result.total ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.created === result.total ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )}
                <span className="text-sm font-semibold text-[#f5f3ee]">
                  {result.created} of {result.total} created
                </span>
              </div>
              {result.errors.length > 0 && (
                <ul className="space-y-1">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-xs text-red-400">#{e.index}: {e.message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            {!result ? (
              <>
                <button
                  onClick={handleUpload}
                  disabled={!parsed || parsed.length === 0 || uploading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-xl font-medium hover:shadow-premium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? 'Uploading...' : `Upload ${parsed?.length || 0} Records`}
                </button>
                <button
                  onClick={() => { setOpen(false); reset() }}
                  className="px-6 py-3 text-premium-light hover:text-[#f5f3ee] transition-colors text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => { setOpen(false); reset() }}
                className="flex-1 px-6 py-3 bg-[#c8a75e] text-[#0b0f2a] rounded-xl font-medium hover:shadow-premium transition-all"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
