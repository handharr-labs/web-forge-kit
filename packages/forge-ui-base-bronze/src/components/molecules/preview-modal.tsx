"use client"

import * as React from "react"
import { Modal } from "./modal"

interface PreviewModalProps {
  title: string
  /** Muted line shown inside the placeholder tile. */
  caption: string
  closeLabel?: string
  onClose: () => void
  /** Optional detail rendered beneath the caption inside the tile. */
  children?: React.ReactNode
}

/**
 * A modal wrapping a dashed placeholder tile — a stand-in for media that is not
 * really stored (proofs, scans, images). Purely presentational: `caption` is the
 * muted line at the top of the tile, `children` is whatever detail goes beneath.
 */
function PreviewModal({
  title,
  caption,
  closeLabel = "Close",
  onClose,
  children,
}: PreviewModalProps) {
  return (
    <Modal title={title} size="md" closeLabel={closeLabel} onClose={onClose}>
      <div
        data-slot="preview-modal-tile"
        className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[var(--radius)] border border-dashed border-[var(--border)] bg-[var(--muted)] text-center"
      >
        <span className="typo-label text-[var(--muted-foreground)]">{caption}</span>
        {children}
      </div>
    </Modal>
  )
}

export { PreviewModal }
export type { PreviewModalProps }
