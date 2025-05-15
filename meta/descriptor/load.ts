import { loadNodeApis } from "./node.js"

/**
 * Load a descriptor (JSON Object) from a file or URL
 * Uses dynamic imports to work in both Node.js and browser environments
 * Supports HTTP, HTTPS, FTP, and FTPS protocols
 */
export async function loadDescriptor(props: { path: string }) {
  const url = createRemoteUrl(props.path)

  return url
    ? await loadRemoteDescriptor(url)
    : await loadLocalDescriptor(props.path)
}

function createRemoteUrl(path: string) {
  try {
    return new URL(path)
  } catch {
    return undefined
  }
}

const REMOTE_PROTOCOLS = ["http:", "https:", "ftp:", "ftps:"]

async function loadRemoteDescriptor(url: URL) {
  const protocol = url.protocol.toLowerCase()
  if (!REMOTE_PROTOCOLS.includes(protocol)) {
    throw new Error(`Unsupported URL protocol: ${protocol}`)
  }

  const response = await fetch(url.toString())
  const descriptor = (await response.json()) as Record<string, any>

  return descriptor
}

async function loadLocalDescriptor(path: string) {
  const node = await loadNodeApis()
  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const content = await node.fs.readFile(path, "utf-8")
  const descriptor = JSON.parse(content) as Record<string, any>

  return descriptor
}
