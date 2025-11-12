import nodePath from "node:path"
import { BrowserWindow } from "electron"
// @ts-ignore
import icon from "../assets/dpkit-logo.svg?asset"

export async function createWindow() {
  const indexPath = nodePath.resolve(
    import.meta.dirname,
    "..",
    "node_modules",
    "@dpkit",
    "browser",
    "build",
    "spa",
    "client",
    "index.html",
  )

  const mainWindow = new BrowserWindow({
    show: false,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: nodePath.join(import.meta.dirname, "preload", "index.js"),
      contextIsolation: true,
    },
  })

  mainWindow.loadFile(indexPath)
  mainWindow.setTitle("dpkit")
  mainWindow.setMenu(null)
  mainWindow.maximize()
  mainWindow.show()

  return mainWindow
}
