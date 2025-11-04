import { loadDescriptor } from "../descriptor/index.ts"
import { jsonSchemaCache } from "./cache.ts"
import { assertJsonSchema } from "./assert.ts"

export async function loadJsonSchema(
  path: string,
  options?: { onlyRemote?: boolean },
) {
  let jsonSchema = jsonSchemaCache.get(path)

  if (!jsonSchema) {
    const descriptor = await loadDescriptor(path, options)
    jsonSchema = await assertJsonSchema(descriptor)
    jsonSchemaCache.set(path, descriptor)
  }

  return jsonSchema
}
