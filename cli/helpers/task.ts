import { spinner } from "@clack/prompts"

export async function task<T>(message: string, promise: Promise<T>) {
  const loader = spinner()
  loader.start(message)
  const result = await promise
  loader.stop(message)
  return result
}
