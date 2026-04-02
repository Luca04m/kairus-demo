"use client"

import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  /** Main heading */
  title?: string
  /** Error message or description */
  message?: string
  /** Callback for the retry button */
  onRetry?: () => void
  /** Label for the retry button */
  retryLabel?: string
  /** Show an "Usar dados offline" fallback button */
  showOfflineFallback?: boolean
  /** Callback for the offline fallback button */
  onOfflineFallback?: () => void
  className?: string
}

function ErrorState({
  title = "Algo deu errado",
  message = "Nao foi possivel carregar os dados. Verifique sua conexao e tente novamente.",
  onRetry,
  retryLabel = "Tentar novamente",
  showOfflineFallback = false,
  onOfflineFallback,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-10 flex flex-col items-center justify-center text-center gap-4",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[oklch(0.62_0.24_25/0.12)] border border-[oklch(0.62_0.24_25/0.25)]">
        <AlertTriangle size={22} className="text-[oklch(0.62_0.24_25)]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        <p className="text-xs text-[rgba(255,255,255,0.4)] max-w-xs leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex items-center gap-3 mt-1">
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-white/70 hover:bg-[rgba(255,255,255,0.08)] hover:text-white gap-1.5"
          >
            <RefreshCw size={13} />
            {retryLabel}
          </Button>
        )}

        {showOfflineFallback && onOfflineFallback && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOfflineFallback}
            className="text-[rgba(255,255,255,0.4)] hover:text-white/70 gap-1.5"
          >
            <WifiOff size={13} />
            Usar dados offline
          </Button>
        )}
      </div>
    </div>
  )
}

export { ErrorState }
export type { ErrorStateProps }
