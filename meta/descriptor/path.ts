import { loadNodeApis } from "./node.js"

export function isRemotePath(props: { path: string }) {
  try {
    new URL(props.path)
    return true
  } catch {
    return false
  }
}

export async function getBasepath(props: { path: string }) {
  const node = await loadNodeApis()
  const isRemote = isRemotePath(props)

  const sep = isRemote ? (node?.path.sep ?? "/") : "/"
  return props.path.split(sep).slice(0, -1).join(sep)
}

export async function normalizePath(props: {
  path: string
  basepath?: string
}) {
  if (!props.basepath) {
    return props.path
  }

  const isPathRemote = isRemotePath({ path: props.path })
  if (isPathRemote) {
    return props.path
  }

  let sep = "/"
  const isBasepathRemote = isRemotePath({ path: props.basepath ?? "" })
  if (!isBasepathRemote) {
    const node = await loadNodeApis()
    sep = node?.path.sep ?? "/"
  }

  return [props.basepath, props.path].join(sep)
}

export async function denormalizePath(props: {
  path: string
  basepath?: string
}) {
  if (!props.basepath) {
    return props.path
  }

  const isPathRemote = isRemotePath({ path: props.path })
  if (isPathRemote) {
    return props.path
  }

  let sep = "/"
  const isBasepathRemote = isRemotePath({ path: props.basepath ?? "" })
  if (!isBasepathRemote) {
    const node = await loadNodeApis()
    sep = node?.path.sep ?? "/"
  }

  const path = props.path.replace(new RegExp(`^${props.basepath}${sep}`), "")
  if (props.basepath && props.path === path) {
    throw new Error(`Path ${props.path} is not a subpath of ${props.basepath}`)
  }

  // The standard requires to use Unix-style paths
  return path.split(sep).join("/")
}
