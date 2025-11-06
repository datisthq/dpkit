import type { Resource } from "@dpkit/metadata"
import { getFilename, getFormat, getName } from "@dpkit/metadata"
import type { GithubResource } from "../Resource.ts"

export function convertResourceFromGithub(
  githubResource: GithubResource,
  options: {
    defaultBranch: string
  },
) {
  const path = convertPath({
    ...githubResource,
    ref: options.defaultBranch,
  })

  const filename = getFilename(path)
  const resource: Resource = {
    path,
    name: getName(filename) ?? githubResource.sha,
    bytes: githubResource.size,
    hash: `sha1:${githubResource.sha}`,
    format: getFormat(filename),
    "github:key": githubResource.path,
    "github:url": path,
  }

  return resource
}

function convertPath(options: {
  url: string
  ref: string
  path: string
}) {
  const url = new URL(options.url)
  const [owner, repo] = url.pathname.split("/").slice(2)
  return `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${options.ref}/${options.path}`
}
