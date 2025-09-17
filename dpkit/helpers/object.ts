export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0
}

// NOTE: es-toolkit currently adds 12MB to the bundle size (tree-shaking?)
export function countBy<T, K extends PropertyKey>(
  arr: readonly T[],
  mapper: (item: T) => K,
): Record<K, number> {
  const result = {} as Record<K, number>

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    // @ts-ignore
    const key = mapper(item)

    result[key] = (result[key] ?? 0) + 1
  }

  return result
}
