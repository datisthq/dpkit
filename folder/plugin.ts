import { stat } from "node:fs/promises"
import type { Plugin } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromFolder } from "./package/index.js"

export class FolderPlugin implements Plugin {
  async loadPackage(source: string) {
    const isRemote = isRemotePath(source)
    if (isRemote) return undefined

    const isFolder = (await stat(source)).isDirectory()
    if (!isFolder) return undefined

    const cleanup = async () => {}
    const dataPackage = await loadPackageFromFolder(source)

    return { dataPackage, cleanup }
  }
}
