import type { Package, SavePackageOptions } from "@dpkit/core"
import { savePackageDescriptor } from "@dpkit/core"
import { dpkit } from "../plugin.ts"

export async function savePackage(
  dataPackage: Package,
  options: SavePackageOptions,
) {
  for (const plugin of dpkit.plugins) {
    const result = await plugin.savePackage?.(dataPackage, {
      plugins: dpkit.plugins,
      ...options,
    })

    if (result) return result
  }

  if (options.target.endsWith("datapackage.json")) {
    return await savePackageDescriptor(dataPackage, { path: options.target })
  }

  throw new Error(`No plugin can save the package: ${options.target}`)
}
