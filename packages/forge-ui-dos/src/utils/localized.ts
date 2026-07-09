import type { FieldDescriptor } from "../composition/section-catalog"

/* ----------------------------------------------------------------------------
   Bilingual (N-language) content model. A user-facing value is either a bare
   value (the default language) or a per-language map. Bare values keep every
   existing single-language config valid — the map form is purely additive.

   Resolution is *catalog-driven*: only fields flagged `localizable` in
   `SECTION_CATALOG` are swapped (see `resolveSectionProps`). We deliberately do
   NOT sniff object shapes, because Indonesian's language code `"id"` collides
   with the ubiquitous `id` identifier key — walking known localizable paths is
   the only unambiguous strategy.
   -------------------------------------------------------------------------- */

/** Fallback language when the active one has no variant. Indonesian-first. */
export const DEFAULT_LANG = "id"

/** A per-language map, keyed by language code (e.g. `{ id: "Halo", en: "Hi" }`). */
export type LocalizedMap<T = string> = { readonly [lang: string]: T | undefined }

/** A user-facing value: a bare default-language value, or a per-language map. */
export type Localized<T = string> = T | LocalizedMap<T>

/**
 * Author a per-language value where a plain `string` prop is expected. The
 * runtime value is the plain map (JSON-serializable, DB-round-trippable); the
 * return is typed as `string` so it slots into a string-typed prop without a
 * deep config-type transform. `<Invitation>` swaps it for the active language.
 *
 * ```ts
 * { path: "title", ... } // in a config:
 * title: loc({ id: "Dengan penuh syukur", en: "With gratitude" })
 * ```
 */
export function loc(variants: LocalizedMap<string>): string {
  return variants as unknown as string
}

/** A plain `{}` object — not a string, array, `Date`, class instance, etc. */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return (
    typeof v === "object" &&
    v !== null &&
    Object.getPrototypeOf(v) === Object.prototype
  )
}

/**
 * Resolve a single (possibly per-language) value for `lang`: the active
 * variant, then the fallback language, then any defined variant, then
 * `undefined`. A bare value passes through untouched.
 */
export function resolveLocalized<T = string>(
  value: Localized<T> | undefined,
  lang: string,
  fallback: string = DEFAULT_LANG
): T | undefined {
  if (!isPlainObject(value)) return value as T | undefined
  const map = value as LocalizedMap<T>
  if (map[lang] != null) return map[lang]
  if (map[fallback] != null) return map[fallback]
  return Object.values(map).find((v) => v != null)
}

/**
 * Deep-clone plain objects and arrays; pass everything else (functions, `Date`,
 * React elements) through by reference. `structuredClone` would throw on the
 * handler props (`onSubmit`, `onOpen`, …) that section props carry, and would
 * sever `Date` identity — this keeps both intact while giving us a mutable
 * plain structure to write resolved values into.
 */
function clonePlain<T>(value: T): T {
  if (Array.isArray(value)) return value.map(clonePlain) as unknown as T
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) out[k] = clonePlain(v)
    return out as T
  }
  return value
}

/** Read a dot-path (`""` = the object itself). Returns `undefined` if unreachable. */
function getPath(obj: Record<string, unknown>, path: string): unknown {
  if (path === "") return obj
  return path
    .split(".")
    .reduce<unknown>((acc, key) => (isPlainObject(acc) ? acc[key] : undefined), obj)
}

/** Write a dot-path in place; no-op if an intermediate segment is missing. */
function setPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".")
  let cur: Record<string, unknown> = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const next = cur[keys[i]]
    if (!isPlainObject(next)) return
    cur = next
  }
  cur[keys[keys.length - 1]] = value
}

/** Resolve one field descriptor against a mutable target, recursing into lists. */
function applyField(
  target: Record<string, unknown>,
  field: FieldDescriptor,
  lang: string,
  fallback: string
): void {
  if (field.kind === "list") {
    const arr = getPath(target, field.path)
    if (!Array.isArray(arr) || !field.of) return
    // A scalar list (e.g. `string[]`) is described by a single `path: ""` sub-field.
    const scalar = field.of.length === 1 && field.of[0].path === ""
    for (let i = 0; i < arr.length; i++) {
      if (scalar) {
        if (field.of[0].localizable) {
          arr[i] = resolveLocalized(arr[i] as Localized<string>, lang, fallback)
        }
      } else if (isPlainObject(arr[i])) {
        for (const sub of field.of) {
          applyField(arr[i] as Record<string, unknown>, sub, lang, fallback)
        }
      }
    }
    return
  }
  if (!field.localizable) return
  const raw = getPath(target, field.path)
  if (raw === undefined) return
  setPath(target, field.path, resolveLocalized(raw as Localized<string>, lang, fallback))
}

/**
 * Return a copy of a section's props with every `localizable` field (per its
 * `SECTION_CATALOG` descriptors) resolved to `lang`. Non-localizable data,
 * handlers, and `Date`s are preserved by reference. Returns the input untouched
 * when there are no fields to resolve.
 */
export function resolveSectionProps<T extends object>(
  props: T,
  fields: FieldDescriptor[] | undefined,
  lang: string,
  fallback: string = DEFAULT_LANG
): T {
  if (!fields || fields.length === 0) return props
  const clone = clonePlain(props) as Record<string, unknown>
  for (const field of fields) applyField(clone, field, lang, fallback)
  return clone as T
}
