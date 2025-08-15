import { stat } from "node:fs/promises"
import { hashFile } from "hasha"
import { prefetchFile } from "./fetch.ts"

export async function describeFile(
  path: string,
  options?: { hashType?: "sha256" },
) {
  const hashType = options?.hashType ?? "sha256"
  const localPath = await prefetchFile(path)

  const bytes = (await stat(localPath)).size
  const hash = await hashFile(localPath, { algorithm: hashType })

  return { bytes, hash }
}
