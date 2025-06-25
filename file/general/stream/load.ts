import { createReadStream } from "node:fs"
import { Readable } from "node:stream"
import { isRemotePath } from "@dpkit/core"

export async function loadFileStream(
  pathOrPaths: string | string[],
  options?: { index?: number },
) {
  const index = options?.index ?? 0

  const paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths]
  const path = paths[index]

  if (!path) {
    throw new Error(`Cannot stream resource ${path} at index ${index}`)
  }

  const isRemote = isRemotePath(path)
  const stream = isRemote
    ? await loadRemoteFileStream(path)
    : await loadLocalFileStream(path)

  return stream
}

async function loadRemoteFileStream(path: string) {
  const response = await fetch(path)
  if (!response.body) {
    throw new Error(`Cannot stream remote resource: ${path}`)
  }

  return Readable.fromWeb(response.body)
}

async function loadLocalFileStream(path: string) {
  return createReadStream(path)
}
