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
  datapackage: Package
}) {
  const { datapackage } = props

  const ckanPackage: SetRequired<Partial<CkanPackage>, "resources" | "tags"> = {
    resources: [],
    tags: [],
  }

  // Basic metadata
  if (datapackage.name) ckanPackage.name = datapackage.name
  if (datapackage.title) ckanPackage.title = datapackage.title
  if (datapackage.description) ckanPackage.notes = datapackage.description
  if (datapackage.version) ckanPackage.version = datapackage.version
  if (datapackage.created) ckanPackage.metadata_created = datapackage.created

  // Process license information
  if (datapackage.licenses && datapackage.licenses.length > 0) {
    const license = datapackage.licenses[0] // Use first license

    if (license?.name) ckanPackage.license_id = license.name
    if (license?.title) ckanPackage.license_title = license.title
    if (license?.path) ckanPackage.license_url = license.path
  }

  // Process contributors
  if (datapackage.contributors) {
    // Find author (contributor with role 'author')
    const author = datapackage.contributors.find(c => c.role === "author")
    if (author) {
      ckanPackage.author = author.title
      if (author.email) ckanPackage.author_email = author.email
    }

    // Find maintainer (contributor with role 'maintainer')
    const maintainer = datapackage.contributors.find(
      c => c.role === "maintainer",
    )
    if (maintainer) {
      ckanPackage.maintainer = maintainer.title
      if (maintainer.email) ckanPackage.maintainer_email = maintainer.email
    }
  }

  // Process resources
  if (datapackage.resources && datapackage.resources.length > 0) {
    ckanPackage.resources = datapackage.resources
      .map(resource => denormalizeCkanResource({ resource }))
      .filter((resource): resource is CkanResource => resource !== undefined)
  }

  // Process keywords as tags
  if (datapackage.keywords && datapackage.keywords.length > 0) {
    // TODO: Rebase on something like CkanPackage / NewCkanPackage
    // with NewCkanTag/Resource etc to separate metadata read from API
    // and metadata that is mapped from Data Package
    // @ts-ignore
    ckanPackage.tags = datapackage.keywords.map(keyword => {
      const tag: Partial<CkanTag> = {
        name: keyword,
        display_name: keyword,
      }
      return tag
    })
  }

  return ckanPackage
}
