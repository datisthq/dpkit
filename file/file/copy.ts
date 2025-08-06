import { loadFileStream } from "../stream/load.js"
import { saveFileStream } from "../stream/save.js"

export async function copyFile(options: {
  sourcePath: string
  targetPath: string
}) {
  const stream = await loadFileStream(options.sourcePath)
  await saveFileStream(stream, { path: options.targetPath })
}
