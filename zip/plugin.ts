import type { Descriptor, Package, Plugin } from "@dpkit/core"
import { loadPackageFromZip, savePackageToZip } from "./package/index.js"

export class ZipPlugin implements Plugin {
  async loadPackage<T extends Package>(props: {
    source: string
    options?: Descriptor
  }) {
    const isZip = props.source.endsWith(".zip")
    if (!isZip) return undefined

    const { datapackage, cleanup } = await loadPackageFromZip<T>({
      archivePath: props.source,
    })

    return { datapackage, cleanup }
  }

  async savePackage(props: {
    datapackage: Package
    target: string
    options?: Descriptor
  }) {
    const isZip = props.target.endsWith(".zip")
    if (!isZip) return undefined

    await savePackageToZip({
      datapackage: props.datapackage,
      archivePath: props.target,
      withRemote: !!props.options?.withRemote,
    })

    return { path: undefined }
  }
}
