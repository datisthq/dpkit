import { readFileStream } from "./stream/read.js"
import { writeFileStream } from "./stream/write.js"

export async function saveFileToDisc(options: {
  sourcePath: string
  targetPath: string
}) {
  const stream = await readFileStream(options.sourcePath)
  await writeFileStream(stream, { path: options.targetPath })
}
