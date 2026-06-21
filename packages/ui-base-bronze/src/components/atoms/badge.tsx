import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-[var(--muted)] text-[var(--foreground)] border-[var(--border)]",
        info:    "bg-blue-50 text-blue-700 border-blue-200",
        success: "bg-green-50 text-green-700 border-green-200",
        muted:   "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]",
        danger:  "bg-red-50 text-red-700 border-red-200",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
)

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
export type { BadgeVariant }
