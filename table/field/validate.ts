import type { Field } from "@dpkit/core"
import { col, lit } from "nodejs-polars"
import type { TableError } from "../error/index.ts"
import type { Table } from "../table/index.ts"
import type { PolarsField } from "./Field.ts"
import { checkCellEnum } from "./checks/enum.ts"
import { checkCellMaxLength } from "./checks/maxLength.ts"
import { checkCellMaximum } from "./checks/maximum.ts"
import { checkCellMinLength } from "./checks/minLength.ts"
import { checkCellMinimum } from "./checks/minimum.ts"
import { checkCellPattern } from "./checks/pattern.ts"
import { checkCellRequired } from "./checks/required.ts"
import { checkCellType } from "./checks/type.ts"
import { checkCellUnique } from "./checks/unique.ts"
import { normalizeField } from "./normalize.ts"
import { parseField } from "./parse.ts"
import { substituteField } from "./substitute.ts"

export async function validateField(
  field: Field,
  options: {
    table: Table
    polarsField: PolarsField
  },
) {
  const { polarsField } = options
  const errors: TableError[] = []

  const nameErrors = validateName(field, polarsField)
  errors.push(...nameErrors)

  const typeErrors = validateType(field, polarsField)
  errors.push(...typeErrors)

  if (!typeErrors.length) {
    const dataErorrs = validateData(field, options.polarsField, options.table)
    errors.push(...dataErorrs)
  }

  return { errors, valid: !errors.length }
}

function validateName(field: Field, polarsField: PolarsField) {
  const errors: TableError[] = []

  if (field.name !== polarsField.name) {
    errors.push({
      type: "field/name",
      fieldName: field.name,
      actualFieldName: polarsField.name,
    })
  }

  return errors
}

function validateType(field: Field, polarsField: PolarsField) {
  const errors: TableError[] = []

  const mapping: Record<string, Field["type"]> = {
    Bool: "boolean",
    Date: "date",
    Datetime: "datetime",
    Float32: "number",
    Float64: "number",
    Int16: "integer",
    Int32: "integer",
    Int64: "integer",
    Int8: "integer",
    List: "list",
    String: "string",
    Time: "time",
    UInt16: "integer",
    UInt32: "integer",
    UInt64: "integer",
    UInt8: "integer",
    Utf8: "string",
  }

  const actualFieldType = mapping[polarsField.type.variant] ?? "any"

  if (actualFieldType !== field.type && actualFieldType !== "string") {
    errors.push({
      type: "field/type",
      fieldName: field.name,
      fieldType: field.type ?? "any",
      actualFieldType,
    })
  }

  return errors
}

function validateData(field: Field, polarsField: PolarsField, table: Table) {
  const fieldExpr = col(polarsField.name)

  const fieldTable = table
    .withRowCount()
    .select(
      col("row_nr").add(1).alias("number"),
      substituteField(field, fieldExpr).alias("source"),
      normalizeField(field, fieldExpr).alias("target"),
      lit(null).alias("error"),
    )

  return []
}
