import type { Descriptor } from "../descriptor/index.ts"
import type { JsonSchema } from "./JsonSchema.ts"
import { ajv } from "./ajv.ts"

export async function assertJsonSchema(descriptor: Descriptor) {
  const errors: { message: string }[] = []
  await ajv.validateSchema(descriptor)

  for (const error of ajv.errors ?? []) {
    errors.push({ message: error.message ?? error.keyword })
  }

  // TODO: Improve consolidated error message
  if (errors.length) {
    throw new Error(
      `JsonSchema "${JSON.stringify(descriptor).slice(0, 100)}" is invalid`,
    )
  }

  return descriptor as JsonSchema
}
