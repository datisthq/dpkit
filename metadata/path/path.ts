import slugify from "@sindresorhus/slugify"
import { node } from "../platform/index.ts"

export function isRemotePath(path: string) {
  const protocol = getProtocol(path)
  return protocol !== "file"
}

export function getName(filename?: string) {
  if (!filename) {
    return undefined
  }

  const name = filename.split(".")[0]
  if (!name) {
    return undefined
  }

  return slugify(name)
}

export function getProtocol(path: string) {
  try {
    const url = new URL(path)
    const protocol = url.protocol.replace(":", "")

    // Handle Windows drive letters
    if (protocol.length < 2) {
      return "file"
    }

    return protocol
  } catch {
    return "file"
  }
}

export function getFormat(filename?: string) {
  return filename?.split(".").slice(-1)[0]?.toLowerCase()
}

export function getFilename(path: string) {
  const isRemote = isRemotePath(path)

  if (isRemote) {
    const pathname = new URL(path).pathname
    const filename = pathname.split("/").slice(-1)[0]
    return filename?.includes(".") ? filename : undefined
  }

  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const resolvedPath = node.path.resolve(path)
  const filename = node.path.parse(resolvedPath).base
  return filename?.includes(".") ? filename : undefined
}
