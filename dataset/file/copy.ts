import { loadFileStream } from "../stream/load.ts"
import { saveFileStream } from "../stream/save.ts"

export async function copyFile(options: {
  sourcePath: string
  targetPath: string
}) {
  const stream = await loadFileStream(options.sourcePath)
  await saveFileStream(stream, { path: options.targetPath })
}
