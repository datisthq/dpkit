import type { FileError } from "@dpkit/core"
import { createReport } from "@dpkit/core"
import { prefetchFiles } from "./fetch.ts"
import { inferFileBytes, inferFileEncoding, inferFileHash } from "./infer.ts"

export async function validateFile(
  path?: string | string[],
  options?: { bytes?: number; hash?: string; encoding?: string },
) {
  const errors: FileError[] = []
  const localPaths = await prefetchFiles(path)

  if (options?.bytes) {
    const bytes = options.bytes
    const actualBytes = await inferFileBytes(localPaths)

    if (bytes !== actualBytes) {
      errors.push({
        type: "file/bytes",
        bytes,
        actualBytes,
      })
    }
  }

  if (options?.hash) {
    const [hashValue, hashType = "md5"] = options.hash.split(":").toReversed()

    const hash = `${hashType}:${hashValue}`
    const actualHash = await inferFileHash(localPaths, {
      hashType: hashType as any,
    })

    if (hash !== actualHash) {
      errors.push({
        type: "file/hash",
        hash,
        actualHash,
      })
    }
  }

  if (options?.encoding) {
    const encoding = options.encoding
    const actualEncoding = await inferFileEncoding(localPaths)

    if (actualEncoding) {
      if (encoding !== actualEncoding) {
        errors.push({
          type: "file/encoding",
          encoding,
          actualEncoding,
        })
      }
    }
  }

  return createReport(errors)
}
