import * as React from "react"

import { cn } from "../../utils/cn"

type AvatarSize = "sm" | "default" | "lg"

interface AvatarProps {
  src?: string
  name?: string
  size?: AvatarSize
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

const sizeClasses: Record<AvatarSize, string> = {
  sm:      "size-7 text-xs",
  default: "size-9 text-sm",
  lg:      "size-12 text-base",
}

function Avatar({ src, name, size = "default", className }: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--secondary)] font-medium text-[var(--secondary-foreground)]",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name ?? "avatar"} className="size-full object-cover" />
      ) : (
        <span>{name ? getInitials(name) : "?"}</span>
      )}
    </div>
  )
}

export { Avatar }
export type { AvatarProps }
