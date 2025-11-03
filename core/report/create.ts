import type { DpkitError } from "@dpkit/core"

export function createReport<T = DpkitError>(
  errors?: T[],
  options?: { maxErrors?: number },
) {
  errors = (errors ?? []).slice(0, options?.maxErrors)
  const valid = errors.length === 0

  return { errors, valid }
}
