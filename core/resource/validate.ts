import { type Descriptor, validateDescriptor } from "../general/index.js"
import { loadProfile } from "../general/index.js"
import type { Resource } from "./Resource.js"
import { normalizeResource } from "./process/normalize.js"

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
    // Validation + normalization = we can cast it
    resource = normalizeResource({ descriptor, basepath }) as Resource
  }

  return { valid, errors, resource }
}

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/dataresource.json"
