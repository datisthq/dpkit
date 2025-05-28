import type { Descriptor, Plugin, Package } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromCkan } from "./package/load.js"

export class CkanPlugin implements Plugin {
  async loadPackage<T extends Package>(props: {
    source: string
    options?: Descriptor
  }) {
    const isRemote = isRemotePath({ path: props.source })
    if (!isRemote) return undefined

    const withDataset = props.source.includes("/dataset/")
    if (!withDataset) return undefined

    const cleanup = async () => {}
    const datapackage = await loadPackageFromCkan<T>({
      datasetUrl: props.source,
    })

    return { datapackage, cleanup }
  }
}
