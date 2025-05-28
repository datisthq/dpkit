import type { Descriptor } from "@dpkit/core"
import { loadPackageDescriptor } from "@dpkit/core"
import { dpkit } from "../general/index.js"

export async function loadPackage(props: {
  source: string
  options?: Descriptor
}) {
  for (const plugin of dpkit.plugins) {
    const result = await plugin.loadPackage?.(props)
    if (result) return result
  }

  if (props.source.endsWith("datapackage.json")) {
    const cleanup = async () => {}
    const datapackage = await loadPackageDescriptor({ path: props.source })
    return { datapackage, cleanup }
  }

  throw new Error(`No plugin can load the package: ${props.source}`)
}
