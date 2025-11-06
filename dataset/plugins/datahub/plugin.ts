import { isRemotePath } from "@dpkit/metadata"
import type { DatasetPlugin } from "../../plugin.ts"
import { loadPackageFromDatahub } from "./package/index.ts"

export class DatahubPlugin implements DatasetPlugin {
  async loadPackage(source: string) {
    const isDatahub = getIsDatahub(source)
    if (!isDatahub) return undefined

    const dataPackage = await loadPackageFromDatahub(source)
    return dataPackage
  }
}

function getIsDatahub(path: string) {
  const isRemote = isRemotePath(path)
  if (!isRemote) return false

  return new URL(path).hostname === "datahub.io"
}
