import { saveDescriptor } from "../general/index.js"
import type { Dialect } from "./Dialect.js"
import { denormalizeDialect } from "./process/denormalize.js"

const CURRENT_PROFILE = "https://datapackage.org/profiles/2.0/tabledialect.json"

/**
 * Save a Dialect to a file path
 * Works in Node.js environments
 */
export async function saveDialect(
  dialect: Dialect,
  options: {
    path: string
  },
) {
  const descriptor = denormalizeDialect(dialect)
  descriptor.$schema = descriptor.$schema ?? CURRENT_PROFILE

  await saveDescriptor(descriptor, { path: options.path })
}
