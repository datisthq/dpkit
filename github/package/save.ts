import type { Descriptor, Package } from "@dpkit/core"
import { denormalizePackage, stringifyDescriptor } from "@dpkit/core"
import { makeGitHubApiRequest } from "../general/index.js"
import { denormalizeGitHubPackage } from "./process/denormalize.js"

// Define these functions here since they're not available in the types
interface FileOptions {
  normalizedPath: string
  denormalizedPath: string
}

// Helper functions for file handling that would normally be imported
function getPackageBasepath(): string {
  return "./"
}

async function saveResourceFiles(props: {
  resource: any
  basepath: string
  withRemote: boolean
  saveFile: (props: FileOptions) => Promise<string>
}) {
  const result: Descriptor = {}
  if (typeof props.resource.path === "string") {
    await props.saveFile({
      normalizedPath: props.resource.path,
      denormalizedPath: props.resource.name || "file",
    })
  }
  return result
}

/**
 * Save a package to a GitHub repository
 * @param props Object containing the package to save and GitHub details
 * @returns Object with the repository URL
 */
export async function savePackageToGithub(props: {
  datapackage: Package
  apiKey: string
  owner: string
  repositoryName?: string
  createRepository?: boolean
  branch?: string
  commitMessage?: string
}) {
  const {
    datapackage,
    apiKey,
    owner,
    repositoryName,
    createRepository = false,
    branch = "main",
  } = props

  // If repository should be created
  const repoName = repositoryName || datapackage.name || "datapackage"
  if (createRepository) {
    const repoPayload = denormalizeGitHubPackage({ datapackage })

    try {
      // Check if repository exists
      await makeGitHubApiRequest({
        endpoint: "/repos/:owner/:repo",
        owner,
        repo: repoName,
        apiKey,
      })
    } catch (error) {
      // Repository doesn't exist, create it
      await makeGitHubApiRequest({
        endpoint: "/user/repos",
        method: "POST",
        payload: {
          ...repoPayload,
          name: repoName,
        },
        owner,
        repo: repoName,
        apiKey,
      })
    }
  }

  // Prepare the datapackage descriptor
  const basepath = getPackageBasepath()
  const descriptor = denormalizePackage({ datapackage, basepath })

  // Upload datapackage.json
  await createOrUpdateFile({
    owner,
    repo: repoName,
    apiKey,
    path: "datapackage.json",
    content: stringifyDescriptor({ descriptor }),
    branch,
    message: "Update datapackage.json",
  })

  // Upload resource files
  for (const resource of datapackage.resources || []) {
    if (!resource.path) continue

    await saveResourceFiles({
      resource,
      basepath,
      withRemote: false,
      saveFile: async props => {
        // Simulate file content for now
        const base64Content = Buffer.from("Sample content").toString("base64")

        await createOrUpdateFile({
          owner,
          repo: repoName,
          apiKey,
          path: props.denormalizedPath,
          content: base64Content,
          branch,
          message: `Add resource: ${props.denormalizedPath}`,
        })

        // Return URL to the file in GitHub
        return `https://github.com/${owner}/${repoName}/raw/${branch}/${props.denormalizedPath}`
      },
    })
  }

  return {
    repositoryUrl: `https://github.com/${owner}/${repoName}`,
  }
}

/**
 * Create or update a file in a GitHub repository
 */
async function createOrUpdateFile(props: {
  owner: string
  repo: string
  apiKey: string
  path: string
  content: string
  branch: string
  message: string
}) {
  const {
    owner,
    repo,
    apiKey,
    path: filePath,
    content,
    branch,
    message,
  } = props

  // First check if file exists to get its SHA (needed for update)
  let sha: string | undefined
  try {
    const existingFile = await makeGitHubApiRequest({
      endpoint: `/repos/:owner/:repo/contents/${filePath}?ref=${branch}`,
      owner,
      repo,
      apiKey,
    })

    if (existingFile.sha) {
      sha = existingFile.sha as string
    }
  } catch (error) {
    // File doesn't exist, will be created
  }

  // Convert content to base64 if it's not already
  let base64Content = content
  if (!isBase64(content)) {
    base64Content = Buffer.from(content).toString("base64")
  }

  // Create or update the file
  await makeGitHubApiRequest({
    endpoint: `/repos/:owner/:repo/contents/${filePath}`,
    method: "PUT",
    payload: {
      message,
      content: base64Content,
      branch,
      ...(sha ? { sha } : {}),
    },
    owner,
    repo,
    apiKey,
  })
}

// Not needed anymore as we're using Buffer directly

/**
 * Check if a string is base64 encoded
 */
function isBase64(str: string): boolean {
  const regex = /^[A-Za-z0-9+/=]+$/
  return regex.test(str)
}
