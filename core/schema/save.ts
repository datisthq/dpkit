import { saveDescriptor } from "../general/index.ts"
import type { Schema } from "./Schema.ts"
import { convertSchemaToDescriptor } from "./convert/toDescriptor.ts"

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
  const descriptor = convertSchemaToDescriptor(schema)
  descriptor.$schema = descriptor.$schema ?? CURRENT_PROFILE

  await saveDescriptor(descriptor, { path: options.path })
}
