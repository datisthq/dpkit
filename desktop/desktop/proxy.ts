import { stat } from "node:fs/promises"
import nodePath from "node:path"
import { protocol } from "electron"
import * as settings from "../settings.ts"

// TODO: rebase on the fetch API
// https://www.electronjs.org/docs/latest/api/protocol#protocolhandlescheme-handler
export function createProxy() {
  protocol.interceptFileProtocol("file", async (request, callback) => {
    const url = new URL(request.url)

    let path = nodePath.join(settings.RENDERER_DIR, url.pathname)
    const exists = await checkFileExistence(path)

    if (!exists) {
      path = nodePath.join(settings.RENDERER_DIR, "index.html")
    }

    callback({ path })
  })
}

async function checkFileExistence(path: string) {
  try {
    const stats = await stat(path)
    return stats.isFile()
  } catch (error) {
    return false
  }
}
