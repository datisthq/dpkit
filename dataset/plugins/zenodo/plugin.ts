import type { Plugin } from "@dpkit/metadata"
import { isRemotePath } from "@dpkit/metadata"
import { loadPackageFromZenodo } from "./package/load.ts"

export class ZenodoPlugin implements Plugin {
  async loadPackage(source: string) {
    const isZenodo = getIsZenodo(source)
    if (!isZenodo) return undefined

    const dataPackage = await loadPackageFromZenodo(source)
    return dataPackage
  }
}

function getIsZenodo(path: string) {
  const isRemote = isRemotePath(path)
  if (!isRemote) return false

  return new URL(path).hostname.endsWith("zenodo.org")
}
