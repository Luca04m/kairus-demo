'use client';

/**
 * Reusable glass-style loading skeleton components.
 * Match the visual language of the glass-card design system.
 */

export function SkeletonPulse({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[rgba(255,255,255,0.06)] ${className}`}
      style={style}
    />
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card rounded-xl p-4 ${className}`}>
      <SkeletonPulse className="h-3 w-20 mb-3" />
      <SkeletonPulse className="h-7 w-28 mb-2" />
      <SkeletonPulse className="h-2.5 w-16" />
    </div>
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

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-4 pb-2 border-b border-[rgba(255,255,255,0.08)]">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonPulse key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-2">
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonPulse key={j} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ height = 280 }: { height?: number }) {
  return (
    <div className="glass-card rounded-xl border border-[rgba(255,255,255,0.08)] p-5">
      <SkeletonPulse className="h-4 w-32 mb-5" />
      <SkeletonPulse className="w-full" style={{ height }} />
    </div>
  );
}

export function KpiGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
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

export function ErrorState({
  message = 'Erro ao carregar dados.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
        <span className="text-red-400 text-lg">!</span>
      </div>
      <p className="text-sm font-medium text-[rgba(255,255,255,0.5)]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-lg bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] px-4 py-1.5 text-xs font-medium text-white hover:bg-[rgba(255,255,255,0.12)] transition-colors"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title = 'Nenhum dado encontrado',
  subtitle,
}: {
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] py-16 text-center">
      {icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)]">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-[rgba(255,255,255,0.5)]">{title}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-[rgba(255,255,255,0.25)]">{subtitle}</p>
      )}
    </div>
  );
}
