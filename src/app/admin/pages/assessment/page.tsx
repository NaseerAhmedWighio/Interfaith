'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ContentSectionEditor from '@/components/ContentSectionEditor'

export default function AssessmentPageEditor() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-2 text-premium-light hover:text-[#f5f3ee] transition-colors mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#f5f3ee]">Assessment Page Editor</h1>
        <p className="text-premium-light mt-1 text-sm lg:text-base">Edit the assessment page headings, subtitle, and section text</p>
      </div>

      <ContentSectionEditor pageKey="assessment" />
    </div>
  )
}
