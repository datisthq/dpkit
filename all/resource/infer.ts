import type { Resource } from "@dpkit/core"
import { inferResourceFormat, inferResourceName } from "@dpkit/core"
import { prefetchFile } from "@dpkit/file"
import { inferFileBytes, inferFileEncoding, inferFileHash } from "@dpkit/file"
import { inferTable } from "../table/index.ts"

// TODO: Support multipart resources? (clarify on the specs level)

export async function inferResource(resource: Partial<Resource>) {
  const result = {
    ...resource,
    name: resource.name ?? inferResourceName(resource),
  }

  if (!result.format) {
    result.format = inferResourceFormat(resource)
  }

  if (typeof resource.path === "string") {
    const localPath = await prefetchFile(resource.path)

    if (!result.encoding) {
      const encoding = await inferFileEncoding(localPath)
      if (encoding) {
        result.encoding = encoding
      }
    }

    if (!result.bytes) {
      result.bytes = await inferFileBytes(localPath)
    }

    if (!result.hash) {
      result.hash = await inferFileHash(localPath)
    }

    if (!result.schema) {
      try {
        const localResource = { ...resource, path: localPath }
        const { dialect, schema } = await inferTable(localResource)

        result.dialect = dialect
        result.schema = schema
      } catch {}
    }
  }

  if (!result.type) {
    if (result.schema) {
      result.type = "table"
    }
  }

  return result
}
