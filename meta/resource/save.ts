import { getBasepath, saveDescriptor } from "../descriptor/index.js"
import type { Resource } from "./Resource.js"
import { processResourceOnSave } from "./process/onSave.js"

/**
 * Save a Resource to a file path
 * Works in Node.js environments
 */
export async function saveResourceDescriptor(props: {
  resource: Resource
  path: string
}) {
  const { resource, path } = props
  const basepath = await getBasepath({ path })

  await processResourceOnSave({ resource, basepath })
  await saveDescriptor({ descriptor: resource, path: props.path })
}
