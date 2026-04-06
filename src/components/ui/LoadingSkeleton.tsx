'use client';

/**
 * Reusable glass-style loading skeleton components.
 * Match the visual language of the glass-card design system.
 *
 * NOTE: SkeletonCard, SkeletonTable, SkeletonChart are re-exported from
 * the canonical skeleton.tsx to avoid duplication. ErrorState and EmptyState
 * are re-exported from their canonical modules.
 */

// Re-export canonical components so existing imports keep working
export { SkeletonCard, SkeletonTable, SkeletonChart } from "@/components/ui/skeleton";
export { ErrorState } from "@/components/ui/error-state";
export { EmptyState } from "@/components/ui/empty-state";

/* ------------------------------------------------------------------ */
/*  Components unique to this file (no canonical equivalent)           */
/* ------------------------------------------------------------------ */

export function SkeletonPulse({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[rgba(255,255,255,0.06)] ${className}`}
      style={style}
    />
  );
}

export function SkeletonRow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-start gap-3 p-2 ${className}`}>
      <SkeletonPulse className="h-6 w-6 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <SkeletonPulse className="h-3 w-full mb-2" />
        <SkeletonPulse className="h-2.5 w-16" />
      </div>
    </div>
  );
}

export function KpiGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-xl p-4">
          <SkeletonPulse className="h-3 w-20 mb-3" />
          <SkeletonPulse className="h-7 w-28 mb-2" />
          <SkeletonPulse className="h-2.5 w-16" />
        </div>
      ))}
    </div>
  );
}

export function AgentGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <SkeletonPulse className="h-7 w-7 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <SkeletonPulse className="h-3 w-16 mb-1" />
              <SkeletonPulse className="h-2 w-12" />
            </div>
          </div>
          <SkeletonPulse className="h-2.5 w-full mb-1" />
          <SkeletonPulse className="h-2 w-10" />
        </div>
      ))}
    </div>
  );
}
