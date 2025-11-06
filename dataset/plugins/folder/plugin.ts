import { stat } from "node:fs/promises"
import { isRemotePath } from "@dpkit/metadata"
import type { DatasetPlugin } from "../../plugin.ts"
import { loadPackageFromFolder } from "./package/index.ts"

export class FolderPlugin implements DatasetPlugin {
  async loadPackage(source: string) {
    const isFolder = await getIsFolder(source)
    if (!isFolder) return undefined

    const dataPackage = await loadPackageFromFolder(source)
    return dataPackage
  }

  // TOOD: implement savePackage?
}

async function getIsFolder(path: string) {
  const isRemote = isRemotePath(path)
  if (isRemote) return false

  return (await stat(path)).isDirectory()
}
