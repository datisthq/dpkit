import type { Field } from "@dpkit/core"
import type { TableError } from "../error/index.js"
import type { PolarsField } from "./Field.js"

export function validateField(
  field: Field,
  options: {
    polarsField: PolarsField
  },
) {
  const { polarsField } = options
  const errors: TableError[] = []

  const nameErrors = validateFieldName(field, polarsField)
  errors.push(...nameErrors)

  const typeErrors = validateFieldType(field, polarsField)
  errors.push(...typeErrors)

  return errors
}

function validateFieldName(field: Field, polarsField: PolarsField) {
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

function validateFieldType(field: Field, polarsField: PolarsField) {
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
