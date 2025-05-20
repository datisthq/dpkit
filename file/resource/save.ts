import type { Resource } from "@dpkit/core"
import { denormalizePath, isRemotePath, isTableResource } from "@dpkit/core"
import { join } from "node:path"
import { readFileStream } from "./stream/read.js"
import { writeFileStream } from "./stream/write.js"

export async function saveResourceToFolder(props: {
  resource: Resource
  folder: string
  basepath?: string
  withRemote?: boolean
}) {
  const { resource, basepath, folder, withRemote } = props
  const files = getResourceFiles({ resource })

  await Promise.all(
    files.map(file => saveResourceFile({ file, folder, basepath, withRemote })),
  )
}

type ResourceFile = {
  path: string
  isRemote: boolean
}

function getResourceFiles(props: { resource: Resource }) {
  const { resource } = props
  const files: ResourceFile[] = []

  if (resource.path) {
    const paths = Array.isArray(resource.path) ? resource.path : [resource.path]

    for (const path of paths) {
      const isRemote = isRemotePath({ path })
      files.push({ path, isRemote })
    }
  }

  if (isTableResource(resource)) {
    for (const name of ["dialect", "schema"] as const) {
      const path = resource[name]
      if (typeof path === "string") {
        const isRemote = isRemotePath({ path })
        files.push({ path, isRemote })
      }
    }
  }

  return files
}

async function saveResourceFile(props: {
  file: ResourceFile
  folder: string
  basepath?: string
  // TODO: implement
  withRemote?: boolean
}) {
  const { file, folder, basepath } = props

  const sourcePath = file.path
  const targetPath = join(folder, denormalizePath({ ...file, basepath }))

  const stream = await readFileStream({ path: sourcePath })
  await writeFileStream({ stream, path: targetPath })
}
