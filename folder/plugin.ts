import { stat } from "node:fs/promises"
import type { Plugin } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromFolder } from "./package/index.js"

export class FolderPlugin implements Plugin {
  async loadPackage(source: string) {
    const isFolder = await getIsFolder(source)
    if (!isFolder) return undefined

    const dataPackage = await loadPackageFromFolder(source)
    return dataPackage
  }
}

async function getIsFolder(path: string) {
  const isRemote = isRemotePath(path)
  if (isRemote) return false

  return (await stat(path)).isDirectory()
}
