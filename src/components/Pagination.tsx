'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex items-center justify-center gap-2 mt-10 sm:mt-12 md:mt-14">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#141A3A] text-[#aab0d6] hover:bg-[#1a1f4a] border border-[#C8A75E]/20"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm font-medium transition-all bg-[#141A3A] text-[#aab0d6] hover:bg-[#1a1f4a] border border-[#C8A75E]/20"
          >
            1
          </button>
          {start > 2 && <span className="text-[#aab0d6]/40 px-1">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm font-medium transition-all border ${
            page === currentPage
              ? 'bg-[#C8A75E] text-[#0B0F2A] border-[#C8A75E] shadow-lg'
              : 'bg-[#141A3A] text-[#aab0d6] hover:bg-[#1a1f4a] border-[#C8A75E]/20'
          }`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-[#aab0d6]/40 px-1">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm font-medium transition-all bg-[#141A3A] text-[#aab0d6] hover:bg-[#1a1f4a] border border-[#C8A75E]/20"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#141A3A] text-[#aab0d6] hover:bg-[#1a1f4a] border border-[#C8A75E]/20"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
