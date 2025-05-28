import Slugger from "github-slugger"
import { node } from "./node.js"

export function isRemotePath(props: { path: string }) {
  try {
    new URL(props.path)
    return true
  } catch {
    return false
  }
}

export function getName(props: { filename?: string }) {
  if (!props.filename) {
    return undefined
  }

  const name = props.filename.split(".")[0]
  if (!name) {
    return undefined
  }

  const slugger = new Slugger()
  return slugger.slug(name)
}

export function getFormat(props: { filename?: string }) {
  return props.filename?.split(".").slice(-1)[0]?.toLowerCase()
}

export function getFilename(props: { path: string }) {
  const isRemote = isRemotePath(props)

  if (isRemote) {
    const pathname = new URL(props.path).pathname
    const filename = pathname.split("/").slice(-1)[0]
    return filename?.includes(".") ? filename : undefined
  }

  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const path = node.path.resolve(props.path)
  const filename = node.path.parse(path).base
  return filename?.includes(".") ? filename : undefined
}

export function getBasepath(props: { path: string }) {
  const isRemote = isRemotePath(props)

  if (isRemote) {
    const path = new URL(props.path).toString()
    return path.split("/").slice(0, -1).join("/")
  }

  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const path = node.path.resolve(props.path)
  return node.path.relative(process.cwd(), node.path.parse(path).dir)
}

export function normalizePath(props: {
  path: string
  basepath?: string
}) {
  const isPathRemote = isRemotePath({ path: props.path })
  const isBasepathRemote = isRemotePath({ path: props.basepath ?? "" })

  if (isPathRemote) {
    return new URL(props.path).toString()
  }

  if (isBasepathRemote) {
    const path = new URL([props.basepath, props.path].join("/")).toString()

    if (!path.startsWith(props.basepath ?? "")) {
      throw new Error(
        `Path ${props.path} is not a subpath of ${props.basepath}`,
      )
    }

    return path
  }

  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const path = props.basepath
    ? node.path.join(props.basepath, props.path)
    : props.path

  if (node.path.relative(props.basepath ?? "", path).startsWith("..")) {
    throw new Error(`Path ${props.path} is not a subpath of ${props.basepath}`)
  }

  return node.path.relative(process.cwd(), node.path.resolve(path))
}

export function denormalizePath(props: {
  path: string
  basepath?: string
}) {
  const isPathRemote = isRemotePath({ path: props.path })
  const isBasepathRemote = isRemotePath({ path: props.basepath ?? "" })

  if (isPathRemote) {
    return new URL(props.path).toString()
  }

  if (isBasepathRemote) {
    const path = props.path
    const basepath = new URL(props.basepath ?? "").toString()

    if (!path.startsWith(basepath)) {
      throw new Error(
        `Path ${props.path} is not a subpath of ${props.basepath}`,
      )
    }

    const relative = path.replace(`${basepath}/`, "")
    return relative
  }

  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const path = node.path.resolve(props.path)
  const basepath = node.path.resolve(props.basepath ?? "")

  if (!path.startsWith(basepath)) {
    throw new Error(`Path ${props.path} is not a subpath of ${props.basepath}`)
  }

  // The Data Package standard requires "/" as the path separator
  const relative = node.path.relative(basepath, path)
  return relative.split(node.path.sep).join("/")
}
