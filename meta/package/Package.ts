import type { License, Resource, Source } from "../resource/index.js"
import type { Contributor } from "./Contributor.js"

/**
 * Data Package interface based on the Frictionless Data specification
 * @see https://datapackage.org/standard/data-package/
 */
export interface Package {
  /**
   * Unique package identifier
   * Should use lowercase alphanumeric characters, periods, hyphens, and underscores
   */
  name: string

  /**
   * Package schema URL for validation
   */
  $schema?: string

  /**
   * Human-readable title
   */
  title?: string

  /**
   * A description of the package
   */
  description?: string

  /**
   * A URL for the home page of the package
   */
  homepage?: string

  /**
   * Version of the package using SemVer
   * @example "1.0.0"
   */
  version?: string

  /**
   * License information
   */
  licenses?: License[]

  /**
   * List of contributors
   */
  contributors?: Contributor[]

  /**
   * Data sources for this package
   */
  sources?: Source[]

  /**
   * Keywords for the package
   */
  keywords?: string[]

  /**
   * Create time of the package
   * @format ISO 8601 format
   */
  created?: string

  /**
   * Data resources in this package (required)
   */
  resources: Resource[]

  /**
   * Package image
   */
  image?: string
}
