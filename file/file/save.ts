import { Readable } from "node:stream"
import { saveFileStream } from "../stream/index.js"

export async function saveFile(path: string, buffer: Buffer) {
  await saveFileStream(Readable.from(buffer), { path })
}
