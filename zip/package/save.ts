import { createWriteStream } from "node:fs"
import { pipeline } from "node:stream/promises"
import type { Descriptor, Package } from "@dpkit/core"
import { denormalizePackage, stringifyDescriptor } from "@dpkit/core"
import {
  assertLocalPathVacant,
  getPackageBasepath,
  readFileStream,
  saveResourceFile,
} from "@dpkit/file"
import { ZipFile } from "yazl"

export async function savePackageToZip(props: {
  datapackage: Package
  archivePath: string
  withRemote?: boolean
}) {
  const { archivePath, datapackage, withRemote } = props
  const basepath = getPackageBasepath({ datapackage })

  await assertLocalPathVacant({ path: archivePath })
  const zipfile = new ZipFile()

  const resourceDescriptors: Descriptor[] = []
  for (const resource of datapackage.resources) {
    resourceDescriptors.push(
      await saveResourceFile({
        resource,
        basepath,
        withRemote,
        saveFile: async props => {
          zipfile.addReadStream(
            await readFileStream({ path: props.normalizedPath }),
            props.denormalizedPath,
          )
        },
      }),
    )
  }

  const descriptor = {
    ...denormalizePackage({ datapackage, basepath }),
    resources: resourceDescriptors,
  }

  zipfile.addBuffer(
    Buffer.from(stringifyDescriptor({ descriptor })),
    "datapackage.json",
  )

  zipfile.end()
  await pipeline(zipfile.outputStream, createWriteStream(archivePath))
}
