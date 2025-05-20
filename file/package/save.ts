import { join } from "node:path"
import { type Package, denormalizePackage, saveDescriptor } from "@dpkit/core"
import { saveResourceToFolder } from "../resource/index.js"
import { getPackageBasepath } from "./path.js"

export async function savePackageToFolder(props: {
  folder: string
  datapack: Package
  withRemote?: boolean
}) {
  const { datapack, folder, withRemote } = props

  const basepath = getPackageBasepath({ datapack })
  const descriptor = denormalizePackage({ datapack, basepath })

  // It ensures that the folder exists
  await saveDescriptor({ descriptor, path: join(folder, "datapackage.json") })

  for (const resource of datapack.resources) {
    await saveResourceToFolder({ resource, basepath, folder, withRemote })
  }
}
