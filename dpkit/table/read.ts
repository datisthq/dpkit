import type { Resource } from "@dpkit/core"
import type { Table } from "@dpkit/table"
import { inferSchema, processTable } from "@dpkit/table"
import { inferDialect } from "../dialect/index.js"
import { loadTable } from "./load.js"

export async function readTable(
  resource: Partial<Resource>,
  options?: {
    infer?: boolean | "dialect" | "schema"
  },
): Promise<Table> {
  const { infer } = options ?? {}

  const withInferDialect = infer === true || infer === "dialect"
  const withInferSchema = infer === true || infer === "schema"

  let dialect = resource.dialect
  if (!dialect && withInferDialect) {
    dialect = await inferDialect(resource)
  }

  const table = await loadTable({ ...resource, dialect })

  let schema = resource.schema
  if (!schema && withInferSchema) {
    schema = await inferSchema(table)
  }

  return await processTable(table, { schema })
}
