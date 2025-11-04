import type { JsonSchema } from "./JsonSchema.ts"
import { loadJsonSchema } from "./load.ts"

export async function resolveJsonSchema(jsonSchema?: JsonSchema | string) {
  if (!jsonSchema) {
    return undefined
  }

  if (typeof jsonSchema !== "string") {
    return jsonSchema
  }

  return await loadJsonSchema(jsonSchema)
}
