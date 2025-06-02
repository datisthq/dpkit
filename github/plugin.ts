import type { Descriptor, Plugin } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromGithub } from "./package/load.js"

export class GithubPlugin implements Plugin {
  async loadPackage(props: {
    source: string
    options?: Descriptor
  }) {
    const isRemote = isRemotePath({ path: props.source })
    if (!isRemote) return undefined

    const isGithub = new URL(props.source).hostname === "github.com"
    if (!isGithub) return undefined

    const cleanup = async () => {}
    const dataPackage = await loadPackageFromGithub({
      repoUrl: props.source,
    })

    return { dataPackage, cleanup }
  }
}
