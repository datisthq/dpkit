import type { Field } from "@dpkit/core"

export type StringifyFieldOptions = {
  missingValue?: string
}

export function stringifyField(field: Field, options?: StringifyFieldOptions) {
  console.log(field)
  console.log(options)
}
