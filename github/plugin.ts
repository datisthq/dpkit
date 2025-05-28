import type { Descriptor, Plugin, Package } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromGithub } from "./package/load.js"

export class GithubPlugin implements Plugin {
  async loadPackage<T extends Package = Package>(props: {
    source: string
    options?: Descriptor
  }) {
    const isRemote = isRemotePath({ path: props.source })
    if (!isRemote) return undefined

    const isGithub = new URL(props.source).hostname === "github.com"
    if (!isGithub) return undefined

    const cleanup = async () => {}
    const datapackage = await loadPackageFromGithub<T>({
      repoUrl: props.source,
    })

    return { datapackage, cleanup }
  }
}
