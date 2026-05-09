export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-[#c8a75e]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[#c8a75e] rounded-full animate-spin"></div>
        </div>
        <p className="text-lg text-premium-light">Loading dashboard...</p>
      </div>
    </div>
  )
}
