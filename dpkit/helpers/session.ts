import { setImmediate } from "node:timers/promises"
import { spinner } from "@clack/prompts"
import { intro, log, outro, select } from "@clack/prompts"
import type { SelectOptions } from "@clack/prompts"
import exitHook from "exit-hook"
import { render } from "ink"
import pc from "picocolors"
import type React from "react"

type SessionSelectOptions<T> = SelectOptions<T> & { skipable?: boolean }

export class Session {
  title: string
  debug: boolean
  silent: boolean
  quit: boolean
  all: boolean

  static create(options: {
    title: string
    json?: boolean
    text?: boolean
    debug?: boolean
    silent?: boolean
    quit?: boolean
    all?: boolean
  }) {
    let session = new Session(options)

    if (options.text) session = new TextSession(options)
    if (options.json) session = new JsonSession(options)

    session.start()
    return session
  }

  constructor(options: {
    title: string
    debug?: boolean
    silent?: boolean
    quit?: boolean
    all?: boolean
  }) {
    this.title = options.title
    this.silent = options.silent ?? false
    this.debug = options.debug ?? false
    this.quit = options.quit ?? false
    this.all = options.all ?? false
  }
  start() {
    if (!this.silent) {
      intro(pc.bold(this.title))
    }

    this.#enableExitHook()
  }

  success(message: string) {
    if (!this.silent) {
      log.success(message)
    }
  }

  error(message: string) {
    log.error(message)
  }

  terminate(message: string): never {
    log.error(message)
    process.exit(1)
  }

  async select<T>(options: SessionSelectOptions<T>) {
    if (options.skipable) {
      if (this.quit || this.all) return undefined
    }

    return await select(options)
  }

  async task<T>(message: string, promise: Promise<T>) {
    // TODO: Consider spinner's onCancel or other solution when @clack/prompts@1.0 is released
    // We disable/enable the exit hook to friend it with spinner's "Cancel" event
    const loader = spinner()

    this.#disableExitHook?.()
    if (!this.silent) {
      loader.start(message)
    }

    try {
      const result = await promise

      if (!this.silent) {
        loader.stop(message)
      }

      this.#enableExitHook()
      return result
    } catch (error) {
      if (!this.silent) {
        loader.stop(message, 1)
      }

      if (this.debug) {
        throw error
      }

      console.log(String(error))
      process.exit(1)
    }
  }

  async render(_object: any, node?: React.ReactNode) {
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
    if (!this.silent) {
      outro(
        `Problems? ${pc.underline(pc.cyan("https://github.com/datisthq/dpkit/issues"))}`,
      )
    }
  }
}

class JsonSession extends Session {
  start = () => {}
  success = () => {}
  error = () => {}

  terminate(message: string): never {
    console.log(JSON.stringify({ error: message }, null, 2))
    process.exit(1)
  }

  async select<T>(options: SessionSelectOptions<T>) {
    if (options.skipable) {
      return undefined
    }

    this.terminate("Selection is not supported in JSON mode")
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

  async select<T>(options: SessionSelectOptions<T>) {
    if (options.skipable) {
      return undefined
    }

    this.terminate("Selection is not supported in TEXT mode")
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
