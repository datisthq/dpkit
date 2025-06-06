import { loadPackageDescriptor } from "@dpkit/core"
import { dpkit } from "../general/index.js"

export async function loadPackage(source: string) {
  for (const plugin of dpkit.plugins) {
    const result = await plugin.loadPackage?.(source)
    if (result) return result
  }

  if (source.endsWith("datapackage.json")) {
    const cleanup = async () => {}
    const dataPackage = await loadPackageDescriptor(source)
    return { dataPackage, cleanup }
  }

  throw new Error(`No plugin can load the package: ${source}`)
}
