export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f2a] via-[#1a1f3a] to-[#0b0f2a]">
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
