import { saveDescriptor } from "../descriptor/index.js"
import type { Schema } from "./Schema.js"
import { denormalizeSchema } from "./process/denormalize.js"

/**
 * Save a Schema to a file path
 * Works in Node.js environments
 */
export async function saveSchema(props: {
  schema: Schema
  path: string
}) {
  const { schema, path } = props

  denormalizeSchema({ schema })
  await saveDescriptor({ descriptor: schema, path })
}
