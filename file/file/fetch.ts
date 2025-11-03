import os from "node:os"
import { isRemotePath } from "@dpkit/core"
import pAll from "p-all"
import { copyFile } from "./copy.ts"
import { getTempFilePath } from "./temp.ts"

export async function prefetchFiles(path?: string | string[]) {
  if (!path) return []

  const paths = Array.isArray(path) ? path : [path]
  const concurrency = os.cpus().length

  const newPaths = await pAll(
    paths.map(path => () => prefetchFile(path)),
    { concurrency },
  )

  return newPaths
}

export async function prefetchFile(path: string) {
  if (!isRemotePath(path)) return path
  const newPath = getTempFilePath()
  await copyFile({ sourcePath: path, targetPath: newPath })
  return newPath
}
