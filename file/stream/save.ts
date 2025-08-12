import { createWriteStream } from "node:fs"
import { mkdir } from "node:fs/promises"
import { dirname } from "node:path"
import type { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"

export async function saveFileStream(
  stream: Readable,
  options: {
    path: string
  },
) {
  // It is an equivalent to ensureDir function
  await mkdir(dirname(options.path), { recursive: true })

  // The "wx" flag ensures that the file won't overwrite an existing file
  await pipeline(stream, createWriteStream(options.path, { flags: "wx" }))
}
