"use client"

import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Base skeleton                                                      */
/* ------------------------------------------------------------------ */

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional Tailwind classes */
  className?: string
}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton rounded", className)}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  SkeletonText — 1-3 lines of paragraph-like placeholder            */
/* ------------------------------------------------------------------ */

interface SkeletonTextProps {
  lines?: 1 | 2 | 3
  className?: string
}

function SkeletonText({ lines = 2, className }: SkeletonTextProps) {
  const widths: Record<number, string[]> = {
    1: ["w-3/4"],
    2: ["w-full", "w-2/3"],
    3: ["w-full", "w-5/6", "w-1/2"],
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {widths[lines].map((w, i) => (
        <Skeleton key={i} className={cn("h-3 rounded", w)} />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SkeletonCard — full glass card placeholder                         */
/* ------------------------------------------------------------------ */

interface SkeletonCardProps {
  className?: string
}

function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("glass-card rounded-xl p-5 space-y-4", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SkeletonTable — row placeholders                                   */
/* ------------------------------------------------------------------ */

interface SkeletonTableProps {
  rows?: number
  cols?: number
  className?: string
}

function SkeletonTable({ rows = 5, cols = 4, className }: SkeletonTableProps) {
  return (
    <div className={cn("glass-card rounded-xl p-5 space-y-3", className)}>
      {/* Header row */}
      <div className="flex gap-4 pb-3 border-b border-[rgba(255,255,255,0.06)]">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={`h-${i}`}
            className="h-3 flex-1"
            style={{ maxWidth: i === 0 ? "30%" : undefined }}
          />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-1">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={`${r}-${c}`}
              className="h-3 flex-1"
              style={{ maxWidth: c === 0 ? "30%" : undefined }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SkeletonChart — area chart placeholder                             */
/* ------------------------------------------------------------------ */

interface SkeletonChartProps {
  className?: string
}

function SkeletonChart({ className }: SkeletonChartProps) {
  return (
    <div className={cn("glass-card rounded-xl p-5 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-1/4" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="relative h-40 flex items-end gap-1.5">
        {[40, 65, 50, 80, 55, 90, 70, 60, 75, 85, 45, 70].map((h, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-2.5 w-8" />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  SkeletonKpi — single KPI card placeholder                          */
/* ------------------------------------------------------------------ */

interface SkeletonKpiProps {
  className?: string
}

function SkeletonKpi({ className }: SkeletonKpiProps) {
  return (
    <div className={cn("glass-card rounded-xl p-4 space-y-3", className)}>
      <div className="flex items-center gap-1.5 pl-3">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-2.5 w-16" />
      </div>
      <Skeleton className="h-7 w-24 pl-3 ml-3" />
      <Skeleton className="h-2.5 w-14 pl-3 ml-3" />
    </div>
  )
}

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonChart,
  SkeletonKpi,
}
