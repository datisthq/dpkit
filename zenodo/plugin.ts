import type { Plugin } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromZenodo } from "./package/load.js"

export class ZenodoPlugin implements Plugin {
  async loadPackage(source: string) {
    const isZenodo = getIsZenodo(source)
    if (!isZenodo) return undefined

    const cleanup = async () => {}
    const dataPackage = await loadPackageFromZenodo(source)

    return { dataPackage, cleanup }
  }
}

function getIsZenodo(path: string) {
  const isRemote = isRemotePath(path)
  if (!isRemote) return false

  return new URL(path).hostname.endsWith("zenodo.org")
}
