import type { Dialect, Resource } from "@dpkit/core"
import { loadResourceDialect } from "@dpkit/core"
import { loadFile, prefetchFiles } from "@dpkit/file"
import type { Table } from "@dpkit/table"
import { concat } from "nodejs-polars"
import { DataFrame, scanJson } from "nodejs-polars"
import { decodeJsonBuffer } from "../buffer/index.ts"

export async function loadJsonTable(resource: Partial<Resource>) {
  return await loadTable(resource, { isLines: false })
}

export async function loadJsonlTable(resource: Partial<Resource>) {
  return await loadTable(resource, { isLines: true })
}

async function loadTable(
  resource: Partial<Resource>,
  options: { isLines: boolean },
) {
  const { isLines } = options

  const paths = await prefetchFiles(resource.path)
  if (!paths.length) {
    return DataFrame().lazy()
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

  const table = concat(tables)
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
