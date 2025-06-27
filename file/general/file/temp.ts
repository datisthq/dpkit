import { unlinkSync } from "node:fs"
import exitHook from "exit-hook"
import { temporaryFile } from "tempy"

export function createTempFile() {
  const path = temporaryFile()

  exitHook(() => {
    try {
      unlinkSync(path)
    } catch {}
  })

  return path
}
