import type { Contributor, License, Package } from "@dpkit/core"
import { normalizeZenodoFile } from "../../resource/process/normalize.js"
import type { ZenodoDeposit } from "../Deposit.js"

/**
 * Normalizes a Zenodo deposit to Frictionless Data package format
 * @param props Object containing the Zenodo deposit to normalize
 * @returns Normalized Package object
 */
export function normalizeZenodoDeposit(props: {
  zenodoDeposit: ZenodoDeposit
}): Package {
  const { zenodoDeposit } = props

  const datapackage: Package = {
    name: `deposit-${zenodoDeposit.id}`,
    resources: [],
  }

  const metadata = zenodoDeposit.metadata

  // Basic metadata
  datapackage.title = metadata.title
  datapackage.description = metadata.description

  if (metadata.version) {
    datapackage.version = metadata.version
  }

  // Process files/resources
  if (zenodoDeposit.files && zenodoDeposit.files.length > 0) {
    datapackage.resources = zenodoDeposit.files.map(file =>
      normalizeZenodoFile({ zenodoFile: file }),
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