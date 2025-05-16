import type { Descriptor } from "./Descriptor.js"
import { loadNodeApis } from "./node.js"

/**
 * Save a descriptor (JSON Object) to a file path
 * Works in Node.js environments
 */
export async function saveDescriptor(props: {
  descriptor: Descriptor
  path: string
}) {
  const { descriptor, path } = props

  const node = await loadNodeApis()
  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const content = JSON.stringify(descriptor, null, 2)

  await node.fs.mkdir(node.path.dirname(path), { recursive: true })
  await node.fs.writeFile(path, content, "utf-8")

  return true
}
