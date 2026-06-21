import * as React from "react"
import { cn } from "../../utils/cn"

interface FooterLink { label: string; href: string }

interface FooterProps {
  logo?: React.ReactNode
  links?: FooterLink[]
  copyright?: string
  className?: string
}

function Footer({ logo, links = [], copyright, className }: FooterProps) {
  return (
    <footer
      data-slot="footer"
      className={cn("border-t border-[var(--border)] bg-[var(--muted)]/30 px-5 py-8", className)}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        {logo && <div data-slot="footer-logo">{logo}</div>}
        {links.length > 0 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="typo-body text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      {copyright && <p className="typo-caption mt-6">{copyright}</p>}
    </footer>
  )
}

export { Footer }
export type { FooterProps }
