/**
 * Zenodo Creator interface
 */
export interface ZenodoCreator {
  /**
   * Creator name (format: Family name, Given names)
   */
  name: string

  /**
   * Creator affiliation
   */
  affiliation?: string

  /**
   * Creator identifiers (e.g., ORCID)
   */
  identifiers?: Array<{
    identifier: string
    scheme: string
  }>
}
