import type { Plugin } from "@dpkit/metadata"
import { isRemotePath } from "@dpkit/metadata"
import { loadPackageFromGithub } from "./package/load.ts"

export class GithubPlugin implements Plugin {
  async loadPackage(source: string) {
    const isGithub = getIsGithub(source)
    if (!isGithub) return undefined

    const dataPackage = await loadPackageFromGithub(source)
    return dataPackage
  }
}

function getIsGithub(path: string) {
  const isRemote = isRemotePath(path)
  if (!isRemote) return false

  return new URL(path).hostname === "github.com"
}
