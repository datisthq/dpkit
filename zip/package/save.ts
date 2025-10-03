import { Buffer } from "node:buffer"
import { createWriteStream } from "node:fs"
import { pipeline } from "node:stream/promises"
import type { Descriptor, Package } from "@dpkit/core"
import { convertPackageToDescriptor, stringifyDescriptor } from "@dpkit/core"
import {
  assertLocalPathVacant,
  getPackageBasepath,
  loadFileStream,
  saveResourceFiles,
} from "@dpkit/file"
import { ZipFile } from "yazl"

export async function savePackageToZip(
  dataPackage: Package,
  options: {
    archivePath: string
    withRemote?: boolean
  },
) {
  const { archivePath, withRemote } = options
  const basepath = getPackageBasepath(dataPackage)

  await assertLocalPathVacant(archivePath)
  const zipfile = new ZipFile()

  const resourceDescriptors: Descriptor[] = []
  for (const resource of dataPackage.resources) {
    resourceDescriptors.push(
      await saveResourceFiles(resource, {
        basepath,
        withRemote,
        saveFile: async options => {
          zipfile.addReadStream(
            await loadFileStream(options.normalizedPath),
            options.denormalizedPath,
          )

          return options.denormalizedPath
        },
      }),
    )
  }

  const descriptor = {
    ...convertPackageToDescriptor(dataPackage, { basepath }),
    resources: resourceDescriptors,
  }

  zipfile.addBuffer(
    Buffer.from(stringifyDescriptor(descriptor)),
    "datapackage.json",
  )

  zipfile.end()
  await pipeline(zipfile.outputStream, createWriteStream(archivePath))
}
