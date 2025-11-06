import type { Package } from "@dpkit/metadata"
import type { GithubPackage } from "../Package.ts"

export function convertPackageToGithub(dataPackage: Package) {
  const repoPayload: Partial<GithubPackage> & {
    auto_init?: boolean
    has_issues?: boolean
    has_projects?: boolean
    has_wiki?: boolean
  } = {
    name: dataPackage.name,
    private: false,
    auto_init: true,
    has_issues: true,
    has_projects: true,
    has_wiki: true,
  }

  if (dataPackage.description) {
    repoPayload.description = dataPackage.description
  } else if (dataPackage.title) {
    repoPayload.description = dataPackage.title
  }

  if (dataPackage.homepage) {
    repoPayload.homepage = dataPackage.homepage
  }

  if (dataPackage.keywords && dataPackage.keywords.length > 0) {
    repoPayload.topics = dataPackage.keywords
  }

  return repoPayload
}
