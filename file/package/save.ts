import type { Package } from "@dpkit/core"
import { getPackageBasepath } from "./path.js"

export async function savePackageToFolder(props: {
  datapack: Package
  path: string
}) {
  const { datapack } = props

  const basepath = getPackageBasepath({ datapack })
  console.log(basepath)
}
