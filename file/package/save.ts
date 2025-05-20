import type { Package } from "@dpkit/core"
import { getPackageBasepath } from "./path.js"

export async function savePackageToFolder(props: {
  datapack: Package
  path: string
}) {
  const basepath = getPackageBasepath(props)
  console.log(basepath)
}
