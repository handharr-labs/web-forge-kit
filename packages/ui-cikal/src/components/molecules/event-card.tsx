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

const STATUS_LABELS: Record<BadgeVariant, string> = {
  neutral:   "Unknown",
  upcoming:  "Upcoming",
  ongoing:   "Ongoing",
  closed:    "Closed",
  cancelled: "Cancelled",
}

interface EventCardProps {
  title: string
  category: string
  dateRange: string
  status: BadgeVariant
  statusLabel?: string
  imageUrl?: string
  onAction?: () => void
  actionLabel?: string
  className?: string
}

function EventCard({
  title,
  category,
  dateRange,
  status,
  statusLabel,
  imageUrl,
  onAction,
  actionLabel = "Register",
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
          <Badge variant={status}>{statusLabel ?? STATUS_LABELS[status]}</Badge>
        </div>
        <CardDescription>{category}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
          <Calendar className="size-3.5 shrink-0" />
          <span className="typo-caption">{dateRange}</span>
        </div>
      </CardContent>
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
