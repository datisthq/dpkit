import slugify from "@sindresorhus/slugify"
import { node } from "./node.ts"

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

export function normalizePath(path: string, options: { basepath?: string }) {
  const isPathRemote = isRemotePath(path)
  const isBasepathRemote = isRemotePath(options.basepath ?? "")

  if (isPathRemote) {
    return new URL(path).toString()
  }

  if (isBasepathRemote) {
    const normalizedPath = new URL(
      [options.basepath, path].join("/"),
    ).toString()

    if (!normalizedPath.startsWith(options.basepath ?? "")) {
      throw new Error(`Path ${path} is not a subpath of ${options.basepath}`)
    }

    return normalizedPath
  }

  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const normalizedPath = options.basepath
    ? node.path.join(options.basepath, path)
    : path

  const relativePath = node.path.relative(
    options.basepath ?? "",
    normalizedPath,
  )

  if (relativePath.startsWith("..")) {
    throw new Error(`Path ${path} is not a subpath of ${options.basepath}`)
  }

  return node.path.relative(process.cwd(), node.path.resolve(normalizedPath))
}

export function denormalizePath(path: string, options: { basepath?: string }) {
  const isPathRemote = isRemotePath(path)
  const isBasepathRemote = isRemotePath(options.basepath ?? "")

  if (isPathRemote) {
    return new URL(path).toString()
  }

  if (isBasepathRemote) {
    const basepath = new URL(options.basepath ?? "").toString()

    if (!path.startsWith(basepath)) {
      throw new Error(`Path ${path} is not a subpath of ${options.basepath}`)
    }

    const relative = path.replace(`${basepath}/`, "")
    return relative
  }

  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const normalizedPath = node.path.resolve(path)
  const normalizedBasepath = node.path.resolve(options.basepath ?? "")

  if (!normalizedPath.startsWith(normalizedBasepath)) {
    throw new Error(`Path ${path} is not a subpath of ${options.basepath}`)
  }

  // The Data Package standard requires "/" as the path separator
  const relative = node.path.relative(normalizedBasepath, normalizedPath)
  return relative.split(node.path.sep).join("/")
}
