import { ConsoleTransport, LogLayer } from "loglayer"

export const logger = new LogLayer({
  transport: new ConsoleTransport({
    logger: console,
  }),
})
