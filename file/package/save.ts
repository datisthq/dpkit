import { join } from "node:path"
import { type Package, denormalizePackage, saveDescriptor } from "@dpkit/core"
import { getPackageBasepath } from "./path.js"

export async function savePackageToFolder(props: {
  path: string
  datapack: Package
  withRemote?: boolean
}) {
  const { datapack, path } = props

  const basepath = getPackageBasepath({ datapack })
  const descriptor = denormalizePackage({ datapack, basepath })

  await saveDescriptor({ descriptor, path: join(path, "datapackage.json") })

  console.log(basepath)
}
