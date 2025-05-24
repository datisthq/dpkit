import type { Package } from "@dpkit/core"
import type { ZenodoCreator } from "../Creator.js"
import type { ZenodoPackage } from "../Package.js"

/**
 * Denormalizes a Frictionless Data Package to Zenodo Deposit metadata format
 * @param props Object containing the Package to denormalize
 * @returns Zenodo metadata object for deposit creation/update
 */
export function denormalizeZenodoPackage(props: {
  datapackage: Package
}): Partial<ZenodoPackage> {
  const { datapackage } = props

  // Build metadata object
  const metadata: Partial<ZenodoPackage["metadata"]> = {
    upload_type: "dataset", // Default to dataset type
  }

  // Basic metadata
  if (datapackage.title) {
    metadata.title = datapackage.title
  }

  if (datapackage.description) {
    metadata.description = datapackage.description
  } else if (datapackage.title) {
    // Fallback to title if no description is provided (required by Zenodo)
    metadata.description = datapackage.title
  } else {
    metadata.description = "Dataset created with @dpkit/zenodo"
  }

  if (datapackage.version) {
    metadata.version = datapackage.version
  }

  // Process license information
  if (datapackage.licenses && datapackage.licenses.length > 0) {
    const license = datapackage.licenses[0]
    if (license?.name) {
      metadata.license = license.name
    }
  }

  // Process contributors as creators
  if (datapackage.contributors && datapackage.contributors.length > 0) {
    const creators: ZenodoCreator[] = []

    // First look for authors
    const authors = datapackage.contributors.filter(c => c.role === "author")
    if (authors.length > 0) {
      authors.forEach(author => {
        const creator: ZenodoCreator = {
          name: author.title,
        }

        if (author.path) {
          creator.affiliation = author.path
        }

        creators.push(creator)
      })
    } else {
      // If no authors, use any contributor
      const firstContributor = datapackage.contributors[0]
      if (firstContributor) {
        const creator: ZenodoCreator = {
          name: firstContributor.title,
        }

        if (firstContributor.path) {
          creator.affiliation = firstContributor.path
        }

        creators.push(creator)
      }
    }

    if (creators.length > 0) {
      metadata.creators = creators
    } else {
      // Zenodo requires at least one creator
      metadata.creators = [
        {
          name: "Unknown Author",
          affiliation: "Unknown Affiliation",
        },
      ]
    }
  } else {
    // Zenodo requires at least one creator
    metadata.creators = [
      {
        name: "Unknown Author",
        affiliation: "Unknown Affiliation",
      },
    ]
  }

  // Process keywords
  if (datapackage.keywords && datapackage.keywords.length > 0) {
    metadata.keywords = datapackage.keywords
  }

  // Return Zenodo deposit structure
  return {
    metadata: metadata as ZenodoPackage["metadata"],
  }
}
