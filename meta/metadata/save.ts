import { loadNodeApis } from "./node.js"

/**
 * Save a metadata (JSON Object) to a file path
 * Works in Node.js environments
 */
export async function saveMetadata(props: {
  metadata: Record<string, any>
  path: string
}) {
  const { metadata, path } = props

  const node = await loadNodeApis()
  if (!node) {
    throw new Error(
      "File system operations are not supported in this environment",
    )
  }

  const content = JSON.stringify(metadata, null, 2)

  await node.fs.mkdir(node.path.dirname(path), { recursive: true })
  await node.fs.writeFile(path, content, "utf-8")

  return true
}
