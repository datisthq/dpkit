import { join } from "node:path"
import { denormalizePackage, saveDescriptor } from "@dpkit/core"
import type { Descriptor, Package } from "@dpkit/core"
import {
  assertLocalPathVacant,
  getPackageBasepath,
  saveFileToDisc,
  saveResourceFiles,
} from "@dpkit/file"
import { createFolder } from "../folder/index.js"

export async function savePackageToFolder(
  dataPackage: Package,
  options: {
    folderPath: string
    withRemote?: boolean
  },
) {
  const basepath = getPackageBasepath(dataPackage)
  const { folderPath, withRemote } = options

  await assertLocalPathVacant(folderPath)
  await createFolder(folderPath)

  const resourceDescriptors: Descriptor[] = []
  for (const resource of dataPackage.resources) {
    resourceDescriptors.push(
      await saveResourceFiles(resource, {
        basepath,
        withRemote,
        saveFile: async props => {
          await saveFileToDisc({
            sourcePath: props.normalizedPath,
            targetPath: props.denormalizedPath,
          })

          return props.denormalizedPath
        },
      }),
    )
  }

  const descriptor = {
    ...denormalizePackage(dataPackage, { basepath }),
    resources: resourceDescriptors,
  }

  await saveDescriptor(descriptor, {
    path: join(folderPath, "datapackage.json"),
  })

  return descriptor
}
