import { node } from "../node.js"
import { getBasepath, isRemotePath } from "../path.js"
import { parseDescriptor } from "./process/parse.js"

/**
 * Load a descriptor (JSON Object) from a file or URL
 * Uses dynamic imports to work in both Node.js and browser environments
 * Supports HTTP, HTTPS, FTP, and FTPS protocols
 */
export async function loadDescriptor(
  path: string,
  options?: {
    onlyRemote?: boolean
  },
) {
  const isRemote = isRemotePath(path)
  if (!isRemote && options?.onlyRemote) {
    throw new Error("Cannot load descriptor for security reasons")
  }

  const basepath = getBasepath(path)
  const descriptor = isRemote
    ? await loadRemoteDescriptor(path)
    : await loadLocalDescriptor(path)

  return { descriptor, basepath }
}

const ALLOWED_REMOTE_PROTOCOLS = ["http:", "https:", "ftp:", "ftps:"]

async function loadRemoteDescriptor(path: string) {
  const url = new URL(path)

  const protocol = url.protocol.toLowerCase()
  if (!ALLOWED_REMOTE_PROTOCOLS.includes(protocol)) {
    throw new Error(`Unsupported remote protocol: ${protocol}`)
  }

  const response = await fetch(url.toString())
  const descriptor = (await response.json()) as Record<string, any>

  return descriptor
}

async function loadLocalDescriptor(path: string) {
  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const text = await node.fs.readFile(path, "utf-8")
  const descriptor = parseDescriptor(text)

  return descriptor
}
