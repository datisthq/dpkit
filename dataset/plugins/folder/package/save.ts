import { join } from "node:path"
import { convertPackageToDescriptor, saveDescriptor } from "@dpkit/metadata"
import type { Descriptor, Package } from "@dpkit/metadata"
import { assertLocalPathVacant, copyFile } from "../../../file/index.ts"
import { createFolder } from "../../../folder/index.ts"
import { getPackageBasepath } from "../../../package/index.ts"
import { saveResourceFiles } from "../../../resource/index.ts"

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
        saveFile: async options => {
          await copyFile({
            sourcePath: options.normalizedPath,
            targetPath: join(folderPath, options.denormalizedPath),
          })

          return options.denormalizedPath
        },
      }),
    )
  }

  const descriptor = {
    ...convertPackageToDescriptor(dataPackage, { basepath }),
    resources: resourceDescriptors,
  }

  await saveDescriptor(descriptor, {
    path: join(folderPath, "datapackage.json"),
  })

  return descriptor
}
