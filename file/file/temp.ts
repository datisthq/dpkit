import { unlinkSync } from "node:fs"
import exitHook from "exit-hook"
import { temporaryFile } from "tempy"

export function getTempFilePath(options?: { cleanup?: boolean }) {
  const path = temporaryFile()

  if (options?.cleanup) {
    exitHook(() => {
      try {
        unlinkSync(path)
      } catch {}
    })
  }

  return path
}
