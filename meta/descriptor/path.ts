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

export async function joinBasepath(props: { path: string; basepath: string }) {
  const node = await loadNodeApis()
  const isRemote = isRemotePath(props)

  const sep = isRemote ? (node?.path.sep ?? "/") : "/"
  return [props.basepath, props.path].join(sep)
}
