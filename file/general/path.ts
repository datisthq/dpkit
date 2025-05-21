import { access } from "node:fs/promises"

export async function isLocalPathExist(props: { path: string }) {
  try {
    await access(props.path)
    return true
  } catch (error) {
    return false
  }
}

export async function assertLocalPathVacant(props: { path: string }) {
  const isExist = await isLocalPathExist({ path: props.path })

  if (isExist) {
    throw new Error(`Path "${props.path}" already exists`)
  }
}
