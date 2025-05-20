import { node } from "./node.js"
import { getBasepath, isRemotePath } from "./path.js"

/**
 * Load a descriptor (JSON Object) from a file or URL
 * Uses dynamic imports to work in both Node.js and browser environments
 * Supports HTTP, HTTPS, FTP, and FTPS protocols
 */
export async function loadDescriptor(props: {
  path: string
  onlyRemote?: boolean
}) {
  const { path } = props

  const isRemote = isRemotePath({ path })
  if (!isRemote && props.onlyRemote) {
    throw new Error("Cannot load descriptor for security reasons")
  }

  const basepath = getBasepath({ path })
  const descriptor = isRemote
    ? await loadRemoteDescriptor(props)
    : await loadLocalDescriptor(props)

  return { descriptor, basepath }
}

const ALLOWED_REMOTE_PROTOCOLS = ["http:", "https:", "ftp:", "ftps:"]

async function loadRemoteDescriptor(props: { path: string }) {
  const url = new URL(props.path)

  const protocol = url.protocol.toLowerCase()
  if (!ALLOWED_REMOTE_PROTOCOLS.includes(protocol)) {
    throw new Error(`Unsupported remote protocol: ${protocol}`)
  }

  const response = await fetch(url.toString())
  const descriptor = (await response.json()) as Record<string, any>

  return descriptor
}

async function loadLocalDescriptor(props: { path: string }) {
  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const content = await node.fs.readFile(props.path, "utf-8")
  const descriptor = JSON.parse(content) as Record<string, any>

  return descriptor
}
