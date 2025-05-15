/**
 * Load a descriptor (JSON Object) from a file or URL
 * Uses dynamic imports to work in both Node.js and browser environments
 * Supports HTTP, HTTPS, FTP, and FTPS protocols
 *
 * @param props Object containing the path to the descriptor
 */
export async function loadDescriptor(props: { path: string }) {
  const { path } = props

  let isUrl = false
  try {
    new URL(path)
    isUrl = true
  } catch {
    isUrl = false
  }

  return isUrl
    ? await loadRemoteDescriptor(props)
    : await loadLocalDescriptor(props)
}

/**
 * Load a descriptor (JSON Object) from a remote URL
 * Supports HTTP, HTTPS, FTP, and FTPS protocols
 *
 * @param props Object containing the remote URL path
 */
async function loadRemoteDescriptor(props: { path: string }) {
  const { path } = props

  const url = new URL(path)
  const protocol = url.protocol.toLowerCase()

  if (!["http:", "https:", "ftp:", "ftps:"].includes(protocol)) {
    throw new Error(`Unsupported URL protocol: ${protocol}`)
  }

  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(
      `Failed to load descriptor from URL: ${path}, status: ${response.status}`,
    )
  }

  const data = (await response.json()) as Record<string, any>
  return data
}

/**
 * Load a descriptor (JSON Object) from a local file
 * Works in Node.js environments only
 *
 * @param props Object containing the file path
 */
async function loadLocalDescriptor(props: { path: string }) {
  const { path } = props

  const fs = await import("node:fs/promises")
  await fs.access(path, fs.constants.R_OK)

  const content = await fs.readFile(path, "utf-8")
  return JSON.parse(content) as Record<string, any>
}
