import { Buffer } from "node:buffer"
import { writeFile } from "node:fs/promises"
import type { Readable } from "node:stream"
import type { Descriptor, Package } from "@dpkit/metadata"
import { stringifyDescriptor } from "@dpkit/metadata"
import { convertPackageToDescriptor } from "@dpkit/metadata"
import { zip } from "fflate"
import { assertLocalPathVacant } from "../../../file/index.ts"
import { getPackageBasepath } from "../../../package/index.ts"
import { saveResourceFiles } from "../../../resource/index.ts"
import { loadFileStream } from "../../../stream/index.ts"

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
  const files: Record<string, Uint8Array> = {}

  const resourceDescriptors: Descriptor[] = []
  for (const resource of dataPackage.resources) {
    resourceDescriptors.push(
      await saveResourceFiles(resource, {
        basepath,
        withRemote,
        saveFile: async options => {
          const stream = await loadFileStream(options.normalizedPath)
          const buffer = await streamToBuffer(stream)
          files[options.denormalizedPath] = buffer

          return options.denormalizedPath
        },
      }),
    )
  }

  const descriptor = {
    ...convertPackageToDescriptor(dataPackage, { basepath }),
    resources: resourceDescriptors,
  }

  files["datapackage.json"] = Buffer.from(stringifyDescriptor(descriptor))

  const zipData = await new Promise<Uint8Array>((resolve, reject) => {
    zip(files, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })

  await writeFile(archivePath, zipData)
}

async function streamToBuffer(stream: Readable) {
  const chunks: Uint8Array[] = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}
