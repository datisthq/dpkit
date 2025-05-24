import { join } from "node:path"
import { denormalizePackage, saveDescriptor } from "@dpkit/core"
import type { Descriptor, Package } from "@dpkit/core"
import { saveFileToDisc } from "../general/index.js"
import { assertLocalPathVacant, createFolder } from "../general/index.js"
import { saveResourceFiles } from "../resource/index.js"
import { getPackageBasepath } from "./path.js"

export async function savePackageToFolder(props: {
  folderPath: string
  datapackage: Package
  withRemote?: boolean
}) {
  const { folderPath, datapackage, withRemote } = props
  const basepath = getPackageBasepath({ datapackage })

  await assertLocalPathVacant({ path: folderPath })
  await createFolder({ path: folderPath })

  const resourceDescriptors: Descriptor[] = []
  for (const resource of datapackage.resources) {
    resourceDescriptors.push(
      await saveResourceFiles({
        resource,
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
    ...denormalizePackage({ datapackage, basepath }),
    resources: resourceDescriptors,
  }

  await saveDescriptor({
    descriptor,
    path: join(folderPath, "datapackage.json"),
  })

  return descriptor
}
