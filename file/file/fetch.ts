import { isRemotePath } from "@dpkit/core"
import { copyFile } from "./copy.js"
import { getTempFilePath } from "./temp.js"

export async function prefetchFiles(path?: string | string[]) {
  if (!path) return []
  const paths = Array.isArray(path) ? path : [path]
  const newPaths = await Promise.all(paths.map(prefetchFile))
  return newPaths
}

export async function prefetchFile(path: string) {
  if (!isRemotePath(path)) return path
  const newPath = getTempFilePath()
  await copyFile({ sourcePath: path, targetPath: newPath })
  return newPath
}
