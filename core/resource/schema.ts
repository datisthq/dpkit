import { loadSchema } from "../schema/index.ts"
import type { Resource } from "./Resource.ts"

export async function loadResourceSchema(schema: Resource["schema"]) {
  if (!schema) {
    return undefined
  }

  if (typeof schema !== "string") {
    return schema
  }

  return await loadSchema(schema)
}
