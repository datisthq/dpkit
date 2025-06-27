import { access } from "node:fs/promises"

export async function isLocalPathExist(path: string) {
  try {
    await access(path)
    return true
  } catch (error) {
    return false
  }
}

export async function assertLocalPathVacant(path: string) {
  const isExist = await isLocalPathExist(path)

  if (isExist) {
    throw new Error(`Path "${path}" already exists`)
  }
}
