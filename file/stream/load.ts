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
    ? await loadRemoteFileStream(path)
    : await loadLocalFileStream(path)

  return stream
}

// TODO: support maxBytes
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
  return createReadStream(path, { end: options?.maxBytes })
}

function limitBytesStream(inputStream: Readable, maxBytes: number) {
  let total = 0
  return inputStream.pipe(
    new Transform({
      transform(chunk, _encoding, callback) {
        total += chunk.length
        if (total > maxBytes) {
          callback(new Error("Byte limit exceeded"))
        } else {
          callback(null, chunk)
        }
      },
    }),
  )
}
