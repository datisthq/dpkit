export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0
}
