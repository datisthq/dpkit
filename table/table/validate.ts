import type { Schema } from "@dpkit/core"
import { loadSchema } from "@dpkit/core"
import { getPolarsFields } from "../polars/index.js"
import type { PolarsField } from "../polars/index.js"
//import { validateColumn } from "../column/index.js"
import type { ColumnError, TableError } from "./Error.js"
import type { Table } from "./Table.js"

export async function validateTable(props: {
  table: Table
  schema: Schema | string
  sampleSize?: number
}) {
  const { table, sampleSize = 100 } = props
  const errors: TableError[] = []

  const schema =
    typeof props.schema === "string"
      ? await loadSchema({ path: props.schema })
      : props.schema

  const sample = await table.head(sampleSize).collect()
  const polarsFields = getPolarsFields({ polarsSchema: sample.schema })

  validateStructure({ schema, polarsFields })

  return errors
}

function validateStructure(props: {
  schema: Schema
  polarsFields: PolarsField[]
}) {
  const { schema, polarsFields } = props
  const errors: ColumnError[] = []

  const fieldsMatch = schema.fieldsMatch ?? "exact"

  if (fieldsMatch === "exact") {
    polarsFields
  }

  return errors
}
