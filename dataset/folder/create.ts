import { mkdir } from "node:fs/promises"

export async function createFolder(path: string) {
  await mkdir(path, { recursive: true })
}
