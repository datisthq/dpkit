import type { Plugin } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromDatahub } from "./package/index.js"

export class DatahubPlugin implements Plugin {
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
