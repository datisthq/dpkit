import type { FileError } from "@dpkit/metadata"
import { createReport } from "@dpkit/metadata"
import type { Resource } from "@dpkit/metadata"
import { prefetchFiles } from "./fetch.ts"
import { inferBytes, inferEncoding, inferHash } from "./infer.ts"

export async function validateFile(resource: Partial<Resource>) {
  const errors: FileError[] = []
  const localPaths = await prefetchFiles(resource.path)

  if (resource.bytes) {
    const bytes = resource.bytes
    const actualBytes = await inferBytes(localPaths)

    if (bytes !== actualBytes) {
      errors.push({
        type: "file/bytes",
        bytes,
        actualBytes,
      })
    }
  }

  if (resource.hash) {
    const [hashValue, hashType = "md5"] = resource.hash.split(":").toReversed()

    const hash = `${hashType}:${hashValue}`
    const actualHash = await inferHash(localPaths, {
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

  if (resource.encoding) {
    const encoding = resource.encoding
    const actualEncoding = await inferEncoding(localPaths)

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
