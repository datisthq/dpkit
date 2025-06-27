import type { Package, Plugin } from "@dpkit/core"
import { loadPackageFromZip, savePackageToZip } from "./package/index.js"

export class ZipPlugin implements Plugin {
  async loadPackage(source: string) {
    const isZip = getIsZip(source)
    if (!isZip) return undefined

    const dataPackage = await loadPackageFromZip(source)
    return dataPackage
  }

  async savePackage(
    dataPackage: Package,
    options: { target: string; withRemote?: boolean },
  ) {
    const isZip = getIsZip(options.target)
    if (!isZip) return undefined

    await savePackageToZip(dataPackage, {
      archivePath: options.target,
      withRemote: !!options?.withRemote,
    })

    return { path: undefined }
  }
}

function getIsZip(path: string) {
  return path.endsWith(".zip")
}
