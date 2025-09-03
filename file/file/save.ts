import { Readable } from "node:stream"
import { saveFileStream } from "../stream/index.ts"

export async function saveFile(
  path: string,
  buffer: Buffer,
  options?: { overwrite?: boolean },
) {
  const { overwrite } = options ?? {}

  await saveFileStream(Readable.from(buffer), { path, overwrite })
}
