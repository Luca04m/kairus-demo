export default function Loading() {
  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Header skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="skeleton h-8 w-48" />
        <div className="flex gap-2">
          <div className="skeleton h-9 w-28 rounded-lg" />
          <div className="skeleton h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Pipeline columns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, col) => (
          <div key={col} className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="skeleton h-5 w-24" />
              <div className="skeleton h-5 w-8 rounded-full" />
            </div>
            {Array.from({ length: 3 }).map((_, card) => (
              <div key={card} className="mb-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-3">
                <div className="skeleton mb-2 h-4 w-full" />
                <div className="skeleton mb-2 h-3 w-3/4" />
                <div className="flex items-center justify-between">
                  <div className="skeleton h-3 w-16" />
                  <div className="skeleton h-6 w-6 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
