import nodePath from "node:path"
import { electronApp, optimizer } from "@electron-toolkit/utils"
import { BrowserWindow, app, dialog } from "electron"
import metadata from "../package.json" with { type: "json" }
import { logger } from "../services/logger.ts"
import * as settings from "../settings.ts"
import { createBridge } from "./bridge.ts"
import { createWindow } from "./window.ts"

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  logger.info("Start application")
  electronApp.setAppUserModelId(settings.APP_USER_MODEL_ID)
  createBridge()
  await createWindow()
})

// Default open or close DevTools by F12 in development
// and ignore CommandOrControl + R in production.
// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
app.on("browser-window-created", (_, window) => {
  optimizer.watchWindowShortcuts(window)
})

// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// For convinience, we catch all unhandled rejections here
// instead of wrapping all individual async functions with try/catch
process.on("unhandledRejection", async (error: any) => {
  logger.error(error)
  await dialog.showMessageBox({
    type: "error",
    title: "dpkir",
    message: "Fatal error",
    detail: error.toString(),
  })
  app.quit()
})

// Standard about panel for the app
app.setAboutPanelOptions({
  applicationName: "dpkit",
  applicationVersion: metadata.version,
  website: "https://dpkit.app",
  iconPath: nodePath.join(
    import.meta.dirname,
    "..",
    "assets",
    "dpkit-logo.svg",
  ),
})
