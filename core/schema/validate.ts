import { type Descriptor, validateDescriptor } from "../general/index.js"
import { loadProfile } from "../general/index.js"
import type { Schema } from "./Schema.js"
import { normalizeSchema } from "./process/normalize.js"

/**
 * Validate a Schema descriptor (JSON Object) against its profile
 */
export async function validateSchema(props: {
  descriptor: Descriptor
}) {
  const { descriptor } = props
  let schema: Schema | undefined = undefined

  const $schema =
    typeof props.descriptor.$schema === "string"
      ? props.descriptor.$schema
      : DEFAULT_PROFILE

  const profile = await loadProfile({ path: $schema })
  const { valid, errors } = await validateDescriptor({ ...props, profile })

  if (valid) {
    // Validation + normalization = we can cast it
    schema = normalizeSchema({ descriptor }) as unknown as Schema
  }

  return { valid, errors, schema }
}

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/tableschema.json"
