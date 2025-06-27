import { rmSync } from "node:fs"
import exitHook from "exit-hook"
import { temporaryDirectory } from "tempy"

export function getTempFolderPath(options?: { cleanup?: boolean }) {
  const path = temporaryDirectory()

  if (options?.cleanup) {
    exitHook(() => {
      try {
        rmSync(path, { recursive: true, force: true })
      } catch {}
    })
  }

  return path
}
