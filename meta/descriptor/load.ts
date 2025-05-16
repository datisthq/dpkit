import { loadNodeApis } from "./node.js"

/**
 * Load a descriptor (JSON Object) from a file or URL
 * Uses dynamic imports to work in both Node.js and browser environments
 * Supports HTTP, HTTPS, FTP, and FTPS protocols
 */
export async function loadDescriptor(props: {
  path: string
  secure?: boolean
}) {
  const { path } = props

  const isRemote = isRemoteUrl(path)
  if (!isRemote && props.secure) {
    throw new Error("Cannot load descriptor for security reasons")
  }

  const basepath = await getBasepath(path)
  const descriptor = isRemoteUrl(path)
    ? await loadRemoteDescriptor(path)
    : await loadLocalDescriptor(path)

  return { basepath, descriptor }
}

async function getBasepath(path: string) {
  const node = await loadNodeApis()
  const sep = node?.path.sep ?? "/"
  return path.split(sep).slice(0, -1).join(sep)
}

function isRemoteUrl(path: string) {
  try {
    new URL(path)
    return true
  } catch {
    return false
  }
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
  const node = await loadNodeApis()
  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const content = await node.fs.readFile(path, "utf-8")
  const descriptor = JSON.parse(content) as Record<string, any>

  return descriptor
}
