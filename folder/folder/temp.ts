import { rmSync } from "node:fs"
import exitHook from "exit-hook"
import { temporaryDirectory } from "tempy"

export function createTempFolder() {
  const path = temporaryDirectory()

  exitHook(() => {
    try {
      rmSync(path, { recursive: true, force: true })
    } catch {}
  })

  return path
}
