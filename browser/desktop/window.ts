import nodePath from "node:path"
import { BrowserWindow } from "electron"
// @ts-ignore
import icon from "../assets/dpkit-logo.svg?asset"

export async function createWindow() {
  const mainWindow = new BrowserWindow({
    show: false,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: nodePath.join(__dirname, "preload", "index.js"),
      contextIsolation: true,
    },
  })

  // mainWindow.loadFile(resolve(__dirname, "..", "client", "index.html"))
  mainWindow.maximize()
  mainWindow.show()

  return mainWindow
}
