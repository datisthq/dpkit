import { isRemotePath } from "@dpkit/metadata"
import type { DatasetPlugin } from "../../plugin.ts"
import { loadPackageFromCkan } from "./package/load.ts"

export class CkanPlugin implements DatasetPlugin {
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
