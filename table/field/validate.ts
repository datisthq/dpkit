import type { Field } from "@dpkit/core"
import { col, lit, when } from "nodejs-polars"
import type { CellError, FieldError, TableError } from "../error/index.ts"
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
import { substituteField } from "./substitute.ts"

export async function validateField(
  field: Field,
  options: {
    polarsField: PolarsField
    maxErrors: number
    table: Table
  },
) {
  const { polarsField, maxErrors, table } = options
  const errors: TableError[] = []

  const nameErrors = validateName(field, polarsField)
  errors.push(...nameErrors)

  const typeErrors = validateType(field, polarsField)
  errors.push(...typeErrors)

  if (!typeErrors.length) {
    const dataErorrs = await validateData(field, polarsField, maxErrors, table)
    errors.push(...dataErorrs)
  }

  return { errors, valid: !errors.length }
}

function validateName(field: Field, polarsField: PolarsField) {
  const errors: FieldError[] = []

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
  const errors: FieldError[] = []

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

async function validateData(
  field: Field,
  polarsField: PolarsField,
  maxErrors: number,
  table: Table,
) {
  const errors: CellError[] = []
  const fieldExpr = col(polarsField.name)

  let fieldCheckTable = table
    .withRowCount()
    .select(
      col("row_nr").add(1).alias("number"),
      normalizeField(field, fieldExpr).alias("target"),
      substituteField(field, fieldExpr).alias("source"),
      lit(null).alias("error"),
    )

  for (const checkCell of [
    checkCellType,
    checkCellRequired,
    checkCellPattern,
    checkCellUnique,
  ]) {
    const check = checkCell(field, col("target"), col("source"))

    if (check) {
      fieldCheckTable = fieldCheckTable.withColumn(
        when(col("error").isNotNull())
          .then(col("error"))
          .when(check.isErrorExpr)
          .then(lit(JSON.stringify(check.errorTemplate)))
          .otherwise(lit(null))
          .alias("error"),
      )
    }
  }

  const fieldCheckFrame = await fieldCheckTable
    .filter(col("error").isNotNull())
    .drop(["target"])
    .head(maxErrors)
    .collect()

  for (const row of fieldCheckFrame.toRecords() as any[]) {
    const errorTemplate = JSON.parse(row.error) as CellError
    errors.push({
      ...errorTemplate,
      rowNumber: row.number,
      cell: String(row.source ?? ""),
    })
  }

  return errors
}
