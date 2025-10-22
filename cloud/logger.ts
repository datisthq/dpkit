import { TsLogTransport } from "@loglayer/transport-tslog"
import { LogLayer } from "loglayer"
import { Logger } from "tslog"

export const logger = new LogLayer({
  transport: new TsLogTransport({
    logger: new Logger({ type: "pretty" }),
  }),
})
