"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  /** Optional loading message */
  message?: string
  /** Full-screen (fixed) vs section (absolute). When false, parent must have position: relative */
  fullScreen?: boolean
  className?: string
}

/** Wrap a section to make LoadingOverlay work with absolute positioning */
function LoadingOverlayContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  )
}

function LoadingOverlay({
  message,
  fullScreen = false,
  className,
}: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        "inset-0 z-50 flex flex-col items-center justify-center gap-3",
        "bg-[rgba(8,8,8,0.7)] backdrop-blur-md",
        fullScreen ? "fixed" : "absolute",
        className,
      )}
    >
      <Loader2
        size={28}
        className="animate-spin text-[oklch(0.70_0.155_255)]"
      />
      {message && (
        <p className="text-sm text-[rgba(255,255,255,0.5)] animate-pulse">
          {message}
        </p>
      )}
    </div>
  )
}

export { LoadingOverlay, LoadingOverlayContainer }
export type { LoadingOverlayProps }
