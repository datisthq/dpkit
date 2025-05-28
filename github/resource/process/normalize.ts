import type { Resource } from "@dpkit/core"
import { getFilename, getFormat, getName } from "@dpkit/core"
import type { GithubResource } from "../Resource.js"

/**
 * Normalizes a Github file to Frictionless Data resource format
 * @param props Object containing the Github file to normalize
 * @returns Normalized Resource object
 */
export function normalizeGithubResource(props: {
  githubResource: GithubResource
  defaultBranch: string
}) {
  const { githubResource } = props

  const path = normalizeGithubPath({
    ...githubResource,
    ref: props.defaultBranch,
  })

  const filename = getFilename({ path })
  const resource: Resource = {
    path,
    name: getName({ filename }) ?? githubResource.sha,
    bytes: githubResource.size,
    hash: `sha1:${githubResource.sha}`,
    format: getFormat({ filename }),
    "github:key": githubResource.path,
    "github:url": path,
  }

  return resource
}

function normalizeGithubPath(props: {
  url: string
  ref: string
  path: string
}) {
  const url = new URL(props.url)
  const [owner, repo] = url.pathname.split("/").slice(2)
  return `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${props.ref}/${props.path}`
}
