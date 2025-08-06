import { readFile } from "node:fs/promises"
import type { Dialect, Resource } from "@dpkit/core"
import { loadDialect } from "@dpkit/core"
import { prefetchFiles } from "@dpkit/file"
import type { Table } from "@dpkit/table"
import { concat } from "nodejs-polars"
import { DataFrame, scanJson } from "nodejs-polars"

export async function loadJsonTable(resource: Partial<Resource>) {
  const paths = await prefetchFiles(resource.path)
  if (!paths.length) {
    return DataFrame().lazy()
  }

  const dialect =
    typeof resource.dialect === "string"
      ? await loadDialect(resource.dialect)
      : resource.dialect

  const tables: Table[] = []
  for (const path of paths) {
    const buffer = await readFile(path)
    let data = JSON.parse(buffer.toString("utf-8"))

    if (dialect) {
      data = processData(data, dialect)
    }

    const table = DataFrame(data).lazy()
    tables.push(table)
  }

  const table = concat(tables)
  return table
}

export async function loadJsonlTable(resource: Partial<Resource>) {
  const paths = await prefetchFiles(resource.path)
  if (!paths.length) {
    return DataFrame().lazy()
  }

  const dialect =
    typeof resource.dialect === "string"
      ? await loadDialect(resource.dialect)
      : resource.dialect

  const tables: Table[] = []
  for (const path of paths) {
    if (!dialect) {
      const table = scanJson(path)
      tables.push(table)
      continue
    }

    const buffer = await readFile(path)
    let data = buffer
      .toString("utf-8")
      .split("\n")
      .map(line => JSON.parse(line))

    data = processData(data, dialect)
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
