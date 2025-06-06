import type { Plugin } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromGithub } from "./package/load.js"

export class GithubPlugin implements Plugin {
  async loadPackage(source: string) {
    const isRemote = isRemotePath(source)
    if (!isRemote) return undefined

    const isGithub = new URL(source).hostname === "github.com"
    if (!isGithub) return undefined

    const cleanup = async () => {}
    const dataPackage = await loadPackageFromGithub(source)

    return { dataPackage, cleanup }
  }
}
