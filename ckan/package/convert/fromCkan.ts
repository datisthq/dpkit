import type { Contributor, Package } from "@dpkit/core"
import type { License } from "@dpkit/core"
import { convertResourceFromCkan } from "../../resource/index.ts"
import type { CkanPackage } from "../Package.ts"

export function convertPackageFromCkan(ckanPackage: CkanPackage): Package {
  const datapackage: Package = {
    name: ckanPackage.name,
    resources: [],
  }

  if (ckanPackage.title) {
    datapackage.title = ckanPackage.title
  }

  if (ckanPackage.notes) {
    datapackage.description = ckanPackage.notes
  }

  if (ckanPackage.version) {
    datapackage.version = ckanPackage.version
  }

  if (ckanPackage.resources && ckanPackage.resources.length > 0) {
    datapackage.resources = ckanPackage.resources.map(resource =>
      convertResourceFromCkan(resource),
    )
  }

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

    datapackage.licenses = [license]
  }

  const contributors: Contributor[] = []

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
    datapackage.contributors = contributors
  }

  if (ckanPackage.tags && ckanPackage.tags.length > 0) {
    datapackage.keywords = ckanPackage.tags.map(tag => tag.name)
  }

  if (ckanPackage.metadata_created) {
    datapackage.created = ckanPackage.metadata_created
  }

  return datapackage
}
