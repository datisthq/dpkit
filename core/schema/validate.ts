import type { Descriptor } from "../descriptor/index.ts"
import { validateDescriptor } from "../profile/index.ts"
import type { Schema } from "./Schema.ts"
import { convertSchemaFromDescriptor } from "./convert/fromDescriptor.ts"

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/tableschema.json"

/**
 * Validate a Schema descriptor (JSON Object) against its profile
 */
export async function validateSchema(source: Descriptor | Schema) {
  const descriptor = source as Descriptor

  const profile =
    typeof descriptor.$schema === "string"
      ? descriptor.$schema
      : DEFAULT_PROFILE

  const { valid, errors } = await validateDescriptor(descriptor, { profile })

  let schema: Schema | undefined = undefined
  if (valid) {
    // Validation + normalization = we can cast it
    schema = convertSchemaFromDescriptor(descriptor) as unknown as Schema
  }

  return { valid, errors, schema }
}
