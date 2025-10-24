import type { FileError } from "../error/index.ts"
import { prefetchFiles } from "./fetch.ts"
import { inferFileBytes, inferFileEncoding, inferFileHash } from "./infer.ts"

export async function validateFile(
  path?: string | string[],
  options?: { bytes?: number; hash?: string; encoding?: string },
) {
  const errors: FileError[] = []
  const localPaths = await prefetchFiles(path)

  if (options?.bytes) {
    const bytes = await inferFileBytes(localPaths)
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
    const hash = await inferFileHash(localPaths, {
      hashType: hashType as any,
    })

    if (hash !== options.hash) {
      errors.push({
        type: "file/hash",
        hash: options.hash,
        actualHash: hash,
      })
    }
  }

  if (options?.encoding) {
    const encoding = await inferFileEncoding(localPaths)

    if (encoding && encoding !== options.encoding) {
      errors.push({
        type: "file/encoding",
        encoding: options.encoding,
        actualEncoding: encoding,
      })
    }
  }

  const valid = errors.length === 0
  return { valid, errors }
}
