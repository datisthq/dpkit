import type { FileError } from "../error/index.ts"
import { prefetchFile } from "./fetch.ts"
import { inferFileBytes, inferFileHash } from "./infer.ts"

export async function validateFile(
  path: string,
  options?: { bytes?: number; hash?: string },
) {
  const errors: FileError[] = []
  const localPath = await prefetchFile(path)

  if (options?.bytes) {
    const bytes = await inferFileBytes(localPath)
    if (bytes !== options.bytes) {
      errors.push({
        type: "file/bytes",
        bytes: options.bytes,
        actualBytes: bytes,
      })
    }
  }

  if (options?.hash) {
    const [_hashValue, hashType = "md5"] = options.hash.split(":").toReversed()
    // TODO: figure out how we should handle other hash types
    // @ts-ignore
    const hash = await inferFileHash(localPath, { hashType })
    if (hash !== options.hash) {
      errors.push({
        type: "file/hash",
        hash: options.hash,
        actualHash: hash,
      })
    }
  }

  const valid = errors.length === 0
  return { valid, errors }
}
