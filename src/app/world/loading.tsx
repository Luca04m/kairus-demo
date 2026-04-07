export default function Loading() {
  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Header skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="skeleton h-8 w-48" />
        <div className="flex gap-2">
          <div className="skeleton h-9 w-24 rounded-lg" />
          <div className="skeleton h-9 w-24 rounded-lg" />
        </div>
      </div>

      {/* Map / Globe skeleton */}
      <div className="skeleton mb-6 h-[320px] w-full rounded-xl" />

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
            <div className="skeleton mb-2 h-4 w-20" />
            <div className="skeleton h-7 w-28" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
        <div className="skeleton mb-4 h-5 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-t border-[rgba(255,255,255,0.06)] py-3">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-4 w-20 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
