import { saveDescriptor } from "../general/index.ts"
import type { Schema } from "./Schema.ts"
import { denormalizeSchema } from "./denormalize.ts"

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
