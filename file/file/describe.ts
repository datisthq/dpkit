import { prefetchFile } from "./fetch.ts"
import { inferFileBytes, inferFileHash } from "./infer.ts"
import type { HashType } from "./infer.ts"

export async function describeFile(
  path: string,
  options?: { hashType?: HashType },
) {
  const localPath = await prefetchFile(path)

  const bytes = await inferFileBytes(localPath)
  const hash = await inferFileHash(localPath, { hashType: options?.hashType })

  return { bytes, hash }
}
