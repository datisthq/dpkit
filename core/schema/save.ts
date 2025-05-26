import { saveDescriptor } from "../general/index.js"
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

  const descriptor = denormalizeSchema({ schema })

  descriptor.$schema =
    descriptor.$schema ?? descriptor.profile ?? CURRENT_PROFILE

  await saveDescriptor({ descriptor, path })
}

const CURRENT_PROFILE = "https://datapackage.org/profiles/2.0/tableschema.json"
