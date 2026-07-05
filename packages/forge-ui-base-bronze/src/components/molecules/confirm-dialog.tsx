"use client"

import * as React from "react"
import { Modal } from "./modal"
import { Button } from "../atoms/button"

interface ConfirmDialogProps {
  open?: boolean
  title: string
  message: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
}

/** Confirmation dialog for destructive actions. Built on {@link Modal}. */
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      role="alertdialog"
      size="sm"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-[var(--muted-foreground)]">{message}</p>
    </Modal>
  )
}

export { ConfirmDialog }
export type { ConfirmDialogProps }
