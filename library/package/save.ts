import type { SavePackageOptions } from "@dpkit/dataset"
import type { Package } from "@dpkit/metadata"
import { savePackageDescriptor } from "@dpkit/metadata"
import { system } from "../system.ts"

export async function savePackage(
  dataPackage: Package,
  options: SavePackageOptions,
) {
  for (const plugin of system.plugins) {
    const result = await plugin.savePackage?.(dataPackage, {
      plugins: system.plugins,
      ...options,
    })

    if (result) return result
  }

  if (options.target.endsWith("datapackage.json")) {
    return await savePackageDescriptor(dataPackage, { path: options.target })
  }

  throw new Error(`No plugin can save the package: ${options.target}`)
}
