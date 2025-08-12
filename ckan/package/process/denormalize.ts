import type { Package } from "@dpkit/core"
import type { SetRequired } from "type-fest"
import type { CkanResource } from "../../resource/Resource.ts"
import { denormalizeCkanResource } from "../../resource/process/denormalize.ts"
import type { CkanPackage } from "../Package.ts"
import type { CkanTag } from "../Tag.ts"

/**
 * Denormalizes a Frictionless Data Package to CKAN Package format
 * @param props Object containing the Package to denormalize
 * @returns Denormalized CKAN Package object
 */
export function denormalizeCkanPackage(dataPackage: Package) {
  const ckanPackage: SetRequired<Partial<CkanPackage>, "resources" | "tags"> = {
    resources: [],
    tags: [],
  }

  // Basic metadata
  if (dataPackage.name) ckanPackage.name = dataPackage.name
  if (dataPackage.title) ckanPackage.title = dataPackage.title
  if (dataPackage.description) ckanPackage.notes = dataPackage.description
  if (dataPackage.version) ckanPackage.version = dataPackage.version

  // Process license information
  if (dataPackage.licenses && dataPackage.licenses.length > 0) {
    const license = dataPackage.licenses[0] // Use first license

    if (license?.name) ckanPackage.license_id = license.name
    if (license?.title) ckanPackage.license_title = license.title
    if (license?.path) ckanPackage.license_url = license.path
  }

  // Process contributors
  if (dataPackage.contributors) {
    // Find author (contributor with role 'author')
    const author = dataPackage.contributors.find(c => c.role === "author")
    if (author) {
      ckanPackage.author = author.title
      if (author.email) ckanPackage.author_email = author.email
    }

    // Find maintainer (contributor with role 'maintainer')
    const maintainer = dataPackage.contributors.find(
      c => c.role === "maintainer",
    )
    if (maintainer) {
      ckanPackage.maintainer = maintainer.title
      if (maintainer.email) ckanPackage.maintainer_email = maintainer.email
    }
  }

  // Process resources
  if (dataPackage.resources && dataPackage.resources.length > 0) {
    ckanPackage.resources = dataPackage.resources
      .map(resource => denormalizeCkanResource(resource))
      .filter((resource): resource is CkanResource => resource !== undefined)
  }

  // Process keywords as tags
  if (dataPackage.keywords && dataPackage.keywords.length > 0) {
    // TODO: Rebase on something like CkanPackage / NewCkanPackage
    // with NewCkanTag/Resource etc to separate metadata read from API
    // and metadata that is mapped from Data Package
    // @ts-ignore
    ckanPackage.tags = dataPackage.keywords.map(keyword => {
      const tag: Partial<CkanTag> = {
        name: keyword,
        display_name: keyword,
      }
      return tag
    })
  }

  return ckanPackage
}
