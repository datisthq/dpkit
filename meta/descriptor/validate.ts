import { Ajv } from "ajv"

/**
 * Validate a descriptor (JSON Object) against a JSON Schema
 * It uses Ajv for JSON Schema validation under the hood
 * It returns a list of errors (empty if valid)
 */
export async function validateDescriptor(props: {
  descriptor: Record<string, any>
  profile: Record<string, any>
}) {
  const { descriptor, profile } = props

  const ajv = new Ajv()
  const validate = ajv.compile(profile)
  validate(descriptor)
  return validate.errors ?? []
}
