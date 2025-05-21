import { access, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { denormalizePackage, saveDescriptor } from "@dpkit/core"
import type { Descriptor, Package } from "@dpkit/core"
import { saveFileToDisc } from "../general/index.js"
import { saveResourceFile } from "../resource/index.js"
import { getPackageBasepath } from "./path.js"

export async function savePackageToFolder(props: {
  folder: string
  datapack: Package
  withRemote?: boolean
}) {
  const { datapack, folder, withRemote } = props
  const basepath = getPackageBasepath({ datapack })

  await createFolderOrThrowIfExist({ folder })

  const resourceDescriptors: Descriptor[] = []
  for (const resource of datapack.resources) {
    resourceDescriptors.push(
      await saveResourceFile({
        resource,
        basepath,
        withRemote,
        saveFile: props => {
          const sourcePath = props.normalizedPath
          const targetPath = join(folder, props.denormalizedPath)
          return saveFileToDisc({ sourcePath, targetPath })
        },
      }),
    )
  }

  const descriptor = {
    ...denormalizePackage({ datapack, basepath }),
    resources: resourceDescriptors,
  }

  await saveDescriptor({ descriptor, path: join(folder, "datapackage.json") })
  return descriptor
}

async function createFolderOrThrowIfExist(props: { folder: string }) {
  const isExist = await isFolderExist({ folder: props.folder })

  if (isExist) {
    throw new Error(`Folder "${props.folder}" already exists`)
  }

  await mkdir(props.folder, { recursive: true })
}

async function isFolderExist(props: { folder: string }) {
  try {
    await access(props.folder)
    return true
  } catch (error) {
    return false
  }
}
