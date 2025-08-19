import type { BaseError } from "./Base.ts"

/**
 * A descriptor error
 */
export interface MetadataError extends BaseError {
  type: "metadata"
  keyword: string
  instancePath: string
  schemaPath: string
  params: object
  propertyName?: string
  message?: string
  schema?: any
  parentSchema?: object
  data?: any
}
