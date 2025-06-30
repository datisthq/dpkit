import type { Field } from "@dpkit/core"
import type { TableError } from "../error/index.js"
import type { Table } from "../table/index.js"
import type { PolarsField } from "./Field.js"
import { checkCellEnum } from "./checks/enum.js"
import { checkCellMaxLength } from "./checks/maxLength.js"
import { checkCellMaximum } from "./checks/maximum.js"
import { checkCellMinLength } from "./checks/minLength.js"
import { checkCellMinimum } from "./checks/minimum.js"
import { checkCellPattern } from "./checks/pattern.js"
import { checkCellRequired } from "./checks/required.js"
import { checkCellType } from "./checks/type.js"
import { checkCellUnique } from "./checks/unique.js"

export function inspectField(
  field: Field,
  options: {
    errorTable: Table
    polarsField: PolarsField
  },
) {
  const { polarsField } = options
  const errors: TableError[] = []

  const nameErrors = inspectName(field, polarsField)
  errors.push(...nameErrors)

  const typeErrors = inspectType(field, polarsField)
  errors.push(...typeErrors)

  const errorTable = !typeErrors.length
    ? inspectCells(field, options.errorTable)
    : options.errorTable

  return { errors, errorTable }
}

function inspectName(field: Field, polarsField: PolarsField) {
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

function inspectType(field: Field, polarsField: PolarsField) {
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

function inspectCells(field: Field, errorTable: Table) {
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
