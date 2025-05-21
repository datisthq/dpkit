import { node } from "./node.js"

export function isRemotePath(props: { path: string }) {
  try {
    new URL(props.path)
    return true
  } catch {
    return false
  }
}

export function getBasename(props: { path: string }) {
  const isRemote = isRemotePath(props)

  if (isRemote) {
    const path = new URL(props.path).toString()
    return path.split("/").slice(-1)[0] as string
  }

  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const path = node.path.resolve(props.path)
  return node.path.parse(path).base
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
  const isBasepathRemote = isRemotePath({ path: props.basepath ?? "" })
  const isPathRemote = isRemotePath({ path: props.path })
  const isRemote = isBasepathRemote || isPathRemote

  if (isRemote) {
    const path = !isPathRemote
      ? [props.basepath, props.path].join("/")
      : props.path

    // Returns normalized remote path
    return new URL(path).toString()
  }

  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const path = props.basepath
    ? node.path.join(props.basepath, props.path)
    : props.path

  // Returns normalized local path
  return node.path.relative(process.cwd(), node.path.resolve(path))
}

export function denormalizePath(props: {
  path: string
  basepath?: string
}) {
  const isBasepathRemote = isRemotePath({ path: props.basepath ?? "" })
  const isPathRemote = isRemotePath({ path: props.path })
  const isRemote = isBasepathRemote || isPathRemote

  if (isRemote) {
    const path = new URL(props.path).toString()
    if (isPathRemote) {
      return path
    }

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

  const relative = node.path.relative(basepath, path)
  return relative.split(node.path.sep).join("/")
}
