import { buffer } from "node:stream/consumers"
import { loadFileStream } from "../stream/index.ts"

export async function loadFile(path: string, options?: { maxBytes?: number }) {
  const stream = await loadFileStream(path, options)
  return await buffer(stream)
}
