import { getBasepath, saveDescriptor } from "../general/index.ts"
import type { Resource } from "./Resource.ts"
import { convertResourceToDescriptor } from "./convert/toDescriptor.ts"

const CURRENT_PROFILE = "https://datapackage.org/profiles/2.0/dataresource.json"

/**
 * Save a Resource to a file path
 * Works in Node.js environments
 */
export async function saveResourceDescriptor(
  resource: Resource,
  options: {
    path: string
    overwrite?: boolean
  },
) {
  const basepath = getBasepath(options.path)

  const descriptor = convertResourceToDescriptor(resource, { basepath })
  descriptor.$schema = descriptor.$schema ?? CURRENT_PROFILE

  await saveDescriptor(descriptor, {
    path: options.path,
    overwrite: options.overwrite,
  })
}
