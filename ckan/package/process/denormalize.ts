import type { Package } from "@dpkit/core"
import type { SetRequired } from "type-fest"
import type { CkanResource } from "../../resource/Resource.js"
import { denormalizeCkanResource } from "../../resource/process/denormalize.js"
import type { CkanPackage } from "../Package.js"
import type { CkanTag } from "../Tag.js"

/**
 * Denormalizes a Frictionless Data Package to CKAN Package format
 * @param props Object containing the Package to denormalize
 * @returns Denormalized CKAN Package object
 */
export function denormalizeCkanPackage(props: {
  package: Package
}) {
  const { package: pkg } = props

  const ckanPackage: SetRequired<Partial<CkanPackage>, "resources" | "tags"> = {
    resources: [],
    tags: [],
  }

  // Basic metadata
  if (pkg.name) ckanPackage.name = pkg.name
  if (pkg.title) ckanPackage.title = pkg.title
  if (pkg.description) ckanPackage.notes = pkg.description
  if (pkg.version) ckanPackage.version = pkg.version
  if (pkg.created) ckanPackage.metadata_created = pkg.created

  // Process license information
  if (pkg.licenses && pkg.licenses.length > 0) {
    const license = pkg.licenses[0] // Use first license

    if (license?.name) ckanPackage.license_id = license.name
    if (license?.title) ckanPackage.license_title = license.title
    if (license?.path) ckanPackage.license_url = license.path
  }

  // Process contributors
  if (pkg.contributors) {
    // Find author (contributor with role 'author')
    const author = pkg.contributors.find(c => c.role === "author")
    if (author) {
      ckanPackage.author = author.title
      if (author.email) ckanPackage.author_email = author.email
    }

    // Find maintainer (contributor with role 'maintainer')
    const maintainer = pkg.contributors.find(c => c.role === "maintainer")
    if (maintainer) {
      ckanPackage.maintainer = maintainer.title
      if (maintainer.email) ckanPackage.maintainer_email = maintainer.email
    }
  }

  // Process resources
  if (pkg.resources && pkg.resources.length > 0) {
    ckanPackage.resources = pkg.resources
      .map(resource => denormalizeCkanResource({ resource }))
      .filter((resource): resource is CkanResource => resource !== undefined)
  }

  // Process keywords as tags
  if (pkg.keywords && pkg.keywords.length > 0) {
    // TODO: Rebase on something like CkanPackage / NewCkanPackage
    // with NewCkanTag/Resource etc to separate metadata read from API
    // and metadata that is mapped from Data Package
    // @ts-ignore
    ckanPackage.tags = pkg.keywords.map(keyword => {
      const tag: Partial<CkanTag> = {
        name: keyword,
        display_name: keyword,
      }
      return tag
    })
  }

  return ckanPackage
}
