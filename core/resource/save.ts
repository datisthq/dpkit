import { getBasepath, saveDescriptor } from "../general/index.js"
import type { Resource } from "./Resource.js"
import { denormalizeResource } from "./process/denormalize.js"

/**
 * Save a Resource to a file path
 * Works in Node.js environments
 */
export async function saveResourceDescriptor(props: {
  resource: Resource
  path: string
}) {
  const { resource, path } = props
  const basepath = getBasepath({ path })

  const descriptor = denormalizeResource({ resource, basepath })
  await saveDescriptor({ descriptor, path })
}
