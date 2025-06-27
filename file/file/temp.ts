import { unlinkSync } from "node:fs"
import { writeFile } from "node:fs/promises"
import exitHook from "exit-hook"
import { temporaryFile } from "tempy"

export async function writeTempFile(
  content: string,
  options?: { persist?: boolean },
) {
  const path = getTempFilePath(options)
  await writeFile(path, content, "utf8")
  return path
}

export function getTempFilePath(options?: { persist?: boolean }) {
  const path = temporaryFile()

  if (!options?.persist) {
    exitHook(() => {
      try {
        unlinkSync(path)
      } catch {}
    })
  }

  return path
}
