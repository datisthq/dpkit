import { isRemotePath } from "../path/index.ts"
import type { Resource } from "./Resource.ts"

export function isRemoteResource(resource: Resource) {
  const path = Array.isArray(resource.path) ? resource.path[0] : resource.path
  return path ? isRemotePath(path) : false
}
