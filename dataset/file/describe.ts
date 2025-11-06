import { prefetchFile } from "./fetch.ts"
import { inferBytes, inferHash } from "./infer.ts"
import type { HashType } from "./infer.ts"

export async function describeFile(
  path: string,
  options?: { hashType?: HashType },
) {
  const localPath = await prefetchFile(path)

  const bytes = await inferBytes(localPath)
  const hash = await inferHash(localPath, { hashType: options?.hashType })

  return { bytes, hash }
}
