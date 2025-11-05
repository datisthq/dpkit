import type { Dialect, Resource } from "@dpkit/core"
import { resolveDialect } from "@dpkit/core"
import { resolveSchema } from "@dpkit/core"
import { loadFile, prefetchFiles } from "@dpkit/file"
import type { LoadTableOptions } from "../../../plugin.ts"
import { inferSchemaFromTable } from "../../../schema/index.ts"
import { normalizeTable } from "../../../table/index.ts"
import type { Table } from "../../../table/index.ts"
import * as pl from "nodejs-polars"
import { decodeJsonBuffer } from "../buffer/index.ts"

export async function loadJsonTable(
  resource: Partial<Resource> & { format?: "json" | "jsonl" | "ndjson" },
  options?: LoadTableOptions,
) {
  const isLines = resource.format === "jsonl" || resource.format === "ndjson"

  const paths = await prefetchFiles(resource.path)
  if (!paths.length) {
    throw new Error("Resource path is not defined")
  }

  const dialect = await resolveDialect(resource.dialect)

  const tables: Table[] = []
  for (const path of paths) {
    if (isLines && !dialect) {
      const table = pl.scanJson(path)
      tables.push(table)
      continue
    }

    const buffer = await loadFile(path)
    let data = decodeJsonBuffer(buffer, { isLines })
    if (dialect) {
      data = processData(data, dialect)
    }

    const table = pl.DataFrame(data).lazy()
    tables.push(table)
  }

  let table = pl.concat(tables)

  if (!options?.denormalized) {
    let schema = await resolveSchema(resource.schema)
    if (!schema) schema = await inferSchemaFromTable(table, options)
    table = await normalizeTable(table, schema)
  }

  return table
}

function processData(data: any, dialect: Dialect) {
  if (dialect.property) {
    data = data[dialect.property]
  }

  if (dialect.itemType === "array") {
    const keys = data[0]

    data = data
      .slice(1)
      .map((row: any) =>
        Object.fromEntries(
          keys.map((key: any, index: number) => [key, row[index]]),
        ),
      )
  }

  if (dialect.itemKeys) {
    const keys = dialect.itemKeys

    data = data.map((row: any) =>
      Object.fromEntries(keys.map((key: any) => [key, row[key]])),
    )
  }

  return data
}
