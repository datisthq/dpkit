import { type Descriptor, validateDescriptor } from "../descriptor/index.js"
import { loadProfile } from "../descriptor/index.js"

/**
 * Validate a Schema descriptor (JSON Object) against its profile
 */
export async function validateSchema(props: {
  descriptor: Descriptor
}) {
  const $schema = props.descriptor.$schema ?? DEFAULT_PROFILE
  const profile = await loadProfile({ path: $schema })

  return await validateDescriptor({ ...props, profile })
}

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/tableschema.json"
