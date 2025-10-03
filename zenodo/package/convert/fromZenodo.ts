import type { Contributor, License, Package } from "@dpkit/core"
import { convertResourceFromZenodo } from "../../resource/index.ts"
import type { ZenodoPackage } from "../Package.ts"

export function convertPackageFromZenodo(
  zenodoPackage: ZenodoPackage,
): Package {
  const datapackage: Package = {
    name: `record-${zenodoPackage.id}`,
    resources: [],
  }

  const metadata = zenodoPackage.metadata

  datapackage.title = metadata.title
  datapackage.description = metadata.description

  if (metadata.version) {
    datapackage.version = metadata.version
  }

  if (zenodoPackage.files && zenodoPackage.files.length > 0) {
    datapackage.resources = zenodoPackage.files.map(zenodoResource =>
      convertResourceFromZenodo(zenodoResource),
    )
  }

  if (metadata.license) {
    const license: License = {
      name: metadata.license,
    }
    datapackage.licenses = [license]
  }

  if (metadata.creators && metadata.creators.length > 0) {
    const contributors: Contributor[] = metadata.creators.map(creator => {
      const contributor: Contributor = {
        title: creator.name,
        role: "author",
      }

      if (creator.affiliation) {
        contributor.path = creator.affiliation
      }

      return contributor
    })

    datapackage.contributors = contributors
  }

  if (metadata.keywords && metadata.keywords.length > 0) {
    datapackage.keywords = metadata.keywords
  }

  if (metadata.publication_date) {
    datapackage.created = metadata.publication_date
  }

  return datapackage
}
