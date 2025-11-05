import type { Package } from "@dpkit/metadata"
import type { SetRequired } from "type-fest"
import type { CkanResource } from "../../resource/Resource.ts"
import { convertResourceToCkan } from "../../resource/index.ts"
import type { CkanPackage } from "../Package.ts"
import type { CkanTag } from "../Tag.ts"

export function convertPackageToCkan(dataPackage: Package) {
  const ckanPackage: SetRequired<Partial<CkanPackage>, "resources" | "tags"> = {
    resources: [],
    tags: [],
  }

  if (dataPackage.name) ckanPackage.name = dataPackage.name
  if (dataPackage.title) ckanPackage.title = dataPackage.title
  if (dataPackage.description) ckanPackage.notes = dataPackage.description
  if (dataPackage.version) ckanPackage.version = dataPackage.version

  if (dataPackage.licenses && dataPackage.licenses.length > 0) {
    const license = dataPackage.licenses[0]

    if (license?.name) ckanPackage.license_id = license.name
    if (license?.title) ckanPackage.license_title = license.title
    if (license?.path) ckanPackage.license_url = license.path
  }

  if (dataPackage.contributors) {
    const author = dataPackage.contributors.find(c => c.role === "author")
    if (author) {
      ckanPackage.author = author.title
      if (author.email) ckanPackage.author_email = author.email
    }

    const maintainer = dataPackage.contributors.find(
      c => c.role === "maintainer",
    )
    if (maintainer) {
      ckanPackage.maintainer = maintainer.title
      if (maintainer.email) ckanPackage.maintainer_email = maintainer.email
    }
  }

  if (dataPackage.resources && dataPackage.resources.length > 0) {
    ckanPackage.resources = dataPackage.resources
      .map(resource => convertResourceToCkan(resource))
      .filter((resource): resource is CkanResource => resource !== undefined)
  }

  if (dataPackage.keywords && dataPackage.keywords.length > 0) {
    ckanPackage.tags = dataPackage.keywords.map(keyword => ({
      name: keyword,
      display_name: keyword,
    })) as CkanTag[]
  }

  return ckanPackage
}
