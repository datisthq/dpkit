import type { Resource } from "@dpkit/metadata"
import type { GithubResource } from "../Resource.ts"

export function convertResourceToGithub(
  resource: Resource,
): Partial<GithubResource> {
  if (!resource.path && !resource.name) {
    return {}
  }

  const githubResource: Partial<GithubResource> = {
    path: resource.name,
  }

  return githubResource
}
