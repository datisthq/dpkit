import type { Contributor, License, Package } from "@dpkit/metadata"
import { convertResourceFromGithub } from "../../resource/index.ts"
import type { GithubPackage } from "../Package.ts"

export function convertPackageFromGithub(
  githubPackage: GithubPackage,
): Package {
  const datapackage: Package = {
    name: githubPackage.name,
    resources: [],
  }

  if (githubPackage.description) {
    datapackage.description = githubPackage.description
  }

  datapackage.title = githubPackage.full_name

  if (githubPackage.homepage) {
    datapackage.homepage = githubPackage.homepage
  }

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

  if (githubPackage.owner) {
    const contributor: Contributor = {
      title: githubPackage.owner.login,
      role:
        githubPackage.owner.type === "Organization" ? "publisher" : "author",
      path: githubPackage.owner.html_url,
    }

    datapackage.contributors = [contributor]
  }

  if (githubPackage.resources && githubPackage.resources.length > 0) {
    datapackage.resources = githubPackage.resources
      .filter(resource => !resource.path.startsWith("."))
      .filter(resource => resource.type === "blob")
      .map(resource =>
        convertResourceFromGithub(resource, {
          defaultBranch: githubPackage.default_branch,
        }),
      )
  }

  if (githubPackage.topics && githubPackage.topics.length > 0) {
    datapackage.keywords = githubPackage.topics
  }

  if (githubPackage.created_at) {
    datapackage.created = githubPackage.created_at
  }

  return datapackage
}
