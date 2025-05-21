import { access, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { denormalizePackage, saveDescriptor } from "@dpkit/core"
import type { Descriptor, Package } from "@dpkit/core"
import { saveFileToDisc } from "../general/index.js"
import { saveResourceFile } from "../resource/index.js"
import { getPackageBasepath } from "./path.js"

export async function savePackageToFolder(props: {
  path: string
  datapack: Package
  withRemote?: boolean
}) {
  const { datapack, path, withRemote } = props
  const basepath = getPackageBasepath({ datapack })

  await createFolderOrThrowIfExist({ path })

  const resourceDescriptors: Descriptor[] = []
  for (const resource of datapack.resources) {
    resourceDescriptors.push(
      await saveResourceFile({
        resource,
        basepath,
        withRemote,
        saveFile: props => {
          const sourcePath = props.normalizedPath
          const targetPath = join(path, props.denormalizedPath)
          return saveFileToDisc({ sourcePath, targetPath })
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

async function createFolderOrThrowIfExist(props: { path: string }) {
  const isExist = await isFolderExist({ path: props.path })

  if (isExist) {
    throw new Error(`path "${props.path}" already exists`)
  }

  await mkdir(props.path, { recursive: true })
}

async function isFolderExist(props: { path: string }) {
  try {
    await access(props.path)
    return true
  } catch (error) {
    return false
  }
}
