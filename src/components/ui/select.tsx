import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const selectVariants = cva(
  "glass-light flex w-full rounded-xl border bg-transparent px-4 pr-10 text-sm text-white/70 outline-none transition-colors appearance-none cursor-pointer",
  {
    variants: {
      state: {
        default: "border-white/10 focus:border-white/25",
        error: "border-danger focus:border-danger",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

function Select({
  className,
  state,
  children,
  ...props
}: React.ComponentProps<"select"> & VariantProps<typeof selectVariants>) {
  return (
    <div data-slot="select" className="relative">
      <select
        className={cn(selectVariants({ state, className }), "h-11")}
        {...props}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export { Select, selectVariants }
