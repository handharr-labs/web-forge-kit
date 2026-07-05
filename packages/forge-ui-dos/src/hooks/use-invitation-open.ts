"use client"

import * as React from "react"

/**
 * Coordinates the "Open Invitation" gesture. The cover's Open button is the one
 * guaranteed user interaction on the page, so it's the moment allowed to start
 * background audio under the browser autoplay policy. Call `open()` from the
 * cover's `onOpen`; it flips `opened` and (unless disabled) `musicPlaying`.
 *
 * The `<Invitation>` renderer uses this internally, but it's exported so apps
 * building the full-screen-overlay cover pattern by hand can reuse the same
 * unlock logic.
 */
export function useInvitationOpen(options?: {
  /** Start background music on open. Default true. */
  autoplayMusic?: boolean
  onOpen?: () => void
}) {
  const [opened, setOpened] = React.useState(false)
  const [musicPlaying, setMusicPlaying] = React.useState(false)

  const open = React.useCallback(() => {
    setOpened(true)
    if (options?.autoplayMusic !== false) setMusicPlaying(true)
    options?.onOpen?.()
  }, [options])

  return { opened, open, musicPlaying, setMusicPlaying }
}
