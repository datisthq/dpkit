import { loadPackageDescriptor } from "@dpkit/core"
import { dpkit } from "../plugin.js"

export async function loadPackage(source: string) {
  for (const plugin of dpkit.plugins) {
    const result = await plugin.loadPackage?.(source)
    if (result) return result
  }

  if (source.endsWith("datapackage.json")) {
    const dataPackage = await loadPackageDescriptor(source)
    return dataPackage
  }

  throw new Error(`No plugin can load the package: ${source}`)
}
