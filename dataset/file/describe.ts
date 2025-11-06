import { prefetchFile } from "./fetch.ts"
import { inferBytes, inferHash } from "./infer.ts"
import type { HashType } from "./infer.ts"

export async function describeFile(
  path: string,
  options?: { hashType?: HashType },
) {
  const localPath = await prefetchFile(path)

  const bytes = await inferBytes({ path: localPath })
  const hash = await inferHash(
    { path: localPath },
    { hashType: options?.hashType },
  )

  return { bytes, hash }
}
