import { saveDescriptor } from "../descriptor/save.js"
import type { Resource } from "./Resource.js"

/**
 * Save a Resource to a file path
 * Works in Node.js environments
 */
export async function saveResourceDescriptor(props: {
  resource: Resource
  path: string
}) {
  return saveDescriptor({
    descriptor: props.resource,
    path: props.path,
  })
}
