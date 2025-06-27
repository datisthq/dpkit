import type { Plugin } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromCkan } from "./package/load.js"

export class CkanPlugin implements Plugin {
  async loadPackage(source: string) {
    const isCkan = getIsCkan(source)
    if (!isCkan) return undefined

    const dataPackage = await loadPackageFromCkan(source)
    return dataPackage
  }
}

function getIsCkan(path: string) {
  const isRemote = isRemotePath(path)
  if (!isRemote) return false

  return path.includes("/dataset/")
}
