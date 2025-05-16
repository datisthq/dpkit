import type { ErrorObject } from "ajv"

export interface DescriptorError extends ErrorObject {
  type: "descriptor"
}
