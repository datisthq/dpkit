import type { Package, Plugin } from "@dpkit/core"
import { loadPackageFromZip, savePackageToZip } from "./package/index.js"

export class ZipPlugin implements Plugin {
  async loadPackage(source: string) {
    const isZip = source.endsWith(".zip")
    if (!isZip) return undefined

    const { dataPackage, cleanup } = await loadPackageFromZip(source)

    return { dataPackage, cleanup }
  }

  async savePackage(
    dataPackage: Package,
    options: { target: string; withRemote?: boolean },
  ) {
    const isZip = options.target.endsWith(".zip")
    if (!isZip) return undefined

    await savePackageToZip(dataPackage, {
      archivePath: options.target,
      withRemote: !!options?.withRemote,
    })

    return { path: undefined }
  }
}
