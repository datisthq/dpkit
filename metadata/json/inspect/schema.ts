import type { Descriptor } from "../../descriptor/index.ts"
import { ajv } from "../ajv.ts"

export async function inspectJsonSchema(descriptor: Descriptor) {
  const errors: { message: string }[] = []
  await ajv.validateSchema(descriptor)

  for (const error of ajv.errors ?? []) {
    errors.push({ message: error.message ?? error.keyword })
  }

  return errors
}
