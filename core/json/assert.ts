import type { Descriptor } from "../descriptor/index.ts"
import type { JsonSchema } from "./JsonSchema.ts"
import { inspectJsonSchema } from "./inspect/schema.ts"

export async function assertJsonSchema(descriptor: Descriptor) {
  const errors = await inspectJsonSchema(descriptor)

  // TODO: Improve consolidated error message
  if (errors.length) {
    throw new Error(
      `JsonSchema "${JSON.stringify(descriptor).slice(0, 100)}" is invalid`,
    )
  }

  return descriptor as JsonSchema
}
