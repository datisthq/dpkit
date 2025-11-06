import { prefetchFile } from "@dpkit/dataset"
import {
  inferBytes,
  inferEncoding,
  inferHash,
} from "@dpkit/dataset"
import type { Resource } from "@dpkit/metadata"
import { inferFormat, inferName } from "@dpkit/metadata"
import type { InferDialectOptions } from "@dpkit/table"
import type { InferSchemaOptions } from "@dpkit/table"
import { inferDialect } from "../dialect/index.ts"
import { inferSchema } from "../schema/index.ts"

// TODO: Support multipart resources? (clarify on the specs level)

export async function inferResource(
  resource: Partial<Resource>,
  options?: InferDialectOptions & InferSchemaOptions,
) {
  const result = {
    ...resource,
    name: resource.name ?? inferName(resource),
  }

  if (!result.format) {
    result.format = inferFormat(resource)
  }

  if (typeof resource.path === "string") {
    const localPath = await prefetchFile(resource.path)
    const localResource = { ...resource, path: localPath }

    if (!result.encoding) {
      const encoding = await inferEncoding(localPath)
      if (encoding) {
        result.encoding = encoding
      }
    }

    if (!result.bytes) {
      result.bytes = await inferBytes(localPath)
    }

    if (!result.hash) {
      result.hash = await inferHash(localPath)
    }

    if (!result.dialect) {
      try {
        result.dialect = await inferDialect(localResource, options)
      } catch {}
    }

    if (!result.schema) {
      try {
        result.schema = await inferSchema(localResource, options)
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
