import type { Package } from "@dpkit/core"
import type { ZenodoCreator } from "../Creator.js"
import type { ZenodoPackage } from "../Package.js"

/**
 * Denormalizes a Frictionless Data Package to Zenodo Deposit metadata format
 * @param props Object containing the Package to denormalize
 * @returns Zenodo metadata object for deposit creation/update
 */
export function denormalizeZenodoPackage(
  dataPackage: Package,
): Partial<ZenodoPackage> {
  // Build metadata object
  const metadata: Partial<ZenodoPackage["metadata"]> = {
    upload_type: "dataset", // Default to dataset type
  }

  // Basic metadata
  if (dataPackage.title) {
    metadata.title = dataPackage.title
  }

  if (dataPackage.description) {
    metadata.description = dataPackage.description
  } else if (dataPackage.title) {
    // Fallback to title if no description is provided (required by Zenodo)
    metadata.description = dataPackage.title
  } else {
    metadata.description = "Dataset created with @dpkit/zenodo"
  }

  if (dataPackage.version) {
    metadata.version = dataPackage.version
  }

  // Process license information
  if (dataPackage.licenses && dataPackage.licenses.length > 0) {
    const license = dataPackage.licenses[0]
    if (license?.name) {
      metadata.license = license.name
    }
  }

  // Process contributors as creators
  if (dataPackage.contributors && dataPackage.contributors.length > 0) {
    const creators: ZenodoCreator[] = []

    // First look for authors
    const authors = dataPackage.contributors.filter(c => c.role === "author")
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
      const firstContributor = dataPackage.contributors[0]
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
  if (dataPackage.keywords && dataPackage.keywords.length > 0) {
    metadata.keywords = dataPackage.keywords
  }

  // Return Zenodo deposit structure
  return {
    metadata: metadata as ZenodoPackage["metadata"],
  }
}
