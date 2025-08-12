import type { Contributor, License, Package } from "@dpkit/core"
import { normalizeGithubResource } from "../../resource/process/normalize.ts"
import type { GithubPackage } from "../Package.ts"

/**
 * Normalizes a Github repository to Frictionless Data package format
 * @param props Object containing the Github repository to normalize
 * @returns Normalized Package object
 */
export function normalizeGithubPackage(githubPackage: GithubPackage): Package {
  const datapackage: Package = {
    name: githubPackage.name,
    resources: [],
  }

  // Basic metadata
  if (githubPackage.description) {
    datapackage.description = githubPackage.description
  }

  datapackage.title = githubPackage.full_name

  if (githubPackage.homepage) {
    datapackage.homepage = githubPackage.homepage
  }

  // Process license information
  if (githubPackage.license) {
    const license: License = {
      name: githubPackage.license.spdx_id || githubPackage.license.key,
    }

    if (githubPackage.license.name) {
      license.title = githubPackage.license.name
    }

    if (githubPackage.license.url) {
      license.path = githubPackage.license.url
    }

    datapackage.licenses = [license]
  }

  // Process contributors (only owner at this point)
  if (githubPackage.owner) {
    const contributor: Contributor = {
      title: githubPackage.owner.login,
      role:
        githubPackage.owner.type === "Organization" ? "publisher" : "author",
      path: githubPackage.owner.html_url,
    }

    datapackage.contributors = [contributor]
  }

  // Process resources
  if (githubPackage.resources && githubPackage.resources.length > 0) {
    datapackage.resources = githubPackage.resources
      .filter(resource => !resource.path.startsWith("."))
      .filter(resource => resource.type === "blob")
      .map(resource =>
        normalizeGithubResource(resource, {
          defaultBranch: githubPackage.default_branch,
        }),
      )
  }

  // Process topics as keywords
  if (githubPackage.topics && githubPackage.topics.length > 0) {
    datapackage.keywords = githubPackage.topics
  }

  // Add creation date
  if (githubPackage.created_at) {
    datapackage.created = githubPackage.created_at
  }

  return datapackage
}
