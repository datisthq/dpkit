import type { Package } from "@dpkit/core"
import type { Contributor, License } from "@dpkit/core"

/**
 * Camera Trap Data Package interface based on the TDWG specification
 * @see https://camtrap-dp.tdwg.org/metadata/
 */
export interface CamtrapPackage extends Package {
  /**
   * Package profile identifier
   * @required
   */
  profile: string

  /**
   * Creation date of the package
   * @required
   * @format ISO 8601
   */
  created: string

  /**
   * Contributors to the package
   * @required
   */
  contributors: CamtrapContributor[]

  /**
   * Project metadata
   * @required
   */
  project: {
    /**
     * Project identifier
     */
    id?: string

    /**
     * Project title
     * @required
     */
    title: string

    /**
     * Project acronym
     */
    acronym?: string

    /**
     * Project description
     */
    description?: string

    /**
     * Project URL or path
     */
    path?: string

    /**
     * Sampling design methodology
     * @required
     */
    samplingDesign:
      | "simpleRandom"
      | "systematicRandom"
      | "clusteredRandom"
      | "experimental"
      | "targeted"
      | "opportunistic"

    /**
     * Capture method used
     * @required
     */
    captureMethod: Array<"activityDetection" | "timeLapse">

    /**
     * Whether individual animals were identified
     * @required
     */
    individualAnimals: boolean

    /**
     * Level at which observations are recorded
     * @required
     */
    observationLevel: Array<"media" | "event">
  }

  /**
   * Spatial coverage of the data
   * @required
   */
  spatial: GeoJSON

  /**
   * Temporal coverage of the data
   * @required
   */
  temporal: {
    /**
     * Start date of temporal coverage
     * @required
     * @format ISO 8601
     */
    start: string

    /**
     * End date of temporal coverage
     * @required
     * @format ISO 8601
     */
    end: string
  }

  /**
   * Taxonomic coverage of the data
   * @required
   */
  taxonomic: TaxonomicCoverage[]

  /**
   * Precision of geographic coordinates
   */
  coordinatePrecision?: number

  /**
   * Bibliographic citation for the dataset
   */
  bibliographicCitation?: string

  /**
   * Related identifiers for the dataset
   */
  relatedIdentifiers?: RelatedIdentifier[]

  /**
   * Licenses for the package
   * Extended with scope property
   */
  licenses?: CamtrapLicense[]
}

/**
 * GeoJSON specification for spatial data
 */
export interface GeoJSON {
  type: string
  coordinates?: number[] | number[][] | number[][][] | number[][][][]
  geometries?: any[]
  bbox?: number[]
  properties?: Record<string, any>
}

/**
 * Taxonomic Coverage specification
 */
export interface TaxonomicCoverage {
  /**
   * Scientific name of the taxon
   */
  scientificName: string

  /**
   * Taxonomic identifier
   */
  taxonID?: string

  /**
   * Taxonomic rank
   */
  taxonRank?:
    | "kingdom"
    | "phylum"
    | "class"
    | "order"
    | "family"
    | "genus"
    | "species"
    | "subspecies"

  /**
   * Kingdom classification
   */
  kingdom?: string

  /**
   * Phylum classification
   */
  phylum?: string

  /**
   * Class classification
   */
  class?: string

  /**
   * Order classification
   */
  order?: string

  /**
   * Family classification
   */
  family?: string

  /**
   * Genus classification
   */
  genus?: string

  /**
   * Vernacular (common) names by language code
   */
  vernacularNames?: Record<string, string>
}

/**
 * Related identifier specification
 */
export interface RelatedIdentifier {
  /**
   * Identifier value
   */
  identifier: string

  /**
   * Relationship type
   */
  relation:
    | "isPartOf"
    | "hasPart"
    | "isVersionOf"
    | "isSourceOf"
    | "isDerivedFrom"
    | "isDocumentedBy"
    | "documents"
    | "isReferencedBy"
    | "references"

  /**
   * Identifier scheme
   */
  scheme?: "DOI" | "ARK" | "URL" | "HANDLE" | "PURL"
}

/**
 * Extended Contributor interface specific to Camera Trap Data Package
 */
export interface CamtrapContributor extends Contributor {
  /**
   * Role of the contributor in the project
   */
  role?:
    | "contact"
    | "principalInvestigator"
    | "rightsHolder"
    | "publisher"
    | "contributor"
}

/**
 * Extended License interface specific to Camera Trap Data Package
 */
export interface CamtrapLicense extends License {
  /**
   * Scope of the license
   */
  scope: "data" | "media"
}
