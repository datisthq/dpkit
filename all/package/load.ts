import { loadPackageDescriptor } from "@dpkit/core"
import { dpkit } from "../plugin.ts"

export async function loadPackage(source: string) {
  for (const plugin of dpkit.plugins) {
    const result = await plugin.loadPackage?.(source)
    if (result) return result
  }

  const dataPackage = await loadPackageDescriptor(source)
  return dataPackage
}
