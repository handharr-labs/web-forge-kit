import * as React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../atoms/card"
import { cn } from "../../utils/cn"

interface StatCardProps {
  label: string
  value: string | number
  delta?: string
  deltaDirection?: "up" | "down" | "neutral"
  description?: string
  icon?: React.ReactNode
  className?: string
}

function StatCard({
  label,
  value,
  delta,
  deltaDirection = "neutral",
  description,
  icon,
  className,
}: StatCardProps) {
  const deltaColor =
    deltaDirection === "up"   ? "text-[var(--status-success-text)]" :
    deltaDirection === "down" ? "text-[var(--status-danger-text)]"  :
                                "text-[var(--muted-foreground)]"

  const DeltaIcon =
    deltaDirection === "up"   ? TrendingUp   :
    deltaDirection === "down" ? TrendingDown :
                                null

  return (
    <Card data-slot="stat-card" className={className}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardDescription>{label}</CardDescription>
          {icon && (
            <div className="shrink-0 rounded-lg bg-gradient-to-br from-[var(--primary-gradient-from)] to-[var(--primary-gradient-to)] p-2 text-[var(--primary-foreground)]">
              {icon}
            </div>
          )}
        </div>
        <CardTitle className="text-2xl font-bold tabular-nums">{value}</CardTitle>
      </CardHeader>
      {(delta || description) && (
        <CardContent>
          <div className="flex flex-col gap-0.5">
            {delta && (
              <p className={cn("flex items-center gap-1 text-xs font-medium", deltaColor)}>
                {DeltaIcon && <DeltaIcon className="size-3" />}
                {delta}
              </p>
            )}
            {description && (
              <p className="text-xs text-[var(--muted-foreground)]">{description}</p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export { StatCard }
export type { StatCardProps }
