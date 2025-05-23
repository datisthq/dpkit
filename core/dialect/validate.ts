import { type Descriptor, validateDescriptor } from "../general/index.js"
import { loadProfile } from "../general/index.js"
import type { Dialect } from "./Dialect.js"
import { normalizeDialect } from "./process/normalize.js"

/**
 * Validate a Dialect descriptor (JSON Object) against its profile
 */
export async function validateDialect(props: {
  descriptor: Descriptor
}) {
  const { descriptor } = props
  let dialect: Dialect | undefined = undefined

  const $dialect = props.descriptor.$dialect ?? DEFAULT_PROFILE
  const profile = await loadProfile({ path: $dialect })

  const { valid, errors } = await validateDescriptor({ ...props, profile })

  if (valid) {
    // Validation + normalization = we can cast it
    dialect = normalizeDialect({ descriptor }) as Dialect
  }

  return { valid, errors, dialect }
}

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/tabledialect.json"
