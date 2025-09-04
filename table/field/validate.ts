import type { Field } from "@dpkit/core"
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

export function validateField(
  field: Field,
  options: {
    errorTable: Table
    polarsField: PolarsField
  },
) {
  const { polarsField } = options
  const errors: TableError[] = []

  const nameErrors = validateName(field, polarsField)
  errors.push(...nameErrors)

  const typeErrors = validateType(field, polarsField)
  errors.push(...typeErrors)

  const errorTable = !typeErrors.length
    ? validateCells(field, options.errorTable)
    : options.errorTable

  return { errors, errorTable }
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

  const actualFieldType = mapping[polarsField.type.variant]

  if (actualFieldType !== field.type && actualFieldType !== "string") {
    errors.push({
      type: "field/type",
      fieldName: field.name,
      fieldType: field.type,
      actualFieldType,
    })
  }

  return errors
}

function validateCells(field: Field, errorTable: Table) {
  errorTable = checkCellType(field, errorTable)
  errorTable = checkCellRequired(field, errorTable)
  errorTable = checkCellPattern(field, errorTable)
  errorTable = checkCellEnum(field, errorTable)
  errorTable = checkCellMinimum(field, errorTable)
  errorTable = checkCellMaximum(field, errorTable)
  errorTable = checkCellMinimum(field, errorTable, { isExclusive: true })
  errorTable = checkCellMaximum(field, errorTable, { isExclusive: true })
  errorTable = checkCellMinLength(field, errorTable)
  errorTable = checkCellMaxLength(field, errorTable)
  errorTable = checkCellUnique(field, errorTable)
  return errorTable
}
