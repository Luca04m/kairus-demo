import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md font-medium",
  {
    variants: {
      variant: {
        default: "bg-white/10 text-white/60",
        green: "bg-kairus-green/15 text-kairus-green",
        blue: "bg-kairus-blue/15 text-kairus-blue",
        purple: "bg-kairus-purple/15 text-kairus-purple",
        success: "bg-success/15 text-success",
        danger: "bg-danger/15 text-danger",
        warning: "bg-warning/15 text-warning",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        default: "text-[11px] px-2.5 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  dot,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    dot?: boolean
  }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {dot && (
        <span
          className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current"
          style={{ boxShadow: "0 0 6px currentColor" }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
