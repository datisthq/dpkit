import type { SetRequired } from "type-fest"
import type { CkanSchema } from "../schema/index.js"

/**
 * CKAN Resource interface
 */
export interface CkanResource {
  /**
   * Resource identifier
   */
  id: string

  /**
   * Resource URL
   */
  url: string

  /**
   * Resource name
   */
  name: string

  /**
   * Resource creation timestamp
   */
  created: string

  /**
   * Resource description
   */
  description: string

  /**
   * Resource format
   */
  format: string

  /**
   * Resource hash
   */
  hash: string

  /**
   * Resource last modification timestamp
   */
  last_modified: string

  /**
   * Resource metadata modification timestamp
   */
  metadata_modified: string

  /**
   * Resource MIME type
   */
  mimetype: string

  /**
   * Resource size in bytes
   */
  size: number

  /**
   * Resource schema
   */
  schema?: CkanSchema
}

export type NewCkanResource = SetRequired<Partial<CkanResource>, "url" | "name">
