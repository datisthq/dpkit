import { createReadStream } from "node:fs"
import { Readable, Transform } from "node:stream"
import { isRemotePath } from "@dpkit/core"

export async function loadFileStream(
  pathOrPaths: string | string[],
  options?: {
    index?: number
    maxBytes?: number
  },
) {
  const index = options?.index ?? 0

  const paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths]
  const path = paths[index]

  if (!path) {
    throw new Error(`Cannot stream resource ${path} at index ${index}`)
  }

  const isRemote = isRemotePath(path)
  const stream = isRemote
    ? await loadRemoteFileStream(path, options)
    : await loadLocalFileStream(path, options)

  return stream
}

async function loadRemoteFileStream(
  path: string,
  options?: { maxBytes?: number },
) {
  const response = await fetch(path)
  if (!response.body) {
    throw new Error(`Cannot stream remote resource: ${path}`)
  }

  let stream = Readable.fromWeb(response.body)

  if (options?.maxBytes) {
    stream = limitBytesStream(stream, options.maxBytes)
  }

  return stream
}

async function loadLocalFileStream(
  path: string,
  options?: { maxBytes?: number },
) {
  const end = options?.maxBytes ? options.maxBytes - 1 : undefined
  return createReadStream(path, { end })
}

function limitBytesStream(inputStream: Readable, maxBytes: number) {
  let total = 0
  return inputStream.pipe(
    new Transform({
      transform(chunk, _encoding, callback) {
        if (total >= maxBytes) {
          callback(new Error("Byte limit exceeded"))
          return
        }

        total += chunk.length
        callback(null, chunk)
      },
    }),
  )
}
