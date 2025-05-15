import { saveDescriptor } from "../descriptor/save.js"
import type { Schema } from "./Schema.js"

/**
 * Save a Schema to a file path
 * Works in Node.js environments
 */
export async function saveSchema(props: { schema: Schema; path: string }) {
  const { schema, path } = props

  return saveDescriptor({
    descriptor: schema,
    path,
  })
}
