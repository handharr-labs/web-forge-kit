"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { cn } from "../../utils/cn"

interface FileDropzoneProps {
  label: string
  hint?: string
  accept?: string
  fileName: string | null
  onFileChange: (fileName: string | null) => void
  removeLabel?: string
  className?: string
}

/**
 * Dropzone-style file picker. Reports the selected file name via `onFileChange`;
 * it does not upload or persist the file. Gold lifts the target's border to the
 * ring color on hover with an animated transition.
 */
function FileDropzone({
  label,
  hint,
  accept,
  fileName,
  onFileChange,
  removeLabel = "Remove",
  className,
}: FileDropzoneProps) {
  return (
    <div data-slot="file-dropzone" className={cn("flex flex-col gap-3", className)}>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-4 py-12 text-center transition-all duration-200 hover:border-[var(--ring)] hover:bg-[var(--muted)]">
        <Upload className="size-6 text-[var(--primary)]" aria-hidden="true" />
        <span className="font-medium">{label}</span>
        {hint && <span className="typo-label text-[var(--muted-foreground)]">{hint}</span>}
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onFileChange(e.target.files?.[0]?.name ?? null)}
        />
      </label>
      {fileName && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] px-3 py-2">
          <span className="typo-label truncate">{fileName}</span>
          <button
            type="button"
            className="typo-label shrink-0 text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            onClick={() => onFileChange(null)}
          >
            {removeLabel}
          </button>
        </div>
      )}
    </div>
  )
}

export { FileDropzone }
export type { FileDropzoneProps }
