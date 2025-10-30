import { loadSchema } from "../schema/index.ts"
import type { Schema } from "./Schema.ts"

export async function resolveSchema(schema?: Schema | string) {
  if (!schema) {
    return undefined
  }

  if (typeof schema !== "string") {
    return schema
  }

  return await loadSchema(schema)
}
