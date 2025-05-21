import type { Contributor, Package } from "@dpkit/core"
import type { License } from "@dpkit/core"
import { normalizeCkanResource } from "../../resource/process/normalize.js"
import type { CkanPackage } from "../Package.js"

/**
 * Normalizes a CKAN package to Frictionless Data package format
 * @param props Object containing the CKAN package to normalize
 * @returns Normalized Package object
 */
export function normalizeCkanPackage(props: {
  ckanPackage: CkanPackage
}): Package {
  const { ckanPackage } = props

  // Create base package object
  const normalizedPackage: Package = {
    // Map basic properties
    name: ckanPackage.name,
    title: ckanPackage.title,
    description: ckanPackage.notes,
    version: ckanPackage.version,

    // Initialize empty resources array (will be populated below)
    resources: [],
  }

  // Process resources
  if (ckanPackage.resources && ckanPackage.resources.length > 0) {
    normalizedPackage.resources = ckanPackage.resources.map(resource =>
      normalizeCkanResource({ ckanResource: resource }),
    )
  }

  // Process license information
  if (ckanPackage.license_id) {
    const license: License = {
      name: ckanPackage.license_id,
    }

    if (ckanPackage.license_title) {
      license.title = ckanPackage.license_title
    }

    if (ckanPackage.license_url) {
      license.path = ckanPackage.license_url
    }

    normalizedPackage.licenses = [license]
  }

  // Process contributors
  const contributors: Contributor[] = []

  // Add author if present
  if (ckanPackage.author) {
    const authorContributor: Contributor = {
      title: ckanPackage.author,
      role: "author",
    }

    if (ckanPackage.author_email) {
      authorContributor.email = ckanPackage.author_email
    }

    contributors.push(authorContributor)
  }

  // Add maintainer if present
  if (ckanPackage.maintainer) {
    const maintainerContributor: Contributor = {
      title: ckanPackage.maintainer,
      role: "maintainer",
    }

    if (ckanPackage.maintainer_email) {
      maintainerContributor.email = ckanPackage.maintainer_email
    }

    contributors.push(maintainerContributor)
  }

  if (contributors.length > 0) {
    normalizedPackage.contributors = contributors
  }

  // Process tags as keywords
  if (ckanPackage.tags && ckanPackage.tags.length > 0) {
    normalizedPackage.keywords = ckanPackage.tags.map(tag => tag.name)
  }

  // Process creation date if available
  if (ckanPackage.metadata_created) {
    normalizedPackage.created = ckanPackage.metadata_created
  }

  return normalizedPackage
}
