import { stat } from "node:fs/promises"
import type { Descriptor, Plugin } from "@dpkit/core"
import { isRemotePath } from "@dpkit/core"
import { loadPackageFromFolder } from "./package/index.js"

export class FilePlugin implements Plugin {
  async loadPackage(props: {
    source: string
    options?: Descriptor
  }) {
    const isRemote = isRemotePath({ path: props.source })
    if (isRemote) return undefined

    const isFolder = (await stat(props.source)).isDirectory()
    if (!isFolder) return undefined

    const cleanup = async () => {}
    const datapackage = await loadPackageFromFolder({
      folderPath: props.source,
    })

    return { datapackage, cleanup }
  }
}
