import type { Descriptor, Plugin } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromCkan } from "./package/load.js"

export class CkanPlugin implements Plugin {
  async loadPackage(props: {
    source: string
    options?: Descriptor
  }) {
    const isRemote = isRemotePath({ path: props.source })
    if (!isRemote) return undefined

    const withDataset = props.source.includes("/dataset/")
    if (!withDataset) return undefined

    const cleanup = async () => {}
    const dataPackage = await loadPackageFromCkan({
      datasetUrl: props.source,
    })

    return { dataPackage, cleanup }
  }
}
