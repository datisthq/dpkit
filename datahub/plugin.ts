import type { Plugin } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromDatahub } from "./package/index.js"

export class DatahubPlugin implements Plugin {
  async loadPackage(source: string) {
    const isRemote = isRemotePath(source)
    if (!isRemote) return undefined

    const isDatahub = new URL(source).hostname === "datahub.io"
    if (!isDatahub) return undefined

    const cleanup = async () => {}
    const dataPackage = await loadPackageFromDatahub(source)

    return { dataPackage, cleanup }
  }
}
