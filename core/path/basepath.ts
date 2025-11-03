import { node } from "../system/index.ts"
import { isRemotePath } from "./path.ts"

export async function resolveBasepath(path: string) {
  const isRemote = isRemotePath(path)

  // Resolves redirects
  if (isRemote) {
    const url = new URL(path)
    const response = await fetch(url.toString(), { method: "HEAD" })
    path = response.url
  }

  return getBasepath(path)
}

export function getBasepath(path: string) {
  const isRemote = isRemotePath(path)

  if (isRemote) {
    const normalizedPath = new URL(path).toString()
    return normalizedPath.split("/").slice(0, -1).join("/")
  }

  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const resolvedPath = node.path.resolve(path)
  return node.path.relative(process.cwd(), node.path.parse(resolvedPath).dir)
}
