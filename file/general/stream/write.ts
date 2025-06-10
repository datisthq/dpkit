import { createWriteStream } from "node:fs"
import { mkdir } from "node:fs/promises"
import { dirname } from "node:path"
import type { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"

export async function writeFileStream(
  stream: Readable,
  options: {
    path: string
  },
) {
  // The "wx" flag ensures that the file won't overwrite an existing file
  await mkdir(dirname(options.path), { recursive: true })
  await pipeline(stream, createWriteStream(options.path, { flags: "wx" }))
}
