import { setImmediate } from "node:timers/promises"
import { spinner } from "@clack/prompts"
import { intro, log, outro, select } from "@clack/prompts"
import type { SelectOptions } from "@clack/prompts"
import { render } from "ink"

export class Session {
  static create(options?: { json?: boolean }) {
    return options?.json ? new JsonSession() : new Session()
  }

  static terminate(message: string): never {
    log.error(message)
    process.exit(1)
  }

  intro(message: string) {
    intro(message)
  }

  outro(message: string) {
    outro(message)
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

  async render(...args: Parameters<typeof render>) {
    // Without waiting for the next tick after clack prompts,
    // ink render will be immidiately terminated
    await setImmediate()

    const app = render(...args)
    await app.waitUntilExit()
  }
}

export class JsonSession extends Session {
  intro = () => {}
  outro = () => {}

  // @ts-ignore
  async select<T>(options: SelectOptions<T>) {
    Session.terminate("Interactive mode is not supported with JSON output")
  }

  async task<T>(_message: string, promise: Promise<T>) {
    return await promise
  }
}
