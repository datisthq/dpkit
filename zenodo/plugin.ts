import type { Descriptor, Plugin } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromZenodo } from "./package/load.js"

export class ZenodoPlugin implements Plugin {
  async loadPackage(props: {
    source: string
    options?: Descriptor
  }) {
    const isRemote = isRemotePath({ path: props.source })
    if (!isRemote) return undefined

    const isZenodo = new URL(props.source).hostname.endsWith("zenodo.org")
    if (!isZenodo) return undefined

    const cleanup = async () => {}
    const datapackage = await loadPackageFromZenodo({
      datasetUrl: props.source,
    })

    return { datapackage, cleanup }
  }
}
