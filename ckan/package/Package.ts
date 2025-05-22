import type { CkanResource } from "../resource/index.js"
import type { CkanOrganization } from "./Organization.js"
import type { CkanTag } from "./Tag.js"

/**
 * CKAN Package interface
 */
export interface CkanPackage {
  /**
   * List of resources
   */
  resources: CkanResource[]

  /**
   * Organization information
   */
  organization?: CkanOrganization

  /**
   * List of tags
   */
  tags: CkanTag[]

  /**
   * Package identifier
   */
  id: string

  /**
   * Package name
   */
  name: string

  /**
   * Package title
   */
  title?: string

  /**
   * Package notes/description
   */
  notes?: string

  /**
   * Package version
   */
  version?: string

  /**
   * License identifier
   */
  license_id?: string

  /**
   * License title
   */
  license_title?: string

  /**
   * License URL
   */
  license_url?: string

  /**
   * Package author
   */
  author?: string

  /**
   * Package author email
   */
  author_email?: string

  /**
   * Package maintainer
   */
  maintainer?: string

  /**
   * Package maintainer email
   */
  maintainer_email?: string

  /**
   * Metadata creation timestamp
   */
  metadata_created?: string

  /**
   * Metadata modification timestamp
   */
  metadata_modified?: string
}
