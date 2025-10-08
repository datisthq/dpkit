import { node } from "../node.ts"
import type { Descriptor } from "./Descriptor.ts"
import { stringifyDescriptor } from "./process/stringify.ts"

/**
 * Save a descriptor (JSON Object) to a file path
 * Works in Node.js environments
 */
export async function saveDescriptor(
  descriptor: Descriptor,
  options: {
    path: string
    overwrite?: boolean
  },
) {
  if (!node) {
    throw new Error("File system is not supported in this environment")
  }

  const text = stringifyDescriptor(descriptor)

  await node.fs.mkdir(node.path.dirname(options.path), { recursive: true })
  await node.fs.writeFile(options.path, text, {
    encoding: "utf8",
    // The "wx" flag ensures that the file won't overwrite an existing file
    flag: options.overwrite ? "w" : "wx",
  })
}
