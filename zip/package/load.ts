import { createWriteStream } from "node:fs"
import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { pipeline } from "node:stream/promises"
import { loadPackageDescriptor } from "@dpkit/core"
import { getTempFolderPath } from "@dpkit/folder"
import yauzl from "yauzl-promise"

export async function loadPackageFromZip(archivePath: string) {
  const basepath = getTempFolderPath()
  const zipfile = await yauzl.open(archivePath)

  try {
    for await (const entry of zipfile) {
      const path = join(basepath, entry.filename)

      if (entry.filename.endsWith("/")) {
        await mkdir(path, { recursive: true })
        continue
      }

      const readStream = await entry.openReadStream()
      const writeStream = createWriteStream(path)

      await pipeline(readStream, writeStream)
    }
  } finally {
    await zipfile.close()
  }

  const dataPackage = await loadPackageDescriptor(
    join(basepath, "datapackage.json"),
  )

  return dataPackage
}
