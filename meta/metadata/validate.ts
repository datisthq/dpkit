import { Ajv } from "ajv"

/**
 * Validate a metadata (JSON Object) against a JSON Schema
 * It uses Ajv for JSON Schema validation under the hood
 * It returns a list of errors (empty if valid)
 */
export async function validateMetadata(props: {
  metadata: Record<string, any>
  profile: Record<string, any>
}) {
  const { metadata, profile } = props

  const ajv = new Ajv()
  const validate = ajv.compile(profile)
  validate(metadata)
  return validate.errors ?? []
}
