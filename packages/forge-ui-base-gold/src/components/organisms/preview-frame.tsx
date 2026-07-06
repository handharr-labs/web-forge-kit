"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Smartphone, Tablet, Monitor, Maximize2 } from "lucide-react"

import { cn } from "../../utils/cn"
import { SegmentedControl } from "../molecules/segmented-control"

type Device = "mobile" | "tablet" | "desktop" | "fit"

const DEVICE_WIDTH: Record<Device, number | null> = {
  mobile: 390,
  tablet: 768,
  desktop: 1280,
  fit: null, // fill available width
}

const DEVICE_OPTIONS = [
  { value: "mobile", label: "", icon: <Smartphone /> },
  { value: "tablet", label: "", icon: <Tablet /> },
  { value: "desktop", label: "", icon: <Monitor /> },
  { value: "fit", label: "", icon: <Maximize2 /> },
]

/**
 * Clone the host document's stylesheets into the iframe so injected content is
 * styled, and keep new ones (dev HMR / JIT) in sync. Returns a disposer.
 */
function syncStyles(target: Document): () => void {
  const head = target.head
  const inject = (node: Element) => {
    if (node.tagName === "STYLE") {
      const s = target.createElement("style")
      s.textContent = node.textContent
      head.appendChild(s)
    } else if (node.tagName === "LINK" && (node as HTMLLinkElement).rel === "stylesheet") {
      const l = target.createElement("link")
      l.rel = "stylesheet"
      l.href = (node as HTMLLinkElement).href // resolved absolute URL
      head.appendChild(l)
    }
  }
  document.querySelectorAll('style, link[rel="stylesheet"]').forEach(inject)

  const obs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((n) => {
        if (n instanceof Element) inject(n)
      })
    }
  })
  obs.observe(document.head, { childList: true })
  return () => obs.disconnect()
}

interface PreviewFrameProps {
  /** Content rendered inside the isolated iframe (the app injects `<Invitation config />`). */
  children: React.ReactNode
  /** Controlled device; omit (with `defaultDevice`) to self-manage. */
  device?: Device
  defaultDevice?: Device
  onDeviceChange?: (device: Device) => void
  /** Left side of the toolbar — a title or breadcrumbs. */
  title?: React.ReactNode
  /** Extra toolbar controls (right of the device toggle). */
  toolbar?: React.ReactNode
  showDeviceToggle?: boolean
  /** Mirror the host's dark mode into the iframe root (adds `.dark`). */
  dark?: boolean
  className?: string
  /** Height of the preview body (the toolbar sits above it). */
  height?: number | string
}

/**
 * Isolated live-preview shell. Renders its children inside an iframe so the
 * previewed design system's tokens, full-bleed layout, and viewport units can't
 * collide with the host dashboard — the two-DS partition stays intact. Generic:
 * gold never imports the previewed DS; the app injects it as `children`. A
 * device-width toggle frames the content at phone/tablet/desktop widths.
 */
function PreviewFrame({
  children,
  device,
  defaultDevice = "fit",
  onDeviceChange,
  title,
  toolbar,
  showDeviceToggle = true,
  dark = false,
  className,
  height = 560,
}: PreviewFrameProps) {
  const [internal, setInternal] = React.useState<Device>(defaultDevice)
  const active = device ?? internal
  const setDevice = (d: Device) => {
    if (device === undefined) setInternal(d)
    onDeviceChange?.(d)
  }

  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [mountNode, setMountNode] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    let disposeStyles = () => {}

    const setup = () => {
      const doc = iframe.contentDocument
      if (!doc) return
      doc.body.style.margin = "0"
      disposeStyles = syncStyles(doc)
      let node = doc.body.querySelector<HTMLElement>("[data-preview-root]")
      if (!node) {
        node = doc.createElement("div")
        node.setAttribute("data-preview-root", "")
        doc.body.appendChild(node)
      }
      setMountNode(node)
    }

    // A srcless iframe has a ready blank document synchronously in most engines;
    // fall back to the load event otherwise.
    if (iframe.contentDocument?.readyState === "complete") setup()
    else iframe.addEventListener("load", setup)

    return () => {
      iframe.removeEventListener("load", setup)
      disposeStyles()
      setMountNode(null)
    }
  }, [])

  // Reflect host dark mode onto the iframe root.
  React.useEffect(() => {
    const root = mountNode?.ownerDocument.documentElement
    if (root) root.classList.toggle("dark", dark)
  }, [dark, mountNode])

  const width = DEVICE_WIDTH[active]

  return (
    <div
      data-slot="preview-frame"
      className={cn(
        "flex flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-3 py-2">
        <div className="min-w-0 flex-1 truncate text-sm font-medium">{title}</div>
        <div className="flex items-center gap-2">
          {showDeviceToggle && (
            <SegmentedControl
              size="sm"
              aria-label="Preview device width"
              options={DEVICE_OPTIONS}
              value={active}
              onValueChange={(v) => setDevice(v as Device)}
            />
          )}
          {toolbar}
        </div>
      </div>

      <div
        className="flex justify-center overflow-auto bg-[var(--muted)]/40 p-4"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      >
        <div
          className="h-full shrink-0 overflow-hidden rounded-lg bg-white shadow-[var(--shadow-md)] ring-1 ring-[var(--border)] transition-[width] duration-300"
          style={{ width: width ? `${width}px` : "100%", maxWidth: "100%" }}
        >
          <iframe
            ref={iframeRef}
            title={typeof title === "string" ? title : "Preview"}
            className="size-full border-0"
          />
          {mountNode && createPortal(children, mountNode)}
        </div>
      </div>
    </div>
  )
}

export { PreviewFrame }
export type { PreviewFrameProps }
