"use client"

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ToastVariant = "success" | "error" | "warning" | "info"

interface ToastItem {
  id: string
  variant: ToastVariant
  message: string
}

interface ToastContextValue {
  toast: (variant: ToastVariant, message: string) => void
}

/* ------------------------------------------------------------------ */
/*  Visual config per variant                                          */
/* ------------------------------------------------------------------ */

const variantConfig: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; border: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle2,
    border: "border-[oklch(0.85_0.19_158/0.3)]",
    iconColor: "text-[oklch(0.85_0.19_158)]",
  },
  error: {
    icon: XCircle,
    border: "border-[oklch(0.62_0.24_25/0.3)]",
    iconColor: "text-[oklch(0.62_0.24_25)]",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-[oklch(0.85_0.18_90/0.3)]",
    iconColor: "text-[oklch(0.85_0.18_90)]",
  },
  info: {
    icon: Info,
    border: "border-[oklch(0.70_0.155_255/0.3)]",
    iconColor: "text-[oklch(0.70_0.155_255)]",
  },
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const ToastContext = createContext<ToastContextValue | null>(null)

function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de <ToastProvider>")
  }
  return ctx
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

const AUTO_DISMISS_MS = 5_000

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setToasts((prev) => [...prev, { id, variant, message }])

      const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
      timersRef.current.set(id, timer)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container — bottom-right stack */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2 pointer-events-none">
        {toasts.map((t) => {
          const cfg = variantConfig[t.variant]
          const Icon = cfg.icon
          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex items-start gap-2.5 rounded-lg px-4 py-3 min-w-[280px] max-w-sm",
                "glass border",
                cfg.border,
                "animate-fade-in-up",
              )}
            >
              <Icon size={16} className={cn("mt-0.5 flex-shrink-0", cfg.iconColor)} />
              <p className="flex-1 text-sm text-white/80 leading-snug">
                {t.message}
              </p>
              <button
                onClick={() => dismiss(t.id)}
                className="flex-shrink-0 text-[rgba(255,255,255,0.3)] hover:text-white/70 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export { ToastProvider, useToast }
export type { ToastVariant, ToastItem }
