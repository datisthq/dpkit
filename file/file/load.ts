import { buffer } from "node:stream/consumers"
import { loadFileStream } from "../stream/index.js"

export async function loadFile(path: string) {
  const stream = await loadFileStream(path)
  return await buffer(stream)
}
