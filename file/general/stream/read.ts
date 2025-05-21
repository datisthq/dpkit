import { createReadStream } from "node:fs"
import { Readable } from "node:stream"
import { isRemotePath } from "@dpkit/core"

export async function readFileStream(props: {
  path: string | string[]
  index?: number
}) {
  const index = props.index ?? 0

  const paths = Array.isArray(props.path) ? props.path : [props.path]
  const path = paths[index]

  if (!path) {
    throw new Error(`Cannot stream resource ${path} at index ${index}`)
  }

  const isRemote = isRemotePath({ path })
  const stream = isRemote
    ? await readRemoteFileStream({ path })
    : await readLocalFileStream({ path })

  return stream
}

async function readRemoteFileStream(props: { path: string }) {
  const { path } = props

  const response = await fetch(path)
  if (!response.body) {
    throw new Error(`Cannot stream remote resource: ${path}`)
  }

  return Readable.fromWeb(response.body)
}

async function readLocalFileStream(props: { path: string }) {
  const { path } = props

  return createReadStream(path)
}
