"use client"

import { cn } from "@/lib/utils"

type ConnectionState = "connected" | "offline" | "error"

interface ConnectionStatusProps {
  /** Current connection state */
  state: ConnectionState
  className?: string
}

const config: Record<
  ConnectionState,
  { dot: string; label: string; pulse: boolean }
> = {
  connected: {
    dot: "bg-[oklch(0.85_0.19_158)]",
    label: "Conectado",
    pulse: true,
  },
  offline: {
    dot: "bg-[oklch(0.85_0.18_90)]",
    label: "Offline \u2014 dados locais",
    pulse: false,
  },
  error: {
    dot: "bg-[oklch(0.62_0.24_25)]",
    label: "Erro de conexao",
    pulse: false,
  },
}

function ConnectionStatus({ state, className }: ConnectionStatusProps) {
  const { dot, label, pulse } = config[state]

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1",
        "glass-light text-xs text-[rgba(255,255,255,0.5)]",
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75",
              dot,
            )}
            style={{ animation: "pulseSoft 2s ease-in-out infinite" }}
          />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", dot)} />
      </span>
      {label}
    </div>
  )
}

export { ConnectionStatus }
export type { ConnectionStatusProps, ConnectionState }
