import { createReadStream } from "node:fs"
import { Readable, Transform } from "node:stream"
import { isRemotePath } from "@dpkit/core"

export async function loadFileStream(
  path: string | string[],
  options?: {
    index?: number
    maxBytes?: number
  },
) {
  const index = options?.index ?? 0

  const paths = Array.isArray(path) ? path : [path]
  const indexPath = paths[index]

  if (!indexPath) {
    throw new Error(`Cannot stream resource ${indexPath} at index ${index}`)
  }

  const isRemote = isRemotePath(indexPath)
  const stream = isRemote
    ? await loadRemoteFileStream(indexPath, options)
    : await loadLocalFileStream(indexPath, options)

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
          this.push(null)
          callback()
          return
        }

        total += chunk.length
        callback(null, chunk)
      },
    }),
  )
}
