import { setImmediate } from "node:timers/promises"
import { spinner } from "@clack/prompts"
import { intro, log, outro, select } from "@clack/prompts"
import type { SelectOptions } from "@clack/prompts"
import exitHook from "exit-hook"
import { render } from "ink"
import pc from "picocolors"
import type React from "react"

export class Session {
  title: string

  static create(options: { title: string; json?: boolean }) {
    const session = options.json
      ? new JsonSession(options)
      : new Session(options)

    session.start()
    return session
  }

  static terminate(message: string): never {
    log.error(message)
    process.exit(1)
  }

  constructor(options: { title: string }) {
    this.title = options.title
  }
  start() {
    intro(pc.bold(this.title))
    exitHook(() => {
      outro(
        `Problems? ${pc.underline(pc.cyan("https://github.com/datisthq/dpkit/issues"))}`,
      )
    })
  }

  success(message: string) {
    log.success(message)
  }

  error(message: string) {
    log.error(message)
  }

  async select<T>(options: SelectOptions<T>) {
    return await select(options)
  }

  async task<T>(message: string, promise: Promise<T>) {
    const loader = spinner()

    loader.start(message)
    const result = await promise
    loader.stop(message)

    return result
  }

  async render(_object: any, node: React.ReactNode) {
    // Without waiting for the next tick after clack prompts,
    // ink render will be immidiately terminated
    await setImmediate()

    const app = render(node)
    await app.waitUntilExit()
  }
}

export class JsonSession extends Session {
  start = () => {}
  success = () => {}
  error = () => {}

  async select<T>(_options: SelectOptions<T>): Promise<symbol | T> {
    Session.terminate("Selection is not supported in JSON mode")
  }

  async render(object: any, _node: React.ReactNode) {
    console.log(JSON.stringify(object, null, 2))
  }

  async task<T>(_message: string, promise: Promise<T>) {
    return await promise
  }
}
