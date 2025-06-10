import type { Plugin } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromCkan } from "./package/load.js"

export class CkanPlugin implements Plugin {
  async loadPackage(source: string) {
    const isRemote = isRemotePath(source)
    if (!isRemote) return undefined

    const withDataset = source.includes("/dataset/")
    if (!withDataset) return undefined

    const cleanup = async () => {}
    const dataPackage = await loadPackageFromCkan(source)

    return { dataPackage, cleanup }
  }
}
