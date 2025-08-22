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
    this.#enableExitHook()
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
    // TODO: Consider spinner's onCancel or other solution when @clack/prompts@1.0 is released
    // We disable/enable the exit hook to friend it with spinner's "Cancel" event
    const loader = spinner()

    this.#disableExitHook?.()
    loader.start(message)

    const result = await promise

    loader.stop(message)
    this.#enableExitHook()

    return result
  }

  async render(_object: any, node: React.ReactNode) {
    // Without waiting for the next tick after clack prompts,
    // ink render will be immidiately terminated
    await setImmediate()

    const app = render(node)
    await app.waitUntilExit()
  }

  #disableExitHook?: ReturnType<typeof exitHook>
  #enableExitHook() {
    this.#disableExitHook = exitHook(() => this.#handleExit())
  }

  #handleExit() {
    outro(
      `Problems? ${pc.underline(pc.cyan("https://github.com/datisthq/dpkit/issues"))}`,
    )
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
