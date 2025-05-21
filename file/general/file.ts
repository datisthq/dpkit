import { readFileStream } from "./stream/read.js"
import { writeFileStream } from "./stream/write.js"

export async function saveFileToDisc(props: {
  sourcePath: string
  targetPath: string
}) {
  const stream = await readFileStream({ path: props.sourcePath })
  await writeFileStream({ stream, path: props.targetPath })
}
