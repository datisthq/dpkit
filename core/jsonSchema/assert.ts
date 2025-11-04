import type { Descriptor } from "../descriptor/index.ts"
import type { JsonSchema } from "./JsonSchema.ts"

// TODO: Implement validation
export async function assertJsonSchema(descriptor: Descriptor) {
  return descriptor as JsonSchema
}
