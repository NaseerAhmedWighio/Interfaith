'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart3, Calendar, TrendingUp } from 'lucide-react'

interface AssessmentResult {
  id: string
  session_id: string | null
  peace_score: number | null
  tolerance_score: number | null
  compassion_score: number | null
  understanding_score: number | null
  overall_score: number | null
  result_category: string | null
  created_at: string
}

export default function AssessmentResultsManagement() {
  const [results, setResults] = useState<AssessmentResult[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    avgPeace: 0,
    avgTolerance: 0,
    avgCompassion: 0,
    avgUnderstanding: 0,
    avgOverall: 0
  })

  useEffect(() => {
    loadResults()
  }, [])

  async function loadResults() {
    try {
      const response = await fetch('/api/assessment/results/all')
      const data = await response.json()
      if (Array.isArray(data)) {
        setResults(data)
        calculateStats(data)
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Error loading results:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function calculateStats(data: AssessmentResult[]) {
    if (data.length === 0) return

    const totals = data.reduce((acc, r) => ({
      peace: acc.peace + (r.peace_score || 0),
      tolerance: acc.tolerance + (r.tolerance_score || 0),
      compassion: acc.compassion + (r.compassion_score || 0),
      understanding: acc.understanding + (r.understanding_score || 0),
      overall: acc.overall + (r.overall_score || 0)
    }), { peace: 0, tolerance: 0, compassion: 0, understanding: 0, overall: 0 })

    setStats({
      avgPeace: Math.round(totals.peace / data.length),
      avgTolerance: Math.round(totals.tolerance / data.length),
      avgCompassion: Math.round(totals.compassion / data.length),
      avgUnderstanding: Math.round(totals.understanding / data.length),
      avgOverall: Math.round(totals.overall / data.length)
    })
  }

  const categoryCounts = results.reduce((acc, r) => {
    const category = r.result_category || 'uncategorized'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-premium-light">Loading assessment results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Assessment Results</h1>
        <p className="text-premium-light mt-1 text-sm lg:text-base">Completed faith assessments and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6">
        <div className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20">
            <div className="text-3xl font-bold text-[#f5f3ee] mb-2">{stats.avgPeace || 0}</div>
            <div className="text-premium-light text-sm">Avg Peace Score</div>
          </div>
          <div className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20">
            <div className="text-3xl font-bold text-[#f5f3ee] mb-2">{stats.avgTolerance || 0}</div>
            <div className="text-premium-light text-sm">Avg Tolerance</div>
          </div>
          <div className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20">
            <div className="text-3xl font-bold text-[#f5f3ee] mb-2">{stats.avgCompassion || 0}</div>
            <div className="text-premium-light text-sm">Avg Compassion</div>
          </div>
          <div className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20">
            <div className="text-3xl font-bold text-[#f5f3ee] mb-2">{stats.avgUnderstanding || 0}</div>
            <div className="text-premium-light text-sm">Avg Understanding</div>
          </div>
          <div className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20">
            <div className="text-3xl font-bold text-green-400 mb-2">{stats.avgOverall || 0}</div>
            <div className="text-premium-light text-sm">Avg Overall</div>
          </div>
        </div>

      {/* Category Breakdown */}
      <div className="glass-effect rounded-xl p-6 border border-[#c8a75e]/20">
        <h2 className="text-xl font-semibold text-[#f5f3ee] mb-4">Results by Category</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div key={category} className="p-4 bg-[#0b0f2a]/30 rounded-xl">
              <div className="text-2xl font-bold text-[#f5f3ee] mb-1">{count}</div>
              <div className="text-premium-light text-sm capitalize">{category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="glass-effect rounded-xl overflow-hidden border border-[#c8a75e]/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#0b0f2a]/50 border-b border-[#c8a75e]/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Session ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Peace</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Tolerance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Compassion</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Understanding</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Overall</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#f5f3ee]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c8a75e]/10">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-[#0b0f2a]/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-premium-light text-sm font-mono">{result.session_id ? result.session_id.slice(0, 8) + '...' : 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#f5f3ee]">{result.peace_score ?? 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#f5f3ee]">{result.tolerance_score ?? 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#f5f3ee]">{result.compassion_score ?? 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[#f5f3ee]">{result.understanding_score ?? 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-green-400 font-semibold">{result.overall_score ?? 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#c8a75e]/20 text-[#c8a75e] rounded-xl text-sm capitalize">
                        {result.result_category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-premium-light text-sm">
                        <Calendar className="w-4 h-4" />
                        {result.created_at ? new Date(result.created_at).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {results.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-premium-light mx-auto mb-4" />
              <p className="text-premium-light">No assessment results yet</p>
            </div>
          )}
        </div>

      {/* Footer Stats */}
      <div className="text-center text-premium-light text-sm">
        Total Assessments: {results.length}
      </div>
    </div>
  )
}
