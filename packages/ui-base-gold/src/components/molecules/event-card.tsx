import * as React from "react"
import { Calendar } from "lucide-react"

import { Badge, type BadgeVariant } from "../atoms/badge"
import { Button } from "../atoms/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../atoms/card"
import { cn } from "../../utils/cn"

interface EventCardProps {
  title: string
  description?: string
  meta?: string
  badge?: string
  badgeVariant?: BadgeVariant
  imageUrl?: string
  onAction?: () => void
  actionLabel?: string
  className?: string
}

function EventCard({
  title,
  description,
  meta,
  badge,
  badgeVariant = "neutral",
  imageUrl,
  onAction,
  actionLabel = "View",
  className,
}: EventCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-40 object-cover" />
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{title}</CardTitle>
          {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {meta && (
        <CardContent>
          <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
            <Calendar className="size-3.5 shrink-0" />
            <span className="typo-caption">{meta}</span>
          </div>
        </CardContent>
      )}
      {onAction && (
        <CardFooter>
          <Button size="sm" onClick={onAction} className="ml-auto">
            {actionLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export { EventCard }
export type { EventCardProps }
