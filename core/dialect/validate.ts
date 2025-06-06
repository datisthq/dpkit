import { type Descriptor, validateDescriptor } from "../general/index.js"
import { loadProfile } from "../general/index.js"
import type { Dialect } from "./Dialect.js"
import { normalizeDialect } from "./process/normalize.js"

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/tabledialect.json"

/**
 * Validate a Dialect descriptor (JSON Object) against its profile
 */
export async function validateDialect(props: {
  descriptor: Descriptor | Dialect
}) {
  const descriptor = props.descriptor as Descriptor

  const $schema =
    typeof descriptor.$schema === "string"
      ? descriptor.$schema
      : DEFAULT_PROFILE

  const profile = await loadProfile({ path: $schema })
  const { valid, errors } = await validateDescriptor({ descriptor, profile })

  let dialect: Dialect | undefined = undefined
  if (valid) {
    // Validation + normalization = we can cast it
    dialect = normalizeDialect({ descriptor }) as Dialect
  }

  return { valid, errors, dialect }
}
