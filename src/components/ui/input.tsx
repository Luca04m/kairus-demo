import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "glass-light flex w-full rounded-xl border bg-transparent px-4 text-white/80 placeholder:text-white/50 outline-none transition-colors",
  {
    variants: {
      inputSize: {
        sm: "h-9 text-xs",
        default: "h-11 text-sm",
        lg: "h-12 text-base",
      },
      state: {
        default: "border-white/10 focus:border-white/25",
        error: "border-danger focus:border-danger",
      },
    },
    defaultVariants: {
      inputSize: "default",
      state: "default",
    },
  }
)

function Input({
  className,
  inputSize,
  state,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      data-slot="input"
      className={cn(inputVariants({ inputSize, state, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
