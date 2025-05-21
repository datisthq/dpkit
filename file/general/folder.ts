import { mkdir } from "node:fs/promises"

export async function createFolder(props: { path: string }) {
  await mkdir(props.path, { recursive: true })
}
