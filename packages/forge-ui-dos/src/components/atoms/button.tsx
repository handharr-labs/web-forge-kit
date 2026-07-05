"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"

const buttonVariants = cva(
  "ds-mekar-btn group relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-[var(--font-body)] font-medium tracking-wide transition-all duration-300 ease-[var(--ease-soft)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /* Solid sage — the primary call to action. */
        solid:
          "rounded-[var(--radius-pill)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-md)] hover:bg-[var(--primary-deep)] hover:-translate-y-0.5 active:translate-y-0",
        /* Outlined — quiet secondary actions. */
        outline:
          "rounded-[var(--radius-pill)] border border-[var(--primary)] text-[var(--primary-deep)] hover:bg-[var(--primary-soft)]",
        /* Gold foil — the "Open Invitation" hero moment. */
        foil:
          "rounded-[var(--radius-pill)] border border-[var(--gold-deep)]/40 bg-[var(--surface)] text-[var(--gold-deep)] shadow-[var(--shadow-foil)] hover:-translate-y-0.5",
        /* Ghost — links, toggles. */
        ghost:
          "rounded-[var(--radius-pill)] text-[var(--foreground-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]",
      },
      size: {
        sm: "h-9 px-4 text-xs uppercase tracking-[0.18em]",
        md: "h-11 px-6 text-sm uppercase tracking-[0.2em]",
        lg: "h-14 px-9 text-sm uppercase tracking-[0.28em]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  }
)

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { buttonVariants }
