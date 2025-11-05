import type { Package } from "@dpkit/metadata"
import type { DatasetPlugin } from "../../plugin.ts"
import { loadPackageFromZip, savePackageToZip } from "./package/index.ts"

export class ZipPlugin implements DatasetPlugin {
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
