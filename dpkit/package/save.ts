import type { Package } from "@dpkit/core"
import { savePackageDescriptor } from "@dpkit/core"
import { dpkit } from "../plugin.js"

export async function savePackage(
  dataPackage: Package,
  options: {
    target: string
    withRemote?: boolean
  },
) {
  for (const plugin of dpkit.plugins) {
    const result = await plugin.savePackage?.(dataPackage, options)
    if (result) return result
  }

  if (options.target.endsWith("datapackage.json")) {
    return await savePackageDescriptor(dataPackage, { path: options.target })
  }

  throw new Error(`No plugin can save the package: ${options.target}`)
}
