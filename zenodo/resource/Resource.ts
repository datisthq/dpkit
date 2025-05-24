/**
 * Zenodo File interface
 */
export interface ZenodoResource {
  /**
   * File identifier
   */
  id: string

  /**
   * File key
   */
  key: string

  /**
   * File size in bytes
   */
  size: number

  /**
   * File checksum
   */
  checksum: string

  /**
   * Links related to the file
   */
  links: {
    self: string
  }
}
