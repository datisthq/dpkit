import type { Plugin } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromZenodo } from "./package/load.js"

export class ZenodoPlugin implements Plugin {
  async loadPackage(source: string) {
    const isRemote = isRemotePath(source)
    if (!isRemote) return undefined

    const isZenodo = new URL(source).hostname.endsWith("zenodo.org")
    if (!isZenodo) return undefined

    const cleanup = async () => {}
    const dataPackage = await loadPackageFromZenodo(source)

    return { dataPackage, cleanup }
  }
}
