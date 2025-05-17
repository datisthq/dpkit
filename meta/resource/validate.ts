import { type Descriptor, validateDescriptor } from "../descriptor/index.js"
import { loadProfile } from "../descriptor/index.js"
import type { Resource } from "./Resource.js"
import { processResourceOnLoad } from "./process/onLoad.js"

/**
 * Validate a Resource descriptor (JSON Object) against its profile
 */
export async function validateResourceDescriptor(props: {
  descriptor: Descriptor
  basepath?: string
}) {
  const { descriptor, basepath } = props
  let resource: Resource | undefined = undefined

  const $schema = props.descriptor.$schema ?? DEFAULT_PROFILE
  const profile = await loadProfile({ path: $schema })

  const { valid, errors } = await validateDescriptor({ descriptor, profile })

  if (valid) {
    processResourceOnLoad({ descriptor, basepath })
    resource = descriptor as Resource
  }

  return { valid, errors, resource }
}

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/dataresource.json"
