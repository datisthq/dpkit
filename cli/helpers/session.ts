import { setImmediate } from "node:timers/promises"
import { spinner } from "@clack/prompts"
import { intro, log, outro, select } from "@clack/prompts"
import type { SelectOptions } from "@clack/prompts"
import { render } from "ink"
import invariant from "tiny-invariant"

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

  object(object: Record<string, any>) {
    console.log(object)
  }

  async select<T>(options: SelectOptions<T>) {
    return String(await select(options))
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

  object(object: Record<string, any>) {
    console.log(JSON.stringify(object, null, 2))
  }

  async select<T>(_options: SelectOptions<T>): Promise<string> {
    Session.terminate("Selection is not supported in JSON mode")
  }

  async render(..._args: Parameters<typeof render>) {
    invariant(false, "Render must not be used in JSON mode")
  }

  async task<T>(_message: string, promise: Promise<T>) {
    return await promise
  }
}
