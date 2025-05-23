import type { Descriptor, Package } from "@dpkit/core"
import { savePackageDescriptor } from "@dpkit/core"
import { dpkit } from "../general/index.js"

export async function savePackage(props: {
  datapackage: Package
  target: string
  options?: Descriptor
}) {
  for (const plugin of dpkit.plugins) {
    const result = await plugin.savePackage?.(props)
    if (result) return result
  }

  if (props.target.endsWith("datapackage.json")) {
    return await savePackageDescriptor({
      datapackage: props.datapackage,
      path: props.target,
    })
  }

  throw new Error(`No plugin can save the package: ${props.target}`)
}
