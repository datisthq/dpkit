import type { Descriptor } from "../descriptor/index.ts"
import { validateDescriptor } from "../profile/index.ts"
import { loadProfile } from "../profile/index.ts"
import type { Dialect } from "./Dialect.ts"
import { convertDialectFromDescriptor } from "./convert/fromDescriptor.ts"

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/tabledialect.json"

/**
 * Validate a Dialect descriptor (JSON Object) against its profile
 */
export async function validateDialect(source: Descriptor | Dialect) {
  const descriptor = source as Descriptor

  const $schema =
    typeof descriptor.$schema === "string"
      ? descriptor.$schema
      : DEFAULT_PROFILE

  const profile = await loadProfile($schema)
  const { valid, errors } = await validateDescriptor(descriptor, { profile })

  let dialect: Dialect | undefined = undefined
  if (valid) {
    // Validation + normalization = we can cast it
    dialect = convertDialectFromDescriptor(descriptor) as Dialect
  }

  return { valid, errors, dialect }
}
