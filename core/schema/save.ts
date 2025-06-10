import { saveDescriptor } from "../general/index.js"
import type { Schema } from "./Schema.js"
import { denormalizeSchema } from "./process/denormalize.js"

const CURRENT_PROFILE = "https://datapackage.org/profiles/2.0/tableschema.json"

/**
 * Save a Schema to a file path
 * Works in Node.js environments
 */
export async function saveSchema(
  schema: Schema,
  options: {
    path: string
  },
) {
  const descriptor = denormalizeSchema(schema)
  descriptor.$schema = descriptor.$schema ?? CURRENT_PROFILE

  await saveDescriptor(descriptor, { path: options.path })
}
