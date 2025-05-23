import type { ZenodoCreator } from "./Creator.js"
import type { ZenodoFile } from "../resource/File.js"

/**
 * Zenodo Deposit interface
 */
export interface ZenodoDeposit {
  /**
   * Deposit identifier
   */
  id: number

  /**
   * Deposit URL
   */
  links: {
    self: string
    html: string
    files: string
    publish?: string
    discard?: string
    edit?: string
  }

  /**
   * Deposit metadata
   */
  metadata: {
    /**
     * Title of the deposit
     */
    title: string

    /**
     * Description of the deposit
     */
    description: string

    /**
     * Upload type, e.g., "dataset"
     */
    upload_type: string

    /**
     * Publication date in ISO format (YYYY-MM-DD)
     */
    publication_date?: string

    /**
     * Creators of the deposit
     */
    creators: ZenodoCreator[]

    /**
     * Access right, e.g., "open", "embargoed", "restricted", "closed"
     */
    access_right?: string

    /**
     * License identifier
     */
    license?: string

    /**
     * DOI of the deposit
     */
    doi?: string

    /**
     * Keywords/tags
     */
    keywords?: string[]

    /**
     * Related identifiers (e.g., DOIs of related works)
     */
    related_identifiers?: Array<{
      identifier: string
      relation: string
      scheme: string
    }>

    /**
     * Communities the deposit belongs to
     */
    communities?: Array<{
      identifier: string
    }>

    /**
     * Version of the deposit
     */
    version?: string
  }

  /**
   * Files associated with the deposit
   */
  files: ZenodoFile[]

  /**
   * State of the deposit
   */
  state: "unsubmitted" | "inprogress" | "done"

  /**
   * Submitted flag
   */
  submitted: boolean
}