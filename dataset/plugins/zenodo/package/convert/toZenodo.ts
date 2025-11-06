import type { Package } from "@dpkit/metadata"
import type { ZenodoCreator } from "../Creator.ts"
import type { ZenodoPackage } from "../Package.ts"

export function convertPackageToZenodo(
  dataPackage: Package,
): Partial<ZenodoPackage> {
  const metadata: Partial<ZenodoPackage["metadata"]> = {
    upload_type: "dataset",
  }

  if (dataPackage.title) {
    metadata.title = dataPackage.title
  }

  if (dataPackage.description) {
    metadata.description = dataPackage.description
  } else if (dataPackage.title) {
    metadata.description = dataPackage.title
  } else {
    metadata.description = "Dataset created with @dpkit/zenodo"
  }

  if (dataPackage.version) {
    metadata.version = dataPackage.version
  }

  if (dataPackage.licenses && dataPackage.licenses.length > 0) {
    const license = dataPackage.licenses[0]
    if (license?.name) {
      metadata.license = license.name
    }
  }

  if (dataPackage.contributors && dataPackage.contributors.length > 0) {
    const creators: ZenodoCreator[] = []

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
      metadata.creators = [
        {
          name: "Unknown Author",
          affiliation: "Unknown Affiliation",
        },
      ]
    }
  } else {
    metadata.creators = [
      {
        name: "Unknown Author",
        affiliation: "Unknown Affiliation",
      },
    ]
  }

  if (dataPackage.keywords && dataPackage.keywords.length > 0) {
    metadata.keywords = dataPackage.keywords
  }

  return {
    metadata: metadata as ZenodoPackage["metadata"],
  }
}
