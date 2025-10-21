import { theme } from "#theme.ts"

export function getIsDesktop() {
  if (!theme.breakpoints) return false
  return globalThis.matchMedia(`(min-width: ${theme.breakpoints.md})`).matches
}
