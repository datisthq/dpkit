import type { Dialect, Resource } from "@dpkit/core"
import { loadResourceDialect } from "@dpkit/core"
import { loadResourceSchema } from "@dpkit/core"
import { loadFile, prefetchFiles } from "@dpkit/file"
import type { LoadTableOptions } from "@dpkit/table"
import { normalizeTable, inferTableSchema } from "@dpkit/table"
import type { Table } from "@dpkit/table"
import { concat } from "nodejs-polars"
import { DataFrame, scanJson } from "nodejs-polars"
import { decodeJsonBuffer } from "../buffer/index.ts"

export async function loadJsonTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  return await loadTable(resource, { ...options, isLines: false })
}

export async function loadJsonlTable(
  resource: Partial<Resource>,
  options?: LoadTableOptions,
) {
  return await loadTable(resource, { ...options, isLines: true })
}

async function loadTable(
  resource: Partial<Resource>,
  options: LoadTableOptions & { isLines: boolean },
) {
  const { isLines } = options

  const paths = await prefetchFiles(resource.path)
  if (!paths.length) {
    throw new Error("Resource path is not defined")
  }

  const dialect = await loadResourceDialect(resource.dialect)

  const tables: Table[] = []
  for (const path of paths) {
    if (isLines && !dialect) {
      const table = scanJson(path)
      tables.push(table)
      continue
    }

    const buffer = await loadFile(path)
    let data = decodeJsonBuffer(buffer, { isLines })
    if (dialect) {
      data = processData(data, dialect)
    }

    const table = DataFrame(data).lazy()
    tables.push(table)
  }

  let table = concat(tables)

  if (!options?.denormalized) {
    let schema = await loadResourceSchema(resource.schema)
    if (!schema) schema = await inferTableSchema(table, options)
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
