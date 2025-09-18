import { setImmediate } from "node:timers/promises"
import { setTimeout } from "node:timers/promises"
import { spinner } from "@clack/prompts"
import { intro, log, outro, select } from "@clack/prompts"
import type { SelectOptions } from "@clack/prompts"
import exitHook from "exit-hook"
import { render } from "ink"
import pc from "picocolors"
import type React from "react"

export class Session {
  title: string
  debug: boolean

  static create(options: {
    title: string
    json?: boolean
    text?: boolean
    debug?: boolean
  }) {
    let session = new Session(options)

    if (options.json) session = new JsonSession(options)
    if (options.text) session = new TextSession(options)

    session.start()
    return session
  }

  static terminate(message: string): never {
    log.error(message)
    process.exit(1)
  }

  constructor(options: { title: string; debug?: boolean }) {
    this.title = options.title
    this.debug = options.debug ?? false
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

    try {
      const result = await promise

      loader.stop(message)
      this.#enableExitHook()

      return result
    } catch (error) {
      loader.stop(message, 1)

      if (this.debug) {
        throw error
      }

      console.log(String(error))
      process.exit(1)
    }
  }

  async render(
    _object: any,
    node?: React.ReactNode,
    //options?: { quit?: boolean },
  ) {
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

class JsonSession extends Session {
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
    try {
      return await promise
    } catch (error) {
      console.log(JSON.stringify({ error: String(error) }, null, 2))
      process.exit(1)
    }
  }
}

class TextSession extends Session {
  start = () => {}
  success = () => {}
  error = () => {}

  async select<T>(_options: SelectOptions<T>): Promise<symbol | T> {
    Session.terminate("Selection is not supported in TEXT mode")
  }

  async render(object: any, _node: React.ReactNode) {
    console.log(String(object))
  }

  async task<T>(_message: string, promise: Promise<T>) {
    try {
      return await promise
    } catch (error) {
      console.log(String(error))
      process.exit(1)
    }
  }
}
