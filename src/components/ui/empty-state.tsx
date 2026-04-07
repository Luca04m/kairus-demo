"use client"

import type { LucideIcon } from "lucide-react"
import { Inbox } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  /** Lucide icon component to display */
  icon?: LucideIcon
  /** Main heading */
  title?: string
  /** Supporting description */
  description?: string
  /** Optional action button label */
  actionLabel?: string
  /** Callback when the action button is clicked */
  onAction?: () => void
  className?: string
}

function EmptyState({
  icon: Icon = Inbox,
  title = "Nenhum dado encontrado",
  description = "Ainda nao existem registros para exibir.",
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-10 flex flex-col items-center justify-center text-center gap-4",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)]">
        <Icon size={22} className="text-[rgba(255,255,255,0.5)]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        <p className="text-xs text-[rgba(255,255,255,0.4)] max-w-xs leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          className="mt-1 border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] text-white/70 hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps }
