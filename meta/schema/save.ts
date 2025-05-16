import { saveDescriptor } from "../descriptor/index.js"
import type { Schema } from "./Schema.js"

/**
 * Save a Schema to a file path
 * Works in Node.js environments
 */
export async function saveSchema(props: {
  schema: Schema
  path: string
}) {
  return saveDescriptor({
    descriptor: props.schema,
    path: props.path,
  })
}
