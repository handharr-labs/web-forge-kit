"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:   "bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] text-[var(--primary-foreground)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:brightness-110",
        outline:   "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
        secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-80",
        ghost:     "hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
        danger:    "bg-[var(--destructive)]/10 text-[var(--destructive)] hover:bg-[var(--destructive)]/20 focus-visible:border-[var(--destructive)]/40 focus-visible:ring-[var(--destructive)]/20",
        link:      "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm:      "h-7 gap-1 rounded-[min(var(--radius),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg:      "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon:    "size-8",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({
  className, variant = "default", size = "default", ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
