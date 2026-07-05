import * as React from "react"
import { Badge, type BadgeVariant } from "../atoms/badge"
import { Button } from "../atoms/button"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
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
  title, description, meta, badge, badgeVariant = "neutral",
  imageUrl, onAction, actionLabel = "View", className,
}: EventCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-40 object-cover" />
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {badge && (
          <div className="mt-1">
            <Badge variant={badgeVariant}>{badge}</Badge>
          </div>
        )}
      </CardHeader>
      {meta && (
        <CardContent className="mt-auto">
          <span className="typo-caption text-[var(--muted-foreground)]">{meta}</span>
        </CardContent>
      )}
      {onAction && (
        <CardFooter className={cn(!meta && "mt-auto")}>
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
