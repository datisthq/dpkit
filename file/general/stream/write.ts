import { createWriteStream } from "node:fs"
import { mkdir } from "node:fs/promises"
import { dirname } from "node:path"
import type { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"

export async function writeFileStream(props: {
  stream: Readable
  path: string
}) {
  const { stream, path } = props

  // The "wx" flag ensures that the file won't overwrite an existing file
  await mkdir(dirname(path), { recursive: true })
  await pipeline(stream, createWriteStream(path, { flags: "wx" }))
}
