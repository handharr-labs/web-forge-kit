"use client"

import * as React from "react"
import {
  DEFAULT_LANG,
  resolveLocalized,
  type Localized,
} from "../utils/localized"

/* ----------------------------------------------------------------------------
   Active-language context. `<Invitation>` owns the state and provides it here;
   the `LanguageToggle` is wired to it (value/onChange), and any consumer inside
   the composition can read the active language — or resolve its own per-language
   values — via `useDosLanguage()`.
   -------------------------------------------------------------------------- */

export type DosLanguageContext = {
  /** Active language code (e.g. `"id"`). */
  lang: string
  /** Switch the active language. */
  setLang: (lang: string) => void
  /** Resolve a per-language value against the active language. */
  t: <T = string>(value: Localized<T> | undefined) => T | undefined
}

const LanguageCtx = React.createContext<DosLanguageContext | null>(null)

/** Controlled provider — the host (`<Invitation>`) holds `value`/`onChange`. */
export function DosLanguageProvider({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (lang: string) => void
  children: React.ReactNode
}) {
  const ctx = React.useMemo<DosLanguageContext>(
    () => ({
      lang: value,
      setLang: onChange,
      t: (v) => resolveLocalized(v, value),
    }),
    [value, onChange]
  )
  return <LanguageCtx.Provider value={ctx}>{children}</LanguageCtx.Provider>
}

/**
 * Read the active language, switch it, or resolve a per-language value.
 * Returns `null` outside an `<Invitation>` (or any `DosLanguageProvider`), so
 * standalone components can degrade to their default language.
 */
export function useDosLanguage(): DosLanguageContext | null {
  return React.useContext(LanguageCtx)
}

export { DEFAULT_LANG }
