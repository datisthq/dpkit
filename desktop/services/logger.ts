import { ElectronLogTransport } from "@loglayer/transport-electron-log"
// @ts-ignore
import log from "electron-log/main"
import { LogLayer } from "loglayer"

// TODO: Setup proper on disk logging storage
export const logger = new LogLayer({
  transport: new ElectronLogTransport({
    logger: log,
  }),
})
