export function createReport<T>(errors: T[], options?: { maxErrors?: number }) {
  errors = errors.slice(0, options?.maxErrors)
  const valid = errors.length === 0

  return { errors, valid }
}
