import { rmSync } from "node:fs"
import exitHook from "exit-hook"
import { temporaryDirectory } from "tempy"

export function getTempFolderPath(options?: { persist?: boolean }) {
  const path = temporaryDirectory()

  if (!options?.persist) {
    exitHook(() => {
      try {
        rmSync(path, { recursive: true, force: true })
      } catch {}
    })
  }

  return path
}
