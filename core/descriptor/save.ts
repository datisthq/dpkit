import type { Descriptor } from "./Descriptor.js"
import { node } from "./node.js"

/**
 * Save a descriptor (JSON Object) to a file path
 * Works in Node.js environments
 */
export async function saveDescriptor(props: {
  descriptor: Descriptor
  path: string
}) {
  const { descriptor, path } = props

  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const content = JSON.stringify(descriptor, null, 2)

  await node.fs.mkdir(node.path.dirname(path), { recursive: true })
  await node.fs.writeFile(path, content, "utf-8")
}
