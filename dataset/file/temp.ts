import type { Buffer } from "node:buffer"
import { unlinkSync } from "node:fs"
import { writeFile } from "node:fs/promises"
import exitHook from "exit-hook"
import { temporaryFile } from "tempy"

export async function writeTempFile(
  content: string | Buffer,
  options?: { persist?: boolean; filename?: string; format?: string },
) {
  const path = getTempFilePath(options)
  await writeFile(path, content)
  return path
}

export function getTempFilePath(options?: {
  persist?: boolean
  filename?: string
  format?: string
}) {
  const { filename, format } = options ?? {}

  const path = temporaryFile(
    filename ? { name: filename } : { extension: format },
  )

  if (!options?.persist) {
    exitHook(() => {
      try {
        unlinkSync(path)
      } catch {}
    })
  }

  return path
}
