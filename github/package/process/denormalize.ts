import type { Package } from "@dpkit/core"
import type { GithubPackage } from "../Package.js"

/**
 * Denormalizes a Frictionless Data Package to Github repository metadata format
 * Note: This is primarily used when creating a new repository
 * @param props Object containing the Package to denormalize
 * @returns Github repository creation payload
 */
export function denormalizeGithubPackage(dataPackage: Package) {
  // Build repository creation payload
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

  // Basic metadata
  if (dataPackage.description) {
    repoPayload.description = dataPackage.description
  } else if (dataPackage.title) {
    repoPayload.description = dataPackage.title
  }

  if (dataPackage.homepage) {
    repoPayload.homepage = dataPackage.homepage
  }

  // Include topics if there are keywords
  if (dataPackage.keywords && dataPackage.keywords.length > 0) {
    repoPayload.topics = dataPackage.keywords
  }

  return repoPayload
}
