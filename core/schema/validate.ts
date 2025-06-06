import { type Descriptor, validateDescriptor } from "../general/index.js"
import { loadProfile } from "../general/index.js"
import type { Schema } from "./Schema.js"
import { normalizeSchema } from "./process/normalize.js"

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/tableschema.json"

/**
 * Validate a Schema descriptor (JSON Object) against its profile
 */
export async function validateSchema(descriptorOrSchema: Descriptor | Schema) {
  const descriptor = descriptorOrSchema as Descriptor

  const $schema =
    typeof descriptor.$schema === "string"
      ? descriptor.$schema
      : DEFAULT_PROFILE

  const profile = await loadProfile($schema)
  const { valid, errors } = await validateDescriptor(descriptor, { profile })

  let schema: Schema | undefined = undefined
  if (valid) {
    // Validation + normalization = we can cast it
    schema = normalizeSchema(descriptor) as unknown as Schema
  }

  return { valid, errors, schema }
}
