/**
 * CKAN Resource interface
 */
export interface CkanResource {
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
  created?: string

  /**
   * Resource description
   */
  description?: string

  /**
   * Resource format
   */
  format?: string

  /**
   * Resource hash
   */
  hash?: string

  /**
   * Resource identifier
   */
  id?: string

  /**
   * Resource last modification timestamp
   */
  last_modified?: string

  /**
   * Resource metadata modification timestamp
   */
  metadata_modified?: string

  /**
   * Resource MIME type
   */
  mimetype?: string

  /**
   * Resource size in bytes
   */
  size?: number
}
