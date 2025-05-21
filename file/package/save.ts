import { join } from "node:path"
import { mkdir, access } from "node:fs/promises"
import { denormalizePackage, saveDescriptor } from "@dpkit/core"
import { saveResourceFile } from "../resource/index.js"
import { saveFile } from "../general/index.js"
import { getPackageBasepath } from "./path.js"
import type { Descriptor, Package } from "@dpkit/core"

export async function savePackageToFolder(props: {
  folder: string
  datapack: Package
  withRemote?: boolean
}) {
  const { datapack, folder, withRemote } = props
  const basepath = getPackageBasepath({ datapack })

  await createFolderOrThrowIfExist({ folder })

  // There are pros and cons of doing it in parallel (introduce flag?)
  const resourceDescriptors: Descriptor[] = []
  for (const resource of datapack.resources) {
    resourceDescriptors.push(
      await saveResourceFile({
        folder,
        resource,
        basepath,
        withRemote,
        saveFile,
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
