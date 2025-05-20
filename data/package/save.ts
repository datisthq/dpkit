import type { Package } from "@dpkit/meta"
import { getPackageBasepath } from "./path.js"

export async function savePackageToFolder(props: {
  datapack: Package
  path: string
}) {
  const basepath = getPackageBasepath(props)
}
