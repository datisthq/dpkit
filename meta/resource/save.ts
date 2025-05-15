import { saveDescriptor } from "../descriptor/save.js"
import type { Resource } from "./Resource.js"

/**
 * Save a Resource to a file path
 * Works in Node.js environments
 */
export async function saveResource(props: {
  resource: Resource
  path: string
}) {
  const { resource, path } = props

  return saveDescriptor({
    descriptor: resource,
    path,
  })
}
