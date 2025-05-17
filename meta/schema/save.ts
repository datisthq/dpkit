import { saveDescriptor } from "../descriptor/index.js"
import type { Schema } from "./Schema.js"
import { processSchemaOnSave } from "./process/onSave.js"

/**
 * Save a Schema to a file path
 * Works in Node.js environments
 */
export async function saveSchema(props: {
  schema: Schema
  path: string
}) {
  const { schema, path } = props

  await processSchemaOnSave({ schema })
  await saveDescriptor({ descriptor: schema, path })
}
