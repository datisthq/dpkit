import type { Contributor, License, Package } from "@dpkit/core"
import { normalizeZenodoResource } from "../../resource/index.js"
import type { ZenodoPackage } from "../Package.js"

/**
 * Normalizes a Zenodo deposit to Frictionless Data package format
 * @param props Object containing the Zenodo deposit to normalize
 * @returns Normalized Package object
 */
export function normalizeZenodoPackage(props: {
  zenodoPackage: ZenodoPackage
}): Package {
  const { zenodoPackage } = props

  const datapackage: Package = {
    name: `record-${zenodoPackage.id}`,
    resources: [],
  }

  const metadata = zenodoPackage.metadata

  // Basic metadata
  datapackage.title = metadata.title
  datapackage.description = metadata.description

  if (metadata.version) {
    datapackage.version = metadata.version
  }

  // Process files/resources
  if (zenodoPackage.files && zenodoPackage.files.length > 0) {
    datapackage.resources = zenodoPackage.files.map(zenodoResource =>
      normalizeZenodoResource({ zenodoResource }),
    )
  }

  // Process license information
  if (metadata.license) {
    const license: License = {
      name: metadata.license,
    }
    datapackage.licenses = [license]
  }

  // Process contributors
  if (metadata.creators && metadata.creators.length > 0) {
    const contributors: Contributor[] = metadata.creators.map(creator => {
      const contributor: Contributor = {
        title: creator.name,
        role: "author",
      }

      if (creator.affiliation) {
        // Store affiliation in path as there's no dedicated field
        contributor.path = creator.affiliation
      }

      return contributor
    })

    datapackage.contributors = contributors
  }

  // Process keywords
  if (metadata.keywords && metadata.keywords.length > 0) {
    datapackage.keywords = metadata.keywords
  }

  // Store publication date as created date
  if (metadata.publication_date) {
    datapackage.created = metadata.publication_date
  }

  // DOI can be stored as a metadata property, but we don't have a direct mapping in the Package type
  // For now, we'll skip storing the DOI in the normalized package

  return datapackage
}
