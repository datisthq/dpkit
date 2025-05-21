import { join } from "node:path"
import { denormalizePackage, saveDescriptor } from "@dpkit/core"
import type { Descriptor, Package } from "@dpkit/core"
import { saveFileToDisc } from "../general/index.js"
import { saveResourceFile } from "../resource/index.js"
import {
  assertLocalPathVacant,
  createFolder,
  getPackageBasepath,
} from "./path.js"

export async function savePackageToFolder(props: {
  path: string
  datapack: Package
  withRemote?: boolean
}) {
  const { path, datapack, withRemote } = props
  const basepath = getPackageBasepath({ datapack })

  await assertLocalPathVacant({ path })
  await createFolder({ path })

  const resourceDescriptors: Descriptor[] = []
  for (const resource of datapack.resources) {
    resourceDescriptors.push(
      await saveResourceFile({
        resource,
        basepath,
        withRemote,
        saveFile: async props => {
          return await saveFileToDisc({
            sourcePath: props.normalizedPath,
            targetPath: props.denormalizedPath,
          })
        },
      }),
    )
  }

  const descriptor = {
    ...denormalizePackage({ datapack, basepath }),
    resources: resourceDescriptors,
  }

  await saveDescriptor({ descriptor, path: join(path, "datapackage.json") })
  return descriptor
}
