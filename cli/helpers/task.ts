import { setTimeout } from "node:timers/promises"
import { spinner } from "@clack/prompts"

export async function task<T>(message: string, promise: Promise<T>) {
  const loader = spinner()
  loader.start(message)
  const result = await promise
  loader.stop(message)
  // Without this delay, the following ink render will be immidiately terminated
  await setTimeout(100)
  return result
}
