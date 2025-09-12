import { createWriteStream } from "node:fs"
import { mkdir } from "node:fs/promises"
import { dirname } from "node:path"
import type { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"

export async function saveFileStream(
  stream: Readable,
  options: {
    path: string
    overwrite?: boolean
  },
) {
  const { path, overwrite } = options

  // It is an equivalent to ensureDir function that won't overwrite an existing directory
  await mkdir(dirname(path), { recursive: true })

  await pipeline(
    stream,
    // The "wx" flag ensures that the file won't overwrite an existing file
    createWriteStream(path, { flags: overwrite ? "w" : "wx" }),
  )
}
