import type { Package } from "@dpkit/core"
import type { GitHubPackage } from "../Package.js"

/**
 * Denormalizes a Frictionless Data Package to GitHub repository metadata format
 * Note: This is primarily used when creating a new repository
 * @param props Object containing the Package to denormalize
 * @returns GitHub repository creation payload
 */
export function denormalizeGitHubPackage(props: {
  datapackage: Package
}) {
  const { datapackage } = props

  // Build repository creation payload
  const repoPayload: Partial<GitHubPackage> & {
    auto_init?: boolean
    has_issues?: boolean
    has_projects?: boolean
    has_wiki?: boolean
  } = {
    name: datapackage.name,
    private: false,
    auto_init: true,
    has_issues: true,
    has_projects: true,
    has_wiki: true,
  }

  // Basic metadata
  if (datapackage.description) {
    repoPayload.description = datapackage.description
  } else if (datapackage.title) {
    repoPayload.description = datapackage.title
  }

  if (datapackage.homepage) {
    repoPayload.homepage = datapackage.homepage
  }

  // Include topics if there are keywords
  if (datapackage.keywords && datapackage.keywords.length > 0) {
    repoPayload.topics = datapackage.keywords
  }

  return repoPayload
}
