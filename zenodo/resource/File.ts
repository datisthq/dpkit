/**
 * Zenodo File interface
 */
export interface ZenodoFile {
  /**
   * File identifier
   */
  id: string

  /**
   * File name
   */
  filename: string

  /**
   * File size in bytes
   */
  filesize: number

  /**
   * File checksum
   */
  checksum: string

  /**
   * Links related to the file
   */
  links: {
    self: string
    download: string
  }
}
